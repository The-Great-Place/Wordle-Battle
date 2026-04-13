create table if not exists public.match_players (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  turn_deadline_at timestamptz,
  last_guess_at timestamptz,
  solved_at timestamptz,
  timed_out_at timestamptz,
  created_at timestamptz not null default now(),
  unique (match_id, player_id)
);

create index if not exists idx_match_players_match_id on public.match_players (match_id);
create index if not exists idx_match_players_player_id on public.match_players (player_id);

alter table public.match_players enable row level security;

drop policy if exists "match_players are readable" on public.match_players;
create policy "match_players are readable"
on public.match_players
for select
to anon, authenticated
using (true);

drop policy if exists "match_players direct writes blocked" on public.match_players;
create policy "match_players direct writes blocked"
on public.match_players
for insert
to anon, authenticated
with check (false);

drop function if exists public.activate_match_with_turns(uuid);
create or replace function public.activate_match_with_turns(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  match_row public.matches%rowtype;
  room_player_row record;
begin
  select *
  into match_row
  from public.matches
  where id = p_match_id;

  if not found then
    raise exception 'Match not found.';
  end if;

  update public.matches
  set
    status = 'active',
    started_at = coalesce(started_at, now())
  where id = p_match_id;

  for room_player_row in
    select rp.player_id
    from public.room_players rp
    where rp.room_id = match_row.room_id
  loop
    insert into public.match_players (
      match_id,
      player_id,
      turn_deadline_at
    )
    values (
      p_match_id,
      room_player_row.player_id,
      now() + make_interval(secs => match_row.timer_seconds)
    )
    on conflict (match_id, player_id)
    do update
    set turn_deadline_at = excluded.turn_deadline_at;
  end loop;
end;
$$;

drop function if exists public.sync_match_timeouts(uuid);
create or replace function public.sync_match_timeouts(p_match_id uuid)
returns table (
  match_status public.match_status,
  winner_player_id uuid,
  timed_out_player_id uuid,
  finished_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  match_row public.matches%rowtype;
  expired_player_id uuid;
  surviving_player_id uuid;
begin
  select *
  into match_row
  from public.matches
  where id = p_match_id;

  if not found then
    raise exception 'Match not found.';
  end if;

  if match_row.status = 'active' then
    select mp.player_id
    into expired_player_id
    from public.match_players mp
    where mp.match_id = p_match_id
      and mp.timed_out_at is null
      and mp.solved_at is null
      and mp.turn_deadline_at is not null
      and mp.turn_deadline_at <= now()
    order by mp.turn_deadline_at asc
    limit 1;

    if expired_player_id is not null then
      update public.match_players
      set timed_out_at = now()
      where match_id = p_match_id
        and player_id = expired_player_id
        and timed_out_at is null;

      select mp.player_id
      into surviving_player_id
      from public.match_players mp
      where mp.match_id = p_match_id
        and mp.player_id <> expired_player_id
      limit 1;

      update public.matches
      set
        status = 'finished',
        winner_player_id = surviving_player_id,
        finished_at = now()
      where id = p_match_id;

      update public.rooms
      set status = 'match_finished'
      where id = match_row.room_id;
    end if;
  end if;

  return query
  select
    m.status,
    m.winner_player_id,
    expired_player_id,
    m.finished_at
  from public.matches m
  where m.id = p_match_id;
end;
$$;

revoke all on function public.activate_match_with_turns(uuid) from public;
grant execute on function public.activate_match_with_turns(uuid) to anon, authenticated;

revoke all on function public.sync_match_timeouts(uuid) from public;
grant execute on function public.sync_match_timeouts(uuid) to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'match_players'
  ) then
    alter publication supabase_realtime add table public.match_players;
  end if;
end $$;
