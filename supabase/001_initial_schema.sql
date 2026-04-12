create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'room_status') then
    create type public.room_status as enum (
      'waiting_for_players',
      'waiting_for_words',
      'ready_to_start',
      'in_match',
      'match_finished'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'match_status') then
    create type public.match_status as enum (
      'awaiting_words',
      'active',
      'finished'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'room_seat') then
    create type public.room_seat as enum ('A', 'B');
  end if;
end $$;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  display_name text not null check (char_length(display_name) between 2 and 24),
  is_guest boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code) and char_length(code) between 4 and 8),
  created_by_player_id uuid references public.players(id) on delete set null,
  max_players integer not null default 2 check (max_players = 2),
  status public.room_status not null default 'waiting_for_players',
  created_at timestamptz not null default now()
);

create table if not exists public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  seat public.room_seat not null,
  ready_state boolean not null default false,
  word_locked boolean not null default false,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (room_id, player_id),
  unique (room_id, seat)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  status public.match_status not null default 'awaiting_words',
  timer_seconds integer not null default 30 check (timer_seconds between 5 and 120),
  max_guesses integer not null default 6 check (max_guesses between 1 and 10),
  winner_player_id uuid references public.players(id) on delete set null,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.secret_words (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  encrypted_word text not null,
  word_length integer not null default 5 check (word_length = 5),
  created_at timestamptz not null default now(),
  unique (match_id, player_id)
);

create index if not exists idx_rooms_code on public.rooms (code);
create index if not exists idx_room_players_room_id on public.room_players (room_id);
create index if not exists idx_room_players_player_id on public.room_players (player_id);
create index if not exists idx_matches_room_id on public.matches (room_id);
create index if not exists idx_secret_words_match_id on public.secret_words (match_id);

alter table public.players enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.matches enable row level security;
alter table public.secret_words enable row level security;

drop policy if exists "players are readable" on public.players;
create policy "players are readable"
on public.players
for select
to anon, authenticated
using (true);

drop policy if exists "players are insertable" on public.players;
create policy "players are insertable"
on public.players
for insert
to anon, authenticated
with check (true);

drop policy if exists "players are updatable" on public.players;
create policy "players are updatable"
on public.players
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "rooms are readable" on public.rooms;
create policy "rooms are readable"
on public.rooms
for select
to anon, authenticated
using (true);

drop policy if exists "rooms are insertable" on public.rooms;
create policy "rooms are insertable"
on public.rooms
for insert
to anon, authenticated
with check (true);

drop policy if exists "rooms are updatable" on public.rooms;
create policy "rooms are updatable"
on public.rooms
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "room_players are readable" on public.room_players;
create policy "room_players are readable"
on public.room_players
for select
to anon, authenticated
using (true);

drop policy if exists "room_players are insertable" on public.room_players;
create policy "room_players are insertable"
on public.room_players
for insert
to anon, authenticated
with check (true);

drop policy if exists "room_players are updatable" on public.room_players;
create policy "room_players are updatable"
on public.room_players
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "matches are readable" on public.matches;
create policy "matches are readable"
on public.matches
for select
to anon, authenticated
using (true);

drop policy if exists "matches are insertable" on public.matches;
create policy "matches are insertable"
on public.matches
for insert
to anon, authenticated
with check (true);

drop policy if exists "matches are updatable" on public.matches;
create policy "matches are updatable"
on public.matches
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "secret_words are blocked from client reads" on public.secret_words;
create policy "secret_words are blocked from client reads"
on public.secret_words
for select
to anon, authenticated
using (false);

drop policy if exists "secret_words are insertable" on public.secret_words;
create policy "secret_words are insertable"
on public.secret_words
for insert
to anon, authenticated
with check (true);

drop policy if exists "secret_words are updatable" on public.secret_words;
create policy "secret_words are updatable"
on public.secret_words
for update
to anon, authenticated
using (false)
with check (false);
