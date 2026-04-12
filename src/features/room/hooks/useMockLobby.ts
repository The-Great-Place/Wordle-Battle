import { useEffect, useMemo, useState } from 'react';

import { readMockRoomSession } from '../mockSession';
import { MockLobbyState } from '../types';
import { normalizeRoomCode } from '../utils';

type SecretWordErrors = {
  secretWord?: string;
};

export function useMockLobby(roomCode: string) {
  const normalizedCode = normalizeRoomCode(roomCode);
  const session = useMemo(readMockRoomSession, []);
  const [isReady, setIsReady] = useState(false);
  const [secretWord, setSecretWord] = useState('');
  const [isWordLocked, setIsWordLocked] = useState(false);
  const [errors, setErrors] = useState<SecretWordErrors>({});

  const playerName =
    session && normalizeRoomCode(session.roomCode) === normalizedCode
      ? session.playerName
      : 'Guest Player';

  const hasOpponent = session?.joinedVia === 'join';
  const opponentName = hasOpponent ? 'Host Player' : 'Waiting for opponent';
  const opponentConnected = hasOpponent;
  const opponentReady = hasOpponent;
  const opponentWordLocked = hasOpponent && isReady;

  const phase = getLobbyPhase({
    isReady,
    hasOpponent,
    isWordLocked,
    opponentWordLocked,
  });

  const lobbyState: MockLobbyState = {
    roomCode: normalizedCode,
    secretWord,
    phase,
    players: {
      playerOne: {
        name: hasOpponent ? opponentName : playerName,
        connected: true,
        ready: hasOpponent ? opponentReady : isReady,
        wordLocked: hasOpponent ? opponentWordLocked : isWordLocked,
        isYou: !hasOpponent,
      },
      playerTwo: {
        name: hasOpponent ? playerName : opponentName,
        connected: hasOpponent,
        ready: hasOpponent ? isReady : false,
        wordLocked: hasOpponent ? isWordLocked : false,
        isYou: hasOpponent,
      },
    },
  };

  useEffect(() => {
    if (phase !== 'word_entry' && errors.secretWord) {
      setErrors({});
    }
  }, [errors.secretWord, phase]);

  function toggleReady() {
    setIsReady((current) => {
      const next = !current;

      if (!next) {
        setIsWordLocked(false);
        setSecretWord('');
        setErrors({});
      }

      return next;
    });
  }

  function handleSecretWordChange(value: string) {
    const sanitized = value.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase();
    setSecretWord(sanitized);
    setErrors((current) => ({ ...current, secretWord: undefined }));
  }

  function lockSecretWord() {
    const validationError = validateSecretWord(secretWord);

    if (validationError) {
      setErrors({ secretWord: validationError });
      return;
    }

    setIsWordLocked(true);
  }

  return {
    lobbyState,
    playerName,
    errors,
    toggleReady,
    handleSecretWordChange,
    lockSecretWord,
  };
}

function validateSecretWord(value: string) {
  if (!value) {
    return 'Enter a five-letter word before locking it in.';
  }

  if (value.length !== 5) {
    return 'Secret words must be exactly 5 letters.';
  }

  return undefined;
}

function getLobbyPhase({
  isReady,
  hasOpponent,
  isWordLocked,
  opponentWordLocked,
}: {
  isReady: boolean;
  hasOpponent: boolean;
  isWordLocked: boolean;
  opponentWordLocked: boolean;
}) {
  if (!hasOpponent) {
    return 'waiting';
  }

  if (!isReady) {
    return 'ready_check';
  }

  if (isWordLocked && opponentWordLocked) {
    return 'locked_in';
  }

  return 'word_entry';
}
