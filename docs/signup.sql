-- Supabase backend behind /signup/ and /admin/. Paste into the SQL editor once; re-running is safe.
-- New tables only (gxp_ prefix). RLS is on with no policies, so the publishable key can only call the functions below.
-- /admin/ has no passcode: anyone with the page URL can list and remove signups.
-- Each event is one row in gxp_events (bottom of this file): title, people per slot (cap), minutes between slot starts,
-- minutes a showing takes, and its windows. The pages read the slots from gxp_event(), so adding an event is only an insert here.
-- Slots are clock multiples of slot_minutes inside each window; the last one in a window starts show_minutes before the window ends
-- unless the window sets "last". Editing an event's windows after signups exist can orphan signups on slots that vanish.
-- Any group size (1 to 99, a sanity ceiling). A slot with at least one spot left takes a group of any size, so it can pass the cap.
-- Full slots take a waitlist (waitlist = true rows). Removing a confirmed signup promotes the oldest waitlisted group, whatever its size.
-- All times are Pacific.

create table if not exists gxp_signups (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  slot text not null,
  name text not null,
  size int not null
);
alter table gxp_signups enable row level security;

alter table gxp_signups drop constraint if exists gxp_signups_size_check; -- the old 1 to 8 limit
alter table gxp_signups drop constraint if exists gxp_signups_size_range;
alter table gxp_signups add constraint gxp_signups_size_range check (size between 1 and 99);
alter table gxp_signups add column if not exists waitlist boolean not null default false;
-- signups from before there were events all belong to the first one
alter table gxp_signups add column if not exists event text not null default 'socal-ignition-2026';
alter table gxp_signups alter column event drop default;
create index if not exists gxp_signups_event_slot on gxp_signups (event, slot);

create table if not exists gxp_events (
  slug text primary key, -- the ?e= in the page URLs
  title text not null,
  cap int not null default 8,
  slot_minutes int not null default 15,
  show_minutes int not null default 30,
  windows jsonb not null -- [{"date":"2026-11-06","start":"18:30","end":"19:10","label":"optional heading","first":"optional HH:MM","last":"optional HH:MM"}]
);
alter table gxp_events enable row level security;

-- leftovers from earlier versions (no event argument, passcode, slot migration)
drop function if exists gxp_slots();
drop function if exists gxp_taken();
drop function if exists gxp_promote(text);
drop function if exists gxp_signup(text, text, int);
drop function if exists gxp_signup(text, text, int, boolean);
drop function if exists gxp_list();
drop function if exists gxp_list(text);
drop function if exists gxp_delete(bigint, text, text, int);
drop function if exists gxp_delete(text, bigint, text, text, int);
drop function if exists gxp_pass_ok(text);
drop table if exists gxp_config;

create or replace function gxp_mins(t text) returns int
language sql immutable as $$ select substr(t, 1, 2)::int * 60 + substr(t, 4, 2)::int $$;

-- every slot of an event: win is the index of its window, start_key e.g. '2026-11-06 18:30'
create or replace function gxp_slots(p_event text) returns table (win int, start_key text)
language sql stable security definer set search_path = public as $$
  select (x.i - 1)::int, (x.w->>'date') || ' ' || lpad((m / 60)::text, 2, '0') || ':' || lpad((m % 60)::text, 2, '0')
  from gxp_events e,
  jsonb_array_elements(e.windows) with ordinality x(w, i),
  lateral generate_series(
    ceil(gxp_mins(coalesce(x.w->>'first', x.w->>'start'))::numeric / e.slot_minutes)::int * e.slot_minutes,
    coalesce(gxp_mins(x.w->>'last'), gxp_mins(x.w->>'end') - e.show_minutes),
    e.slot_minutes) m
  where e.slug = p_event
$$;

-- what the pages need to draw an event: each window with its slot times ('18:30'). null for an unknown slug.
create or replace function gxp_event(p_slug text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('slug', e.slug, 'title', e.title, 'cap', e.cap, 'show', e.show_minutes, 'windows', (
    select jsonb_agg(x.w || jsonb_build_object('slots', (
      select coalesce(jsonb_agg(substr(s.start_key, 12) order by s.start_key), '[]'::jsonb) from gxp_slots(e.slug) s where s.win = x.i - 1
    )) order by x.i)
    from jsonb_array_elements(e.windows) with ordinality x(w, i)))
  from gxp_events e where e.slug = p_slug
$$;

create or replace function gxp_event_list() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(gxp_event(slug) order by slug), '[]'::jsonb) from gxp_events
$$;

-- taken: people confirmed per slot; waiting: people waitlisted per slot
create or replace function gxp_taken(p_event text) returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object(
    'taken', coalesce((select jsonb_object_agg(slot, n) from (select slot, sum(size)::int n from gxp_signups where event = p_event and not waitlist group by slot) a), '{}'::jsonb),
    'waiting', coalesce((select jsonb_object_agg(slot, n) from (select slot, sum(size)::int n from gxp_signups where event = p_event and waitlist group by slot) b), '{}'::jsonb))
$$;

