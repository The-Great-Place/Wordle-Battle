# AGENT.md

## Project Overview

Wordle Battle is a multiplayer browser game inspired by Wordle. Two players join the same private room, secretly choose a valid five-letter word, and race to guess each other's word. Each player sees both boards side by side: their own guessing progress and their opponent's progress. Matches are fast, readable, and competitive, with a timer preventing stalls.

This project should be built as a multiplayer web app with game-like pacing, not as a canvas-first browser game. The product should feel lightweight, modern, and instantly playable with friends.

## Product Direction

The core product goals are:

- Make it easy to play with a friend through a room code
- Avoid requiring account creation for the core experience
- Keep matches short, readable, and replayable
- Make the game fair through server-authoritative rule evaluation
- Show both players' progress clearly in real time

The MVP should prioritize:

- Guest play
- Private room codes
- Two-player matches only
- Secret word submission
- Simultaneous guessing
- Turn timer
- Side-by-side boards
- Win/loss/draw resolution
- Rematch flow

Do not prioritize these in early development:

- Public matchmaking
- Global chat
- Ranked systems
- Advanced social features
- Cosmetics
- Profile progression
- Rich animation systems

## Final Stack

This project should use:

- Frontend: React + TypeScript + Vite
- Styling: CSS Modules
- Backend platform: Supabase
- Database: Supabase Postgres
- Realtime: Supabase Realtime
- Auth: optional later, guest-first experience initially
- Server-side gameplay logic: Supabase Edge Functions

Do not default to Next.js, Phaser, or a separate custom backend unless project goals change.

## Architecture Principles

### 1. Keep gameplay logic out of the UI

The React client renders state and handles player interaction, but should not be the source of truth for gameplay outcomes.

- The client may validate input for UX
- The client may render local countdowns for responsiveness
- The client must not be trusted for secret-word storage, guess evaluation, timeout enforcement, or match resolution

### 2. Treat the server as authoritative

Secret words and guess evaluation must stay server-side.

- Opponent secret words must never be exposed to clients during an active match
- Guess evaluation must happen in server-side code
- Win/loss/draw resolution must be server-authoritative
- Timeout validity must be server-authoritative

### 3. Use Supabase for multiplayer coordination, not as a replacement for all game logic

Supabase should handle persistence, realtime sync, and secure execution boundaries.

- Postgres stores rooms, players, matches, guesses, and results
- Realtime propagates room and match updates
- Edge Functions implement gameplay rules
- Row Level Security protects client-accessible data

### 4. Prefer DOM-based UI over canvas

This game is UI-heavy and text-heavy.

- Boards, keyboard, timers, room UI, and match states should be rendered in React
- Avoid canvas unless the project later adds visual systems that truly require it

### 5. Keep the MVP easy to understand

The first version should stay close to classic Wordle with multiplayer pressure, not expand into too many extra systems.

## Core Gameplay Rules

Baseline match flow:

1. A player creates or joins a room with a room code
2. Two players enter the room and choose display names
3. Each player submits a secret valid five-letter word
4. When both words are locked, the match starts
5. Both players guess simultaneously
6. Each guess is evaluated against the opponent's secret word
7. Both clients see progress update in real time
8. The match ends with a win, loss, draw, or timeout
9. Players can request a rematch

MVP rule set:

- Two players only
- Five-letter words only
- Six guesses maximum
- Per-turn countdown timer
- First player to solve wins immediately
- If both players fail within six guesses, the result is a draw
- If a player runs out of time before submitting a guess, they lose

## Security and Secret Word Handling

This is a critical rule for the whole project:

- Clients must never be able to query or inspect the opponent's active secret word

Implementation guidance:

- Store active secret words in a protected table
- Do not expose the secret-words table directly to client reads
- Evaluate guesses in Edge Functions
- Return only evaluated result patterns to the client
- Reveal secret words only after the match ends, if desired by product design

Do not implement guess evaluation solely in client code.

## Recommended Supabase Responsibilities

### Postgres

Use Postgres to store:

- Rooms
- Players
- Room membership
- Matches
- Secret word metadata
- Guesses
- Match outcomes
- Rematch state

### Realtime

Use Realtime for:

- Room presence
- Player join/leave updates
- Match state transitions
- Guess results
- Rematch votes

### Edge Functions

Use Edge Functions for:

