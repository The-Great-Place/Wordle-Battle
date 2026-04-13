export type MockBoardRow = {
  word: string;
  result: Array<'correct' | 'present' | 'absent'>;
};

export type LetterState = 'correct' | 'present' | 'absent';

export type GuessRecord = {
  id: string;
  match_id: string;
  player_id: string;
  guess_word: string;
  result_pattern: string;
  guess_index: number;
  created_at: string;
};

export type MatchPlayerStateRecord = {
  id: string;
  match_id: string;
  player_id: string;
  turn_deadline_at: string | null;
  solved_at: string | null;
  timed_out_at: string | null;
  last_guess_at: string | null;
  created_at: string;
};

export type LiveMatchState = {
  id: string;
  roomId: string;
  roomCode: string;
  status: 'awaiting_words' | 'active' | 'finished';
  timerSeconds: number;
  maxGuesses: number;
  startedAt: string | null;
  finishedAt: string | null;
  winnerPlayerId: string | null;
  yourTurnDeadlineAt: string | null;
  opponentTurnDeadlineAt: string | null;
};

export type MockMatchState = {
  roomCode: string;
  yourName: string;
  opponentName: string;
  yourSecretWord: string;
  opponentSecretWord: string;
  yourBoard: MockBoardRow[];
  opponentBoard: MockBoardRow[];
};