-- Moves the oldest waitlisted groups into a slot while it has under cap confirmed (any size, so a slot can pass the cap). Returns who moved.
-- Called after every removal and before every signup, so a waitlist never sits next to open spots.
create or replace function gxp_promote(p_event text, p_slot text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_cap int := (select cap from gxp_events where slug = p_event);
  v_promoted jsonb := '[]'::jsonb;
  r record;
begin
  while (select coalesce(sum(size), 0) from gxp_signups where event = p_event and slot = p_slot and not waitlist) < v_cap loop
    update gxp_signups set waitlist = false
    where id = (select id from gxp_signups where event = p_event and slot = p_slot and waitlist order by id limit 1)
    returning name, size into r;
    exit when not found;
    v_promoted := v_promoted || jsonb_build_object('name', r.name, 'size', r.size);
  end loop;
  return v_promoted;
end $$;

-- p_waitlist is what the page showed (slot full). A full slot without it is refused; a slot with room confirms either way.
create or replace function gxp_signup(p_event text, p_slot text, p_name text, p_size int, p_waitlist boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_name text := left(btrim(coalesce(p_name, '')), 80);
  v_cap int := (select cap from gxp_events where slug = p_event);
  v_left int;
  v_pos int;
begin
  if not exists (select 1 from gxp_slots(p_event) where start_key = p_slot) then return jsonb_build_object('ok', false, 'error', 'Unknown slot'); end if;
  if p_slot <= to_char(now() at time zone 'America/Los_Angeles', 'YYYY-MM-DD HH24:MI') then
    return jsonb_build_object('ok', false, 'error', 'That slot has started');
  end if;
  if v_name = '' then return jsonb_build_object('ok', false, 'error', 'Name is required'); end if;
  if p_size is null or p_size < 1 or p_size > 99 then return jsonb_build_object('ok', false, 'error', 'Invalid group size'); end if;

  perform pg_advisory_xact_lock(hashtext('gxp_signup')); -- one change at a time, so the last spots cannot be double booked
  perform gxp_promote(p_event, p_slot);
  select v_cap - coalesce(sum(size), 0) into v_left from gxp_signups where event = p_event and slot = p_slot and not waitlist;
  if v_left < 1 then
    if not coalesce(p_waitlist, false) then
      return jsonb_build_object('ok', false, 'error', 'That time just filled up. You can join the waitlist.', 'left', 0) || gxp_taken(p_event);
    end if;
    insert into gxp_signups (event, slot, name, size, waitlist) values (p_event, p_slot, v_name, p_size, true);
    select count(*) into v_pos from gxp_signups where event = p_event and slot = p_slot and waitlist;
    return jsonb_build_object('ok', true, 'waitlisted', true, 'position', v_pos) || gxp_taken(p_event);
  end if;
  insert into gxp_signups (event, slot, name, size) values (p_event, p_slot, v_name, p_size);
  return jsonb_build_object('ok', true, 'waitlisted', false, 'left', greatest(v_left - p_size, 0)) || gxp_taken(p_event);
end $$;

create or replace function gxp_list(p_event text) returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object('ok', true, 'rows', coalesce(
    (select jsonb_agg(jsonb_build_object('row', id, 'ts', created_at, 'slot', slot, 'name', name, 'size', size, 'waitlist', waitlist) order by id) from gxp_signups where event = p_event),
    '[]'::jsonb))
$$;

-- the row must still match what the admin saw. Removing a signup promotes the waitlist (gxp_promote); 'promoted' lists who moved in.
create or replace function gxp_delete(p_event text, p_row bigint, p_slot text, p_name text, p_size int) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtext('gxp_signup'));
  delete from gxp_signups where event = p_event and id = p_row and slot = p_slot and name = p_name and size = p_size;
  if not found then return jsonb_build_object('ok', false, 'error', 'Row not found, refresh the list'); end if;
  return jsonb_build_object('ok', true, 'promoted', gxp_promote(p_event, p_slot));
end $$;

-- Events. Add one by copying a block; re-running updates an existing slug in place.
insert into gxp_events (slug, title, cap, slot_minutes, show_minutes, windows) values (
  'socal-ignition-2026', 'SoCal Ignition 2026', 8, 15, 30, '[
    {"date":"2026-11-06","start":"18:30","end":"19:10"},
    {"date":"2026-11-06","start":"20:30","end":"22:00"},
    {"date":"2026-11-07","start":"09:00","end":"10:00","label":"Registration"},
    {"date":"2026-11-07","start":"12:00","end":"13:00","label":"Lunch"},
    {"date":"2026-11-07","start":"14:15","end":"15:00","label":"Middle School workshops","first":"14:15","last":"14:45"},
    {"date":"2026-11-07","start":"15:00","end":"16:00","label":"High School workshops","first":"15:00","last":"15:45"},
    {"date":"2026-11-07","start":"16:00","end":"16:30","label":"Passing period","first":"16:00","last":"16:15"},
    {"date":"2026-11-07","start":"18:00","end":"20:00","label":"Night market"}
  ]'::jsonb)
on conflict (slug) do update set title = excluded.title, cap = excluded.cap, slot_minutes = excluded.slot_minutes, show_minutes = excluded.show_minutes, windows = excluded.windows;