- Secret word submission validation
- Guess evaluation
- Timer enforcement
- Match resolution
- Protected end-of-match reveal behavior

### Auth

The initial product should be guest-first. Full account systems can be layered in later.

- Guest players should be able to create and join room-code matches
- Optional account support can be added later for persistence and stats

## Data Model Guidance

Expected early tables:

- `rooms`
- `players`
- `room_players`
- `matches`
- `secret_words`
- `guesses`
- `rematch_votes`

Suggested room states:

- `waiting_for_players`
- `waiting_for_words`
- `ready_to_start`
- `in_match`
- `match_finished`

Suggested match states:

- `awaiting_words`
- `active`
- `finished`

Suggested per-player states:

- `connected`
- `ready`
- `word_locked`
- `guessing`
- `solved`
- `timed_out`

State transitions should be explicit and easy to trace. Avoid hidden or duplicated status logic across unrelated tables.

## Word Rules

The project should use a controlled word list in the MVP.

- Secret words must be valid approved five-letter words
- Guesses must be valid approved five-letter words
- Input should be normalized before evaluation
- Duplicate-letter evaluation must follow correct Wordle-style rules

Do not use naive per-character inclusion logic. Duplicate-letter handling is subtle and should be covered by tests.

## Timer Rules

The timer is a gameplay feature, not just a display.

- The client may render a local timer for responsiveness
- The server must decide whether a submission is on time
- Timeouts should be based on server timestamps, not only browser clocks

Avoid designs where a client can freeze, slow, or spoof local time to gain an advantage.

## Frontend Guidance

Use React to build a clean DOM-based app with clear state boundaries.

Suggested app areas:

- Landing page
- Create/join room flow
- Room lobby
- Secret word submission
- Match screen
- Results/rematch flow

Suggested component categories:

- Room forms
- Player badges
- Match status displays
- Wordle boards
- Keyboard/input controls
- Timer displays
- Result modals

Suggested frontend module boundaries:

- `src/app` for app shell and routing
- `src/pages` for screen-level routes
- `src/components` for shared presentational building blocks
- `src/features/room` for room creation/join flows
- `src/features/game` for match logic and realtime synchronization
- `src/lib/supabase` for Supabase clients and helpers
- `src/types` for shared TypeScript types

## Styling Guidance

Use CSS Modules throughout the app.

Guidelines:

- Keep styles colocated with components
- Prefer clear class naming over overly abstract utility patterns
- Use CSS variables for shared colors, spacing, radii, and timing
- Ensure both desktop and mobile layouts are first-class

Initial layout direction:

- Desktop should show both boards side by side
- Mobile can stack or compress intelligently, but clarity matters more than density
- The user should never be confused about which board is theirs

## UI Priorities

The game should always communicate:

- Whose room this is
- Which players are connected
- Whether both players are ready
- Whether the match is waiting, active, or finished
- Your progress
- Opponent progress
- Remaining time
- Match result

When in doubt, optimize for readability over visual complexity.

## Realtime Design Guidance

Realtime events should keep both players in sync without overcomplicating the client.

- Subscribe to room-level updates while in lobby
- Subscribe to match and guess updates during active play
- Treat server updates as authoritative
- Minimize optimistic state that can diverge from actual match state

Reconnect behavior should be planned early. A player reloading the tab should be able to resume their room or match when possible.

## Testing Priorities

The highest-risk logic should be tested first.

Priority test areas:

- Word validation
- Duplicate-letter guess evaluation
- Timeout behavior
- Match resolution rules
- Realtime update handling
- Reconnect behavior

Manual testing should include at least:

- Two browser tabs in the same room
- Invalid word submission attempts
- Simultaneous guess submissions
- End-of-timer behavior
- Rematch flow

## Non-Goals for Early Agents

Do not prematurely add:

- generalized game-engine abstractions
- overbuilt matchmaking systems
- broad plugin frameworks
- animation-heavy rendering systems
- persistent social systems before the core loop is solid

Agents should focus on building the multiplayer Wordle experience cleanly and safely.

## Expectations for Future Contributors

When working on this project:

- Preserve server-authoritative handling of secrets and results
- Keep gameplay rules centralized and testable
- Avoid leaking sensitive match data into client-readable queries
- Favor clear, boring architecture over clever shortcuts
- Keep the MVP tight and playable before expanding scope

If an implementation decision conflicts with these rules, prefer security, fairness, and clarity over convenience.
