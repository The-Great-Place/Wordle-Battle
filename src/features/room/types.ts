export type RoomJoinMode = 'create' | 'join';

export type MockRoomSession = {
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
