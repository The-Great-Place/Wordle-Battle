import { useEffect, useState } from 'react';

import { MatchRecord, MockLobbyState, RoomMemberRecord, RoomRecord } from '../types';
import {
  ensurePendingMatchForRoom,
  restartMatch,
  submitSecretWord,
  updateRoomMemberState,
} from '../roomService';
import { normalizeRoomCode } from '../utils';

type SecretWordErrors = {
  secretWord?: string;
};

export function useMockLobby(input: {
  roomId: string | null;
  roomCode: string;
  roomStatus?: RoomRecord['status'];
  match?: MatchRecord | null;
  currentPlayerId: string | null;
  currentPlayerName: string;
  members: RoomMemberRecord[];
}) {
  const { roomId, roomCode, roomStatus, match, currentPlayerId, currentPlayerName, members } = input;
  const normalizedCode = normalizeRoomCode(roomCode);
  const [secretWord, setSecretWord] = useState('');
  const [errors, setErrors] = useState<SecretWordErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const you = members.find((member) => member.player.id === currentPlayerId) ?? null;
  const opponent = members.find((member) => member.player.id !== currentPlayerId) ?? null;
  const hasOpponent = Boolean(opponent);
  const opponentName = opponent?.player.display_name ?? 'Waiting for opponent';
  const opponentConnected = Boolean(opponent);
  const opponentReady = opponent?.ready_state ?? false;
  const opponentWordLocked = opponent?.word_locked ?? false;
  const playerName = you?.player.display_name ?? currentPlayerName;
  const yourSeat = you?.seat ?? 'A';
  const isReady = you?.ready_state ?? false;
  const isWordLocked = you?.word_locked ?? false;
  const isMatchFinished = match?.status === 'finished' || roomStatus === 'match_finished';

  const phase = getLobbyPhase({
    isReady,
    hasOpponent,
    isWordLocked,
    opponentWordLocked,
    isMatchFinished,
  });

  const lobbyState: MockLobbyState = {
    roomCode: normalizedCode,
    secretWord,
    phase,
    players: {
      playerOne: {
        name: yourSeat === 'A' ? playerName : opponentName,
        connected: yourSeat === 'A' ? true : opponentConnected,
        ready: yourSeat === 'A' ? isReady : opponentReady,
        wordLocked: yourSeat === 'A' ? isWordLocked : opponentWordLocked,
        isYou: yourSeat === 'A',
      },
      playerTwo: {
        name: yourSeat === 'A' ? opponentName : playerName,
        connected: yourSeat === 'A' ? opponentConnected : true,
        ready: yourSeat === 'A' ? opponentReady : isReady,
        wordLocked: yourSeat === 'A' ? opponentWordLocked : isWordLocked,
        isYou: yourSeat === 'B',
      },
    },
  };

  useEffect(() => {
    if (phase !== 'word_entry' && errors.secretWord) {
      setErrors({});
    }
  }, [errors.secretWord, phase]);

  useEffect(() => {
    if (!isWordLocked) {
      return;
    }

    setSecretWord('');
  }, [isWordLocked]);

  async function toggleReady() {
    if (!you) {
      setErrors({ secretWord: 'Your player session is missing from this room.' });
      return;
    }

    const nextReady = !isReady;

    try {
      setIsSaving(true);
      await updateRoomMemberState({
        roomPlayerId: you.id,
        readyState: nextReady,
        wordLocked: nextReady ? false : false,
      });

      if (!nextReady) {
        setSecretWord('');
        setErrors({});
      }
    } catch (error) {
      setErrors({
        secretWord: error instanceof Error ? error.message : 'Could not update ready state.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleSecretWordChange(value: string) {
    const sanitized = value.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase();
    setSecretWord(sanitized);
    setErrors((current) => ({ ...current, secretWord: undefined }));
  }

  async function lockSecretWord() {
    if (!you || !roomId) {
      setErrors({ secretWord: 'Your player session is missing from this room.' });
      return;
    }

    const validationError = validateSecretWord(secretWord);

    if (validationError) {
      setErrors({ secretWord: validationError });
      return;
    }

    try {
      setIsSaving(true);
      const match = await ensurePendingMatchForRoom(roomId);
      await submitSecretWord({
        matchId: match.id,
        playerId: you.player.id,
        word: secretWord,
      });
      setSecretWord('');
    } catch (error) {
      setErrors({
        secretWord: error instanceof Error ? error.message : 'Could not lock secret word.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function startNextRound() {
    if (!roomId || !currentPlayerId) {
      setErrors({ secretWord: 'Your player session is missing from this room.' });
      return;
    }

    try {
      setIsSaving(true);
      setErrors({});
      setSecretWord('');
      await restartMatch({
        roomId,
        playerId: currentPlayerId,
      });
    } catch (error) {
      setErrors({
        secretWord: error instanceof Error ? error.message : 'Could not start the next round.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return {
    lobbyState,
    playerName,
    errors,
    isSaving,
    isMatchFinished,
    toggleReady,
    handleSecretWordChange,
    lockSecretWord,
    startNextRound,
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
  isMatchFinished,
}: {
  isReady: boolean;
  hasOpponent: boolean;
  isWordLocked: boolean;
  opponentWordLocked: boolean;
  isMatchFinished: boolean;
}) {
  if (isMatchFinished) {
    return 'ready_check';
  }

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
