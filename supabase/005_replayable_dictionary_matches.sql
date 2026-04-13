create table if not exists public.valid_words (
  word text primary key check (word = upper(word) and char_length(word) = 5)
);

insert into public.valid_words (word)
values
  ('ABIDE'),
  ('ADORE'),
  ('AFTER'),
  ('AGILE'),
  ('ALBUM'),
  ('ALERT'),
  ('ALIVE'),
  ('ALLOW'),
  ('ALONE'),
  ('AMBER'),
  ('ANGEL'),
  ('ANGLE'),
  ('APPLE'),
  ('APPLY'),
  ('ARENA'),
  ('ARGUE'),
  ('ARISE'),
  ('ARRAY'),
  ('AUDIO'),
  ('AVOID'),
  ('AWARE'),
  ('BADGE'),
  ('BAKER'),
  ('BASIC'),
  ('BEACH'),
  ('BEGIN'),
  ('BEING'),
  ('BELLY'),
  ('BIRTH'),
  ('BLACK'),
  ('BLAME'),
  ('BLEND'),
  ('BLOCK'),
  ('BLOOM'),
  ('BOARD'),
  ('BOUND'),
  ('BRAIN'),
  ('BRAND'),
  ('BRAVE'),
  ('BREAD'),
  ('BRICK'),
  ('BRIEF'),
  ('BRING'),
  ('BROAD'),
  ('BROWN'),
  ('BUILD'),
  ('CABLE'),
  ('CALM'),
  ('CANDY'),
  ('CARRY'),
  ('CARVE'),
  ('CAUSE'),
  ('CHAIN'),
  ('CHAIR'),
  ('CHARM'),
  ('CHASE'),
  ('CHEST'),
  ('CHIEF'),
  ('CHILL'),
  ('CHOIR'),
  ('CIVIC'),
  ('CLAIM'),
  ('CLASS'),
  ('CLEAN'),
  ('CLEAR'),
  ('CLIMB'),
  ('CLOCK'),
  ('CLOUD'),
  ('COACH'),
  ('COAST'),
  ('COLOR'),
  ('COUNT'),
  ('COURT'),
  ('COVER'),
  ('CRANE'),
  ('CRASH'),
  ('CRISP'),
  ('CROSS'),
  ('CROWD'),
  ('CROWN'),
  ('CURVE'),
  ('DAILY'),
  ('DANCE'),
  ('DEALT'),
  ('DEBUT'),
  ('DELAY'),
  ('DEPTH'),
  ('DOING'),
  ('DOUBT'),
  ('DOZEN'),
  ('DRAFT'),
  ('DRAMA'),
  ('DRAWN'),
  ('DREAM'),
  ('DRIVE'),
  ('EARLY'),
  ('EARTH'),
  ('ELBOW'),
  ('ELITE'),
  ('EMPTY'),
  ('ENJOY'),
  ('ENTRY'),
  ('EQUAL'),
  ('ERROR'),
  ('EVENT'),
  ('EVERY'),
  ('EXACT'),
  ('FAITH'),
  ('FALSE'),
  ('FAULT'),
  ('FIELD'),
  ('FIERY'),
  ('FINAL'),
  ('FIRST'),
  ('FLAME'),
  ('FLASH'),
  ('FLEET'),
  ('FLOOD'),
  ('FLOUR'),
  ('FOCUS'),
  ('FORCE'),
  ('FRAME'),
  ('FRESH'),
  ('FRONT'),
  ('FROST'),
  ('FRUIT'),
  ('GIANT'),
  ('GLASS'),
  ('GLOBE'),
  ('GRACE'),
  ('GRADE'),
  ('GRAIN'),
  ('GRAND'),
  ('GRANT'),
  ('GRASP'),
  ('GRASS'),
  ('GREAT'),
  ('GREEN'),
  ('GROUP'),
  ('GUEST'),
  ('GUIDE'),
  ('HABIT'),
  ('HAPPY'),
  ('HEART'),
  ('HONEY'),
  ('HORSE'),
  ('HOUSE'),
  ('HUMAN'),
  ('IDEAL'),
  ('IMAGE'),
  ('INDEX'),
  ('INNER'),
  ('ISSUE'),
  ('JOINT'),
  ('JUDGE'),
  ('JUICE'),
  ('KNIFE'),
  ('KNOCK'),
  ('LARGE'),
  ('LASER'),
  ('LATER'),
  ('LAUGH'),
  ('LAYER'),
  ('LEARN'),
  ('LEMON'),
  ('LEVEL'),
  ('LIGHT'),
  ('LIMIT'),
  ('LOCAL'),
  ('LOGIC'),
  ('LOOSE'),
  ('LUCKY'),
  ('LUNCH'),
  ('MAGIC'),
  ('MAJOR'),
  ('MAPLE'),
  ('MARCH'),
  ('MATCH'),
  ('MAYBE'),
  ('METAL'),
  ('MIGHT'),
  ('MODEL'),
  ('MONEY'),
  ('MOTOR'),
  ('MOUNT'),
  ('MOUSE'),
  ('MUSIC'),
  ('NERVE'),
  ('NIGHT'),
  ('NOBLE'),
  ('NOISE'),
  ('NORTH'),
  ('NOVEL'),
  ('NURSE'),
  ('OCEAN'),
  ('OFFER'),
  ('OLIVE'),
  ('OPERA'),
  ('ORDER'),
  ('OTHER'),
  ('OUTER'),
  ('PANEL'),
  ('PARTY'),
  ('PEACE'),
  ('PHASE'),
  ('PHONE'),
  ('PHOTO'),
  ('PIANO'),
  ('PIECE'),
  ('PILOT'),
  ('PITCH'),
  ('PLACE'),
  ('PLAIN'),
  ('PLANT'),
  ('PLATE'),
  ('POINT'),
  ('POWER'),
  ('PRESS'),
  ('PRICE'),
  ('PRIDE'),
  ('PRIME'),
  ('PRINT'),
  ('PRIZE'),
  ('PROUD'),
  ('QUEEN'),
  ('QUICK'),
  ('QUIET'),
  ('RADIO'),
  ('RAISE'),
  ('RANGE'),
  ('RAPID'),
  ('RATIO'),
  ('REACH'),
  ('REACT'),
  ('READY'),
  ('RELAX'),
  ('REPLY'),
  ('RIGHT'),
  ('RIVER'),
  ('ROBIN'),
  ('ROUGH'),
  ('ROUND'),
  ('ROUTE'),
  ('ROYAL'),
  ('RUGBY'),
  ('RURAL'),
  ('SCALE'),
  ('SCENE'),
  ('SCOPE'),
  ('SCORE'),
  ('SENSE'),
  ('SERVE'),
  ('SHADE'),
  ('SHAKE'),
  ('SHAPE'),
  ('SHARE'),
  ('SHARP'),
  ('SHELF'),
  ('SHIFT'),
  ('SHINE'),
  ('SHORE'),
  ('SHORT'),
  ('SIGHT'),
  ('SKILL'),
  ('SLATE'),
  ('SLEEP'),
  ('SLICE'),
  ('SMILE'),
  ('SMOKE'),
  ('SOLAR'),
  ('SOLID'),
  ('SOLVE'),
  ('SOUND'),
  ('SOUTH'),
  ('SPACE'),
  ('SPARE'),
  ('SPEAK'),
  ('SPEED'),
  ('SPICE'),
  ('SPINE'),
  ('SPLIT'),
  ('SPORT'),
  ('SPRAY'),
  ('STACK'),
  ('STAFF'),
  ('STAGE'),
  ('STAIR'),
  ('STAKE'),
  ('STAMP'),
  ('STAND'),
  ('START'),
  ('STATE'),
  ('STEAD'),
  ('STEEL'),
  ('STEEP'),
  ('STILL'),
  ('STONE'),
  ('STORE'),
  ('STORM'),
  ('STORY'),
  ('STRIP'),
  ('STYLE'),
  ('SUGAR'),
  ('SUITE'),
  ('SUPER'),
  ('SWEET'),
  ('TABLE'),
  ('TEACH'),
  ('THANK'),
  ('THEME'),
  ('THERE'),
  ('THINK'),
  ('THORN'),
  ('THROW'),
  ('TIGER'),
  ('TITLE'),
  ('TODAY'),
  ('TOPIC'),
  ('TOTAL'),
  ('TOUCH'),
  ('TOUGH'),
  ('TRACE'),
  ('TRACK'),
  ('TRADE'),
  ('TRAIL'),
  ('TRAIN'),
  ('TREND'),
  ('TRIAL'),
  ('TRICK'),
  ('TRUST'),
  ('TRUTH'),
  ('TWICE'),
  ('UNDER'),
  ('UNION'),
  ('UNITY'),
  ('UPPER'),
  ('URBAN'),
  ('USAGE'),
  ('VALUE'),
  ('VIDEO'),
  ('VIRAL'),
  ('VISIT'),
  ('VITAL'),
  ('VOICE'),
  ('WATER'),
  ('WHEEL'),
  ('WHERE'),
  ('WHILE'),
  ('WHITE'),
  ('WHOLE'),
  ('WORLD'),
  ('WORTH'),
  ('WRITE'),
  ('YIELD'),
  ('YOUNG')
