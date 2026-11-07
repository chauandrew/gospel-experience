-- Supabase backend behind /signup/ and /admin/. Paste into the SQL editor once; re-running is safe.
-- New tables only (gxp_ prefix). RLS is on with no policies, so the publishable key can only call the functions below.
-- /admin/ has no passcode: anyone with the page URL can list and remove signups.
-- Windows (gxp_slots) and the cap (8) must match src/signup.js. Change both together.
-- Slots are 15 minute clock quarter-hours; the last one in a window starts 30 minutes before the window ends (a showing takes 30).
-- Sat 2:15 to 4:30 is the exception: a slot at every quarter-hour from 2:15 to 4:15 (window end 4:45 here gives that).
-- Full slots take a waitlist (waitlist = true rows). Removing a confirmed signup promotes the oldest waitlisted group, whatever its size.

create table if not exists gxp_signups (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  slot text not null,
  name text not null,
  size int not null check (size between 1 and 8)
);
alter table gxp_signups enable row level security;

-- one-time copy of the signups as they were before the 15 minute move (never overwritten on re-run)
create table if not exists gxp_signups_bak_10min as table gxp_signups;
alter table gxp_signups_bak_10min enable row level security;

alter table gxp_signups add column if not exists waitlist boolean not null default false;

-- every slot start key, e.g. '2026-11-06 18:30': clock quarter-hours from the window start, last one 30 minutes before the window end
drop function if exists gxp_slots();
create or replace function gxp_slots() returns table (start_key text)
language sql immutable as $$
  select to_char(t, 'YYYY-MM-DD HH24:MI')
  from (values
    ('2026-11-06', '18:30', '19:10'),
    ('2026-11-06', '20:30', '22:00'),
    ('2026-11-07', '09:00', '10:00'),
    ('2026-11-07', '12:00', '13:00'),
    ('2026-11-07', '14:15', '16:45'),
    ('2026-11-07', '18:00', '20:00')
  ) w (d, s, e),
  lateral generate_series(
    date_trunc('hour', (w.d || ' ' || w.s)::timestamp) + ceil(extract(minute from (w.d || ' ' || w.s)::timestamp) / 15)::int * interval '15 minutes',
    (w.d || ' ' || w.e)::timestamp - interval '30 minutes',
    interval '15 minutes') t
$$;

-- Move signups still on an old slot to the nearest new slot that day (ties go earlier). If that leaves a slot over 8 people,
-- the later signups (by arrival, once the slot has 8 confirmed) become waitlisted. Nothing is deleted. Re-running is a no-op once every row is on a new slot.
do $$
declare v_moved text[];
begin
  with m as (
    select s.id, (
      select n.start_key from gxp_slots() n
      where left(n.start_key, 10) = left(s.slot, 10)
      order by abs((substr(n.start_key, 12, 2)::int * 60 + substr(n.start_key, 15, 2)::int) - (substr(s.slot, 12, 2)::int * 60 + substr(s.slot, 15, 2)::int)), n.start_key
      limit 1) new_slot
    from gxp_signups s
    where s.slot not in (select start_key from gxp_slots())
  ), u as (
    update gxp_signups g set slot = m.new_slot from m where g.id = m.id and m.new_slot is not null returning m.new_slot
  )
  select array_agg(distinct new_slot) into v_moved from u;

  update gxp_signups g set waitlist = true
  from (select id, sum(size) over (partition by slot order by id) - size as prior from gxp_signups where slot = any(v_moved) and not waitlist) x
  where g.id = x.id and x.prior >= 8; -- same rule as gxp_promote: a group goes in while the slot is under 8, whatever its size
end $$;

-- taken: people confirmed per slot; waiting: groups waitlisted per slot
create or replace function gxp_taken() returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object(
    'taken', coalesce((select jsonb_object_agg(slot, n) from (select slot, sum(size)::int n from gxp_signups where not waitlist group by slot) a), '{}'::jsonb),
    'waiting', coalesce((select jsonb_object_agg(slot, n) from (select slot, count(*)::int n from gxp_signups where waitlist group by slot) b), '{}'::jsonb))
