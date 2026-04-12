# plan.md

## Project Roadmap

This roadmap breaks the project into phases that can be implemented incrementally while keeping the multiplayer architecture sound from the start.

## Phase 1: Project Setup

Goals:

- Initialize a React + TypeScript + Vite application
- Set up CSS Modules as the styling approach
- Configure Supabase client access and environment variables
- Establish initial routing and application shell
- Create a minimal but clean project structure

Deliverables:

- Base frontend app runs locally
- Shared layout and route structure exist
- Supabase client module is configured
- Basic page placeholders are in place

Suggested tasks:

1. Create the Vite React TypeScript app
2. Set up CSS Modules conventions
3. Add a simple global theme and CSS variables
4. Add frontend routing
5. Add Supabase JavaScript client
6. Create app folders for `pages`, `components`, `features`, `lib`, and `types`

## Phase 2: Supabase Project and Schema

Goals:

- Create the initial database schema
- Model guests, rooms, matches, and guesses
- Establish secure access patterns
- Prepare the app for room creation and joining

Deliverables:

- Initial migration or schema SQL
- Core tables exist
- Row Level Security strategy is defined
- Room code flow is possible

Suggested tasks:

1. Create tables for `rooms`, `players`, `room_players`, `matches`, `secret_words`, `guesses`, and `rematch_votes`
2. Define match and room status enums or constrained values
3. Add indexes for room lookup and match query paths
4. Configure RLS policies for client-readable tables
5. Ensure secret words are not client-readable
6. Implement room code generation strategy

## Phase 3: Guest Flow and Room Lifecycle

Goals:

- Let players create and join rooms without a required account
- Support private friend matches through room codes
- Show player presence in the room lobby

Deliverables:

- A player can create a room
- A second player can join by room code
- Both players appear in the same lobby
- Both players can see ready and connected state

Suggested tasks:

1. Build landing page create/join forms
2. Create guest player records or guest session handling
3. Add room creation flow
4. Add room join validation flow
5. Subscribe to room presence updates
6. Build lobby UI showing both player slots

## Phase 4: Secret Word Submission

Goals:

- Allow each player to submit a secret word securely
- Validate words against an approved list
- Prevent secret leakage to the opponent

Deliverables:

- Each player can submit a valid secret word
- Invalid words are rejected
- Both players can lock in their word
- Match transitions only when both words are submitted

Suggested tasks:

1. Define allowed word list strategy
2. Build secret word submission form
3. Create an Edge Function for secret word validation and storage
4. Store secret words in a protected table
5. Update match state when both words are locked
6. Show lobby-to-match transition in the UI

## Phase 5: Guess Evaluation and Match Logic

Goals:

- Implement secure, server-side Wordle evaluation
- Handle duplicate-letter rules correctly
- Persist guesses and results
- Resolve match outcomes correctly

Deliverables:

- Players can submit guesses
- Guess results are returned from server-side logic
- Match can end with win, draw, or timeout
- Core game loop is functional

Suggested tasks:

1. Create an Edge Function for guess submission
2. Load the opponent's secret word only inside server-side code
3. Implement Wordle-style feedback logic with duplicate-letter support
4. Persist guess rows and result patterns
5. Enforce guess count limits
6. Enforce match-finished guardrails
7. Add end-state resolution logic

## Phase 6: Match Screen UI

Goals:

- Build the main competitive play interface
- Show both boards clearly
- Display timer, status, and player identity information

Deliverables:

- Dual-board layout is implemented
- Players can enter guesses from the match screen
- Opponent progress is visible in real time
- UI clearly communicates match state

Suggested tasks:

1. Build the main match screen route
2. Build reusable board component
3. Build input and keyboard components
4. Build match status and player header components
5. Add loading and waiting states
6. Add mobile-responsive layout behavior

## Phase 7: Timer and Realtime Sync

Goals:

- Make the game feel live and competitive
- Ensure timers are responsive but still authoritative
- Keep both players synchronized during play

Deliverables:

- Realtime subscriptions update both clients during the match
- Timer is visible and understandable
- Timeout behavior resolves correctly

Suggested tasks:

1. Add realtime subscriptions for match updates and guesses
2. Render local countdowns based on server timestamps
3. Validate timeout behavior on the server
4. Update UI on player timeout
5. Handle edge cases around simultaneous submissions
6. Test two-tab synchronization repeatedly

## Phase 8: Results and Rematch

Goals:

- Close the loop cleanly at the end of each match
- Support immediate replay with minimal friction

Deliverables:

- End-of-match result UI exists
- Secret words can be revealed after the match if desired
- Both players can request a rematch
- A new match can begin from the same room

Suggested tasks:

1. Build result modal or end screen
2. Show win, loss, draw, or timeout messaging
3. Reveal final words after match completion
4. Add rematch voting/state
5. Reset room into next match flow

## Phase 9: Reliability and Polish

Goals:

- Make the game durable enough for regular testing and iteration
- Improve feel without expanding scope too early

Deliverables:

- Better loading and error handling
- Reconnect behavior is reasonable
- Basic polish improves clarity and responsiveness

Suggested tasks:

1. Improve empty, loading, and failure states
2. Handle reconnect and resume flows
3. Add subtle animations for board updates and match transitions
4. Improve desktop and mobile spacing
5. Add basic accessibility improvements
6. Clean up rough interaction edges

## Phase 10: Post-MVP Options

These should wait until the core multiplayer loop is stable and fun.

Possible extensions:

- Optional accounts with persistent identity
- Match history and stats
- Public matchmaking
- Friends or invite links
- Spectator mode
- Ranked mode
- Expanded word lengths or variant modes
- Cosmetic personalization

## First Milestone

The first major milestone should be:

- Two players can open two browser tabs
- One creates a room and the other joins
- Both submit secret words
- Both submit guesses
- Server evaluates guesses securely
- Both boards update in real time
- The match ends correctly

If this milestone works, the project has a real playable core.

## Engineering Priorities

When tradeoffs appear, prioritize in this order:

1. Security of hidden words
2. Correctness of guess evaluation
3. Match-state clarity
4. Realtime consistency
5. UI polish

The project should solve correctness and fairness before expanding feature scope.
