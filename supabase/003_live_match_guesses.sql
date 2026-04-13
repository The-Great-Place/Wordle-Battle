create table if not exists public.guesses (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  guess_word text not null check (guess_word = upper(guess_word) and char_length(guess_word) = 5),
  result_pattern text not null check (result_pattern ~ '^[ACP]{5}$'),
  guess_index integer not null check (guess_index between 1 and 6),
  created_at timestamptz not null default now(),
  unique (match_id, player_id, guess_index)
);

create index if not exists idx_guesses_match_id on public.guesses (match_id);
create index if not exists idx_guesses_player_id on public.guesses (player_id);

alter table public.guesses enable row level security;

drop policy if exists "guesses are readable" on public.guesses;
create policy "guesses are readable"
on public.guesses
for select
to anon, authenticated
using (true);

drop policy if exists "guesses are blocked for direct writes" on public.guesses;
create policy "guesses are blocked for direct writes"
on public.guesses
for insert
to anon, authenticated
with check (false);

drop function if exists public.evaluate_guess_pattern(text, text);
create or replace function public.evaluate_guess_pattern(guess_input text, answer_input text)
returns text
language plpgsql
immutable
as $$
declare
  guess text := upper(guess_input);
  answer text := upper(answer_input);
  result text[] := array['A', 'A', 'A', 'A', 'A'];
  remaining text[] := string_to_array(answer, null);
  guess_chars text[] := string_to_array(guess, null);
  idx integer;
  inner_idx integer;
begin
  for idx in 1..5 loop
    if guess_chars[idx] = remaining[idx] then
      result[idx] := 'C';
      remaining[idx] := null;
      guess_chars[idx] := null;
    end if;
  end loop;

  for idx in 1..5 loop
    if guess_chars[idx] is null then
      continue;
    end if;

    for inner_idx in 1..5 loop
      if remaining[inner_idx] = guess_chars[idx] then
        result[idx] := 'P';
        remaining[inner_idx] := null;
        exit;
      end if;
    end loop;
  end loop;

  return array_to_string(result, '');
end;
$$;

drop function if exists public.submit_match_guess(uuid, uuid, text);
create or replace function public.submit_match_guess(
  p_match_id uuid,
  p_player_id uuid,
  p_guess_word text
)
returns table (
  guess_id uuid,
  result_pattern text,
  guess_index integer,
  match_status public.match_status,
  winner_player_id uuid,
  finished_at timestamptz,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  match_row public.matches%rowtype;
  opponent_player_id uuid;
  opponent_secret_word text;
  next_guess_index integer;
  inserted_guess public.guesses%rowtype;
  solved boolean;
  player_guess_count integer;
  opponent_guess_count integer;
  player_turn_deadline timestamptz;
begin
  select *
  into match_row
  from public.matches
  where id = p_match_id;

  if not found then
    raise exception 'Match not found.';
  end if;

  if match_row.status <> 'active' then
    raise exception 'This match is not active.';
  end if;

  if upper(p_guess_word) !~ '^[A-Z]{5}$' then
    raise exception 'Guesses must be exactly 5 letters.';
  end if;

  select rp.player_id
  into opponent_player_id
  from public.room_players rp
  where rp.room_id = match_row.room_id
    and rp.player_id <> p_player_id
  limit 1;

  if opponent_player_id is null then
    raise exception 'Opponent not found for this match.';
  end if;

  select sw.encrypted_word
  into opponent_secret_word
  from public.secret_words sw
  where sw.match_id = p_match_id
    and sw.player_id = opponent_player_id;

  if opponent_secret_word is null then
    raise exception 'Opponent word is not locked yet.';
  end if;

  select mp.turn_deadline_at
  into player_turn_deadline
  from public.match_players mp
  where mp.match_id = p_match_id
    and mp.player_id = p_player_id;

  if player_turn_deadline is not null and player_turn_deadline <= now() then
    perform public.sync_match_timeouts(p_match_id);
    raise exception 'Your turn timer has expired.';
  end if;

  select coalesce(max(g.guess_index), 0) + 1
  into next_guess_index
  from public.guesses g
  where g.match_id = p_match_id
    and g.player_id = p_player_id;

  if next_guess_index > match_row.max_guesses then
    raise exception 'No guesses remaining.';
  end if;

  insert into public.guesses (
    match_id,
    player_id,
    guess_word,
    result_pattern,
    guess_index
  )
  values (
    p_match_id,
    p_player_id,
    upper(p_guess_word),
    public.evaluate_guess_pattern(p_guess_word, opponent_secret_word),
    next_guess_index
  )
  returning *
  into inserted_guess;

  update public.match_players
  set
    last_guess_at = now(),
    turn_deadline_at = now() + make_interval(secs => match_row.timer_seconds),
    solved_at = case when inserted_guess.result_pattern = 'CCCCC' then now() else solved_at end
  where match_id = p_match_id
    and player_id = p_player_id;

  solved := inserted_guess.result_pattern = 'CCCCC';

  select count(*)
  into player_guess_count
  from public.guesses g
  where g.match_id = p_match_id
    and g.player_id = p_player_id;

  select count(*)
  into opponent_guess_count
  from public.guesses g
  where g.match_id = p_match_id
    and g.player_id = opponent_player_id;

  if solved then
    update public.matches
    set
      status = 'finished',
      winner_player_id = p_player_id,
      finished_at = now()
    where id = p_match_id;

    update public.rooms
    set status = 'match_finished'
    where id = match_row.room_id;
  elsif player_guess_count >= match_row.max_guesses and opponent_guess_count >= match_row.max_guesses then
    update public.matches
    set
      status = 'finished',
      winner_player_id = null,
      finished_at = now()
    where id = p_match_id;

    update public.rooms
    set status = 'match_finished'
    where id = match_row.room_id;
  end if;

  return query
  select
    inserted_guess.id,
    inserted_guess.result_pattern,
    inserted_guess.guess_index,
    m.status,
    m.winner_player_id,
    m.finished_at,
    inserted_guess.created_at
  from public.matches m
  where m.id = p_match_id;
end;
$$;

revoke all on function public.submit_match_guess(uuid, uuid, text) from public;
grant execute on function public.submit_match_guess(uuid, uuid, text) to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'guesses'
  ) then
    alter publication supabase_realtime add table public.guesses;
  end if;
end $$;