$$;

-- Moves the oldest waitlisted groups into a slot while it has under 8 confirmed (any size, so a slot can pass 8). Returns who moved.
-- Called after every removal and before every signup, so a waitlist never sits next to open spots.
create or replace function gxp_promote(p_slot text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_promoted jsonb := '[]'::jsonb;
  r record;
begin
  while (select coalesce(sum(size), 0) from gxp_signups where slot = p_slot and not waitlist) < 8 loop
    update gxp_signups set waitlist = false
    where id = (select id from gxp_signups where slot = p_slot and waitlist order by id limit 1)
    returning name, size into r;
    exit when not found;
    v_promoted := v_promoted || jsonb_build_object('name', r.name, 'size', r.size);
  end loop;
  return v_promoted;
end $$;

-- p_waitlist is what the page showed (slot full). A full slot without it is refused; a slot with room confirms either way.
drop function if exists gxp_signup(text, text, int);
create or replace function gxp_signup(p_slot text, p_name text, p_size int, p_waitlist boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_name text := left(btrim(coalesce(p_name, '')), 80);
  v_left int;
  v_pos int;
begin
  if not exists (select 1 from gxp_slots() where start_key = p_slot) then return jsonb_build_object('ok', false, 'error', 'Unknown slot'); end if;
  if p_slot <= to_char(now() at time zone 'America/Los_Angeles', 'YYYY-MM-DD HH24:MI') then
    return jsonb_build_object('ok', false, 'error', 'That slot has started');
  end if;
  if v_name = '' then return jsonb_build_object('ok', false, 'error', 'Name is required'); end if;
  if p_size is null or p_size < 1 or p_size > 8 then return jsonb_build_object('ok', false, 'error', 'Invalid group size'); end if;

  perform pg_advisory_xact_lock(hashtext('gxp_signup')); -- one change at a time, so the last spots cannot be double booked
  perform gxp_promote(p_slot);
  select 8 - coalesce(sum(size), 0) into v_left from gxp_signups where slot = p_slot and not waitlist;
  if v_left < 1 then
    if not coalesce(p_waitlist, false) then
      return jsonb_build_object('ok', false, 'error', 'That time just filled up. You can join the waitlist.', 'left', 0) || gxp_taken();
    end if;
    insert into gxp_signups (slot, name, size, waitlist) values (p_slot, v_name, p_size, true);
    select count(*) into v_pos from gxp_signups where slot = p_slot and waitlist;
    return jsonb_build_object('ok', true, 'waitlisted', true, 'position', v_pos) || gxp_taken();
  end if;
  if p_size > v_left then
    return jsonb_build_object('ok', false, 'error', 'Only ' || v_left || ' spots left', 'left', v_left) || gxp_taken();
  end if;
  insert into gxp_signups (slot, name, size) values (p_slot, v_name, p_size);
  return jsonb_build_object('ok', true, 'waitlisted', false, 'left', v_left - p_size) || gxp_taken();
end $$;

-- leftovers from when /admin/ had a passcode
drop function if exists gxp_list(text);
drop function if exists gxp_delete(text, bigint, text, text, int);
drop function if exists gxp_pass_ok(text);
drop table if exists gxp_config;

create or replace function gxp_list() returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object('ok', true, 'rows', coalesce(
    (select jsonb_agg(jsonb_build_object('row', id, 'ts', created_at, 'slot', slot, 'name', name, 'size', size, 'waitlist', waitlist) order by id) from gxp_signups),
    '[]'::jsonb))
$$;

-- the row must still match what the admin saw. Removing a signup promotes the waitlist (gxp_promote); 'promoted' lists who moved in.
create or replace function gxp_delete(p_row bigint, p_slot text, p_name text, p_size int) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtext('gxp_signup'));
  delete from gxp_signups where id = p_row and slot = p_slot and name = p_name and size = p_size;
  if not found then return jsonb_build_object('ok', false, 'error', 'Row not found, refresh the list'); end if;
  return jsonb_build_object('ok', true, 'promoted', gxp_promote(p_slot));
end $$;
