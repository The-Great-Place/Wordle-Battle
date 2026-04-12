export type MockBoardRow = {
  word: string;
  result: Array<'correct' | 'present' | 'absent'>;
};

export type LetterState = 'correct' | 'present' | 'absent';

export type MockMatchState = {
  roomCode: string;
  yourName: string;
  opponentName: string;
  yourSecretWord: string;
  opponentSecretWord: string;
  yourBoard: MockBoardRow[];
  opponentBoard: MockBoardRow[];
};
