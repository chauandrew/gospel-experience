-- Supabase backend behind /signup/ and /admin/. Paste into the SQL editor once; re-running is safe.
-- New tables only (gxp_ prefix). RLS is on with no policies, so the publishable key can only call the functions below.
-- After pasting, set the admin passcode:  insert into gxp_config values ('admin_passcode', 'YOUR-PASSCODE') on conflict (key) do update set value = excluded.value;
-- Windows (gxp_slots) and the cap (8) must match src/signup.js. Change both together.

create table if not exists gxp_signups (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  slot text not null,
  name text not null,
  size int not null check (size between 1 and 8)
);
create table if not exists gxp_config (key text primary key, value text not null);
alter table gxp_signups enable row level security;
alter table gxp_config enable row level security;

-- every 10 minute slot: start key, end key, e.g. '2026-11-06 18:30', '2026-11-06 18:40'
create or replace function gxp_slots() returns table (start_key text, end_key text)
language sql immutable as $$
  select to_char(t, 'YYYY-MM-DD HH24:MI'), to_char(t + interval '10 minutes', 'YYYY-MM-DD HH24:MI')
  from (values
    ('2026-11-06', '18:30', '19:10'),
    ('2026-11-06', '20:30', '22:00'),
    ('2026-11-07', '09:00', '10:00'),
    ('2026-11-07', '12:00', '13:00'),
    ('2026-11-07', '14:20', '16:00'),
    ('2026-11-07', '18:00', '20:00')
  ) w (d, s, e),
  lateral generate_series((w.d || ' ' || w.s)::timestamp, (w.d || ' ' || w.e)::timestamp - interval '10 minutes', interval '10 minutes') t
$$;

create or replace function gxp_taken() returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object('taken', coalesce(jsonb_object_agg(slot, n), '{}'::jsonb))
  from (select slot, sum(size)::int n from gxp_signups group by slot) s
$$;

create or replace function gxp_signup(p_slot text, p_name text, p_size int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_name text := left(btrim(coalesce(p_name, '')), 80);
  v_end text;
  v_left int;
begin
  select end_key into v_end from gxp_slots() where start_key = p_slot;
  if v_end is null then return jsonb_build_object('ok', false, 'error', 'Unknown slot'); end if;
  if v_end <= to_char(now() at time zone 'America/Los_Angeles', 'YYYY-MM-DD HH24:MI') then
    return jsonb_build_object('ok', false, 'error', 'That slot has passed');
  end if;
  if v_name = '' then return jsonb_build_object('ok', false, 'error', 'Name is required'); end if;
  if p_size is null or p_size < 1 or p_size > 8 then return jsonb_build_object('ok', false, 'error', 'Invalid group size'); end if;

  perform pg_advisory_xact_lock(hashtext('gxp_signup')); -- one signup at a time, so the last spots cannot be double booked
  select 8 - coalesce(sum(size), 0) into v_left from gxp_signups where slot = p_slot;
  if p_size > v_left then
    return jsonb_build_object('ok', false, 'error', 'Only ' || v_left || ' spots left', 'left', v_left, 'taken', gxp_taken() -> 'taken');
  end if;
  insert into gxp_signups (slot, name, size) values (p_slot, v_name, p_size);
  return jsonb_build_object('ok', true, 'left', v_left - p_size, 'taken', gxp_taken() -> 'taken');
end $$;

create or replace function gxp_pass_ok(p_pass text) returns boolean
language sql security definer set search_path = public as $$
  select exists (select 1 from gxp_config where key = 'admin_passcode' and value = p_pass)
$$;
revoke execute on function gxp_pass_ok(text) from public, anon, authenticated;

create or replace function gxp_list(p_pass text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not gxp_pass_ok(p_pass) then return jsonb_build_object('ok', false, 'error', 'Wrong passcode'); end if;
  return jsonb_build_object('ok', true, 'rows', coalesce(
    (select jsonb_agg(jsonb_build_object('row', id, 'ts', created_at, 'slot', slot, 'name', name, 'size', size) order by id) from gxp_signups),
    '[]'::jsonb));
end $$;

-- the row must still match what the admin saw
create or replace function gxp_delete(p_pass text, p_row bigint, p_slot text, p_name text, p_size int) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not gxp_pass_ok(p_pass) then return jsonb_build_object('ok', false, 'error', 'Wrong passcode'); end if;
  delete from gxp_signups where id = p_row and slot = p_slot and name = p_name and size = p_size;
  if not found then return jsonb_build_object('ok', false, 'error', 'Row not found, refresh the list'); end if;
  return jsonb_build_object('ok', true);
end $$;