on conflict (word) do nothing;

alter table public.valid_words enable row level security;

drop policy if exists "valid_words are readable" on public.valid_words;
create policy "valid_words are readable"
on public.valid_words
for select
to anon, authenticated
using (true);

drop function if exists public.is_valid_dictionary_word(text);
create or replace function public.is_valid_dictionary_word(p_word text)
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.valid_words vw
    where vw.word = upper(trim(p_word))
  );
$$;

drop function if exists public.submit_secret_word(uuid, uuid, text);
create or replace function public.submit_secret_word(
  p_match_id uuid,
  p_player_id uuid,
  p_secret_word text
)
returns table (
  match_id uuid,
  room_id uuid,
  room_status public.room_status,
  match_status public.match_status,
  word_locked boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  match_row public.matches%rowtype;
  normalized_word text := upper(trim(p_secret_word));
  locked_count integer;
begin
  select *
  into match_row
  from public.matches
  where id = p_match_id;

  if not found then
    raise exception 'Match not found.';
  end if;

  if match_row.status <> 'awaiting_words' then
    raise exception 'This round is no longer accepting secret words.';
  end if;

  if normalized_word !~ '^[A-Z]{5}$' then
    raise exception 'Secret words must be exactly 5 letters.';
  end if;

  if not exists (
    select 1
    from public.room_players rp
    where rp.room_id = match_row.room_id
      and rp.player_id = p_player_id
  ) then
    raise exception 'You are not a player in this room.';
  end if;

  if not public.is_valid_dictionary_word(normalized_word) then
    raise exception 'That word is not in the dictionary.';
  end if;

  if exists (
    select 1
    from public.secret_words sw
    where sw.match_id = p_match_id
      and sw.player_id = p_player_id
  ) then
    raise exception 'Your secret word is already locked for this round.';
  end if;

  insert into public.secret_words (
    match_id,
    player_id,
    encrypted_word,
    word_length
  )
  values (
    p_match_id,
    p_player_id,
    normalized_word,
    5
  );

  update public.room_players
  set word_locked = true
  where room_id = match_row.room_id
    and player_id = p_player_id;

  select count(*)
  into locked_count
  from public.room_players rp
  where rp.room_id = match_row.room_id
    and rp.word_locked = true;

  if locked_count >= 2 then
    perform public.activate_match_with_turns(p_match_id);

    update public.rooms
    set status = 'in_match'
    where id = match_row.room_id;
  else
    update public.rooms
    set status = 'waiting_for_words'
    where id = match_row.room_id;
  end if;

  return query
  select
    match_row.id,
    match_row.room_id,
    r.status,
    m.status,
    true
  from public.rooms r
  join public.matches m on m.id = match_row.id
  where r.id = match_row.room_id;
end;
$$;

drop function if exists public.restart_room_match(uuid, uuid);
create or replace function public.restart_room_match(
  p_room_id uuid,
  p_player_id uuid
)
returns table (
  match_id uuid,
  room_id uuid,
  room_status public.room_status,
  match_status public.match_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  latest_match public.matches%rowtype;
  next_match public.matches%rowtype;
  room_player_count integer;
begin
  perform 1
  from public.rooms r
  where r.id = p_room_id
  for update;

  if not found then
    raise exception 'Room not found.';
  end if;

  if not exists (
    select 1
    from public.room_players rp
    where rp.room_id = p_room_id
      and rp.player_id = p_player_id
  ) then
    raise exception 'You are not a player in this room.';
  end if;

  select count(*)
  into room_player_count
  from public.room_players rp
  where rp.room_id = p_room_id;

  if room_player_count <> 2 then
    raise exception 'Rematch requires exactly two players.';
  end if;

  select *
  into latest_match
  from public.matches m
  where m.room_id = p_room_id
  order by m.created_at desc
  limit 1;

  if not found then
    raise exception 'No finished round was found for this room.';
  end if;

  if latest_match.status <> 'finished' then
    raise exception 'Finish the current round before starting the next one.';
  end if;

  insert into public.matches (
    room_id,
    status,
    timer_seconds,
    max_guesses
  )
  values (
    p_room_id,
    'awaiting_words',
    latest_match.timer_seconds,
    latest_match.max_guesses
  )
  returning *
  into next_match;

  update public.room_players
  set
    ready_state = false,
    word_locked = false
  where room_id = p_room_id;

  update public.rooms
  set status = 'waiting_for_words'
  where id = p_room_id;

  return query
  select
    next_match.id,
    next_match.room_id,
    r.status,
    next_match.status
  from public.rooms r
  where r.id = p_room_id;
end;
$$;

revoke all on function public.submit_secret_word(uuid, uuid, text) from public;
grant execute on function public.submit_secret_word(uuid, uuid, text) to anon, authenticated;

revoke all on function public.restart_room_match(uuid, uuid) from public;
grant execute on function public.restart_room_match(uuid, uuid) to anon, authenticated;

revoke all on function public.is_valid_dictionary_word(text) from public;
grant execute on function public.is_valid_dictionary_word(text) to anon, authenticated;

drop policy if exists "secret_words are insertable" on public.secret_words;
create policy "secret_words are insertable"
on public.secret_words
for insert
to anon, authenticated
with check (false);

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
  normalized_guess text := upper(trim(p_guess_word));
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

  if normalized_guess !~ '^[A-Z]{5}$' then
    raise exception 'Guesses must be exactly 5 letters.';
  end if;

  if not exists (
    select 1
    from public.room_players rp
    where rp.room_id = match_row.room_id
      and rp.player_id = p_player_id
  ) then
    raise exception 'You are not a player in this room.';
  end if;

  if not public.is_valid_dictionary_word(normalized_guess) then
    raise exception 'That guess is not in the dictionary.';
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
    normalized_guess,
    public.evaluate_guess_pattern(normalized_guess, opponent_secret_word),
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
