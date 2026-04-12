import { useEffect, useMemo, useState } from 'react';

import { readMockMatchSession } from '../mockMatchSession';
import { LetterState, MockBoardRow, MockMatchState } from '../types';

export function useMockMatch(roomCode: string) {
  const session = useMemo(readMockMatchSession, []);
  const [currentGuess, setCurrentGuess] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(22);
  const [yourBoard, setYourBoard] = useState<MockBoardRow[]>([]);
  const [opponentBoard, setOpponentBoard] = useState<MockBoardRow[]>([]);
  const [statusMessage, setStatusMessage] = useState('Enter a 5-letter guess and submit it.');

  const fallbackState: MockMatchState = {
    roomCode: roomCode.toUpperCase(),
    yourName: 'Guest Player',
    opponentName: 'Host Player',
    yourSecretWord: 'CRANE',
    opponentSecretWord: 'GHOST',
    yourBoard: [
      { word: 'SLATE', result: ['absent', 'present', 'absent', 'correct', 'absent'] },
    ],
    opponentBoard: [
      { word: 'BOUND', result: ['absent', 'absent', 'present', 'absent', 'absent'] },
      { word: 'TRAIL', result: ['present', 'absent', 'absent', 'correct', 'absent'] },
    ],
  };

  const baseMatch =
    !session || session.roomCode.toUpperCase() !== roomCode.toUpperCase()
      ? fallbackState
      : session;

  useEffect(() => {
    setYourBoard(baseMatch.yourBoard);
    setOpponentBoard(baseMatch.opponentBoard);
    setCurrentGuess('');
    setTimerSeconds(22);
    setStatusMessage('Enter a 5-letter guess and submit it.');
  }, [baseMatch.opponentName, baseMatch.opponentSecretWord, baseMatch.roomCode, baseMatch.yourName]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 0) {
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timerSeconds === 0) {
      setStatusMessage('Timer expired in this mock round. Reset by entering a new guess after refresh.');
    }
  }, [timerSeconds]);

  const maxGuesses = 6;
  const isSolved = yourBoard.some((row) => row.word === baseMatch.opponentSecretWord);
  const keyboardState = buildKeyboardState(yourBoard);
  const canSubmit = currentGuess.length === 5 && !isSolved && yourBoard.length < maxGuesses && timerSeconds > 0;

  function handleGuessChange(value: string) {
    if (isSolved || yourBoard.length >= maxGuesses || timerSeconds <= 0) {
      return;
    }

    setCurrentGuess(value.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase());
  }

  function handleKeyPress(key: string) {
    if (key === 'ENTER') {
      submitGuess();
      return;
    }

    if (key === 'BACKSPACE') {
      setCurrentGuess((current) => current.slice(0, -1));
      return;
    }

    if (currentGuess.length >= 5 || isSolved || yourBoard.length >= maxGuesses || timerSeconds <= 0) {
      return;
    }

    setCurrentGuess((current) => `${current}${key}`.slice(0, 5));
  }

  function submitGuess() {
    if (!canSubmit) {
      if (timerSeconds <= 0) {
        setStatusMessage('The round timer has already expired in this mock flow.');
      } else if (currentGuess.length !== 5) {
        setStatusMessage('Guesses must be exactly 5 letters.');
      }

      return;
    }

    const nextRow = {
      word: currentGuess,
      result: evaluateGuess(currentGuess, baseMatch.opponentSecretWord),
    };

    const nextBoard = [...yourBoard, nextRow];
    setYourBoard(nextBoard);
    setCurrentGuess('');
    setTimerSeconds(22);

    const nextOpponentBoard = advanceOpponentBoard(opponentBoard, baseMatch.yourSecretWord);
    setOpponentBoard(nextOpponentBoard);

    if (currentGuess === baseMatch.opponentSecretWord) {
      setStatusMessage(`Solved. ${baseMatch.yourName} wins this mock duel.`);
      return;
    }

    if (nextBoard.length >= maxGuesses) {
      setStatusMessage('No guesses remaining in this mock round.');
      return;
    }

    setStatusMessage(`${nextBoard.length}/${maxGuesses} guesses used. Opponent progress advanced too.`);
  }

  return {
    match: baseMatch,
    currentGuess,
    timerSeconds,
    yourBoard,
    opponentBoard,
    keyboardState,
    statusMessage,
    canSubmit,
    handleGuessChange,
    handleKeyPress,
    submitGuess,
  };
}

function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array.from({ length: guess.length }, () => 'absent');
  const remaining = answer.split('');

  for (let index = 0; index < guess.length; index += 1) {
    if (guess[index] === answer[index]) {
      result[index] = 'correct';
      remaining[index] = '';
    }
  }

  for (let index = 0; index < guess.length; index += 1) {
    if (result[index] === 'correct') {
      continue;
    }

    const remainingIndex = remaining.indexOf(guess[index]);
    if (remainingIndex >= 0) {
      result[index] = 'present';
      remaining[remainingIndex] = '';
    }
  }

  return result;
}

function buildKeyboardState(rows: MockBoardRow[]) {
  const state: Record<string, LetterState> = {};
  const priority: Record<LetterState, number> = {
    absent: 0,
    present: 1,
    correct: 2,
  };

  for (const row of rows) {
    row.word.split('').forEach((letter, index) => {
      const nextState = row.result[index];
      const currentState = state[letter];

      if (!currentState || priority[nextState] > priority[currentState]) {
        state[letter] = nextState;
      }
    });
  }

  return state;
}

function advanceOpponentBoard(board: MockBoardRow[], yourSecretWord: string) {
  const scriptedWords = ['STONE', 'CRISP', 'LIGHT', 'TRACE', yourSecretWord];
  const nextWord = scriptedWords[Math.min(board.length, scriptedWords.length - 1)];
  const nextRow = {
    word: nextWord,
    result: evaluateGuess(nextWord, yourSecretWord),
  };

  return [...board.slice(0, Math.min(board.length, 5)), nextRow].slice(0, 6);
}
