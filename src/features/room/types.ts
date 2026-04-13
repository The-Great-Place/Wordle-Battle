export type RoomJoinMode = 'create' | 'join';

export type RoomSession = {
  playerId: string;
  roomCode: string;
  playerName: string;
  joinedVia: RoomJoinMode;
};

export type RoomFormErrors = {
  displayName?: string;
  joinCode?: string;
};

export type LobbyPlayerState = {
  name: string;
  connected: boolean;
  ready: boolean;
  wordLocked: boolean;
  isYou: boolean;
};

export type MockLobbyState = {
  roomCode: string;
  players: {
    playerOne: LobbyPlayerState;
    playerTwo: LobbyPlayerState;
  };
  phase: 'waiting' | 'ready_check' | 'word_entry' | 'locked_in';
  secretWord: string;
};

export type RoomRecord = {
  id: string;
  code: string;
  status:
    | 'waiting_for_players'
    | 'waiting_for_words'
    | 'ready_to_start'
    | 'in_match'
        | 'match_finished';
};

export type MatchRecord = {
  id: string;
  room_id: string;
  status: 'awaiting_words' | 'active' | 'finished';
  timer_seconds: number;
  max_guesses: number;
  started_at: string | null;
  finished_at: string | null;
  winner_player_id: string | null;
  created_at: string;
};

export type RoomMemberRecord = {
  id: string;
  seat: 'A' | 'B';
  ready_state: boolean;
  word_locked: boolean;
  player: {
    id: string;
    display_name: string;
  };
};
