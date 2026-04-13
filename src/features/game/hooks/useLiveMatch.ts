import { useEffect, useMemo, useState } from 'react';

import { supabase } from '../../../lib/supabase';
import { readRoomSession } from '../../room/mockSession';
import { useRoomPresence } from '../../room/hooks/useRoomPresence';
import { getMatchById, getMatchGuesses, getMatchPlayerStates, submitGuess, syncMatchTimeouts } from '../gameService';
import { GuessRecord, LetterState, LiveMatchState, MatchPlayerStateRecord, MockBoardRow } from '../types';

export function useLiveMatch(roomCode: string) {
  const { room, match, members, currentPlayerId, currentPlayerName, isLoading, error } = useRoomPresence(roomCode);
  const [liveMatch, setLiveMatch] = useState<LiveMatchState | null>(null);
  const [matchPlayerStates, setMatchPlayerStates] = useState<MatchPlayerStateRecord[]>([]);
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [statusMessage, setStatusMessage] = useState('Waiting for match state.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [clockTick, setClockTick] = useState(() => Date.now());
  const session = useMemo(readRoomSession, []);

  useEffect(() => {
    if (!match) {
      setLiveMatch(null);
      setMatchPlayerStates([]);
      setGuesses([]);
      setStatusMessage('Waiting for both players to lock their secret words.');
      return;
    }

    const matchId = match.id;
    let isActive = true;
    const channels: Array<ReturnType<typeof supabase.channel>> = [];

    async function refreshMatchState() {
      try {
        const [nextMatch, nextGuesses, nextMatchPlayers] = await Promise.all([
          getMatchById(matchId),
          getMatchGuesses(matchId),
          getMatchPlayerStates(matchId),
        ]);

        if (!isActive) {
          return;
        }

        const yourState = nextMatchPlayers.find((playerState) => playerState.player_id === currentPlayerId) ?? null;
        const opponentState = nextMatchPlayers.find((playerState) => playerState.player_id !== currentPlayerId) ?? null;

        setLiveMatch(
          nextMatch
            ? {
                ...nextMatch,
                roomCode: room?.code ?? roomCode.toUpperCase(),
                yourTurnDeadlineAt: yourState?.turn_deadline_at ?? null,
                opponentTurnDeadlineAt: opponentState?.turn_deadline_at ?? null,
              }
            : null,
        );
        setMatchPlayerStates(nextMatchPlayers);
        setGuesses(nextGuesses);
        setRefreshError(null);
      } catch (nextError) {
        if (!isActive) {
          return;
        }

        setRefreshError(nextError instanceof Error ? nextError.message : 'Could not load match state.');
      }
    }

    void refreshMatchState();

    const guessChannel = supabase
      .channel(`guesses-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guesses',
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          void refreshMatchState();
        },
      )
      .subscribe();

    channels.push(guessChannel);

    const matchChannel = supabase
      .channel(`live-match-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        () => {
          void refreshMatchState();
        },
      )
      .subscribe();

    channels.push(matchChannel);

    const matchPlayersChannel = supabase
      .channel(`match-players-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_players',
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          void refreshMatchState();
        },
      )
      .subscribe();

    channels.push(matchPlayersChannel);

    const syncTimer = window.setInterval(() => {
      void syncMatchTimeouts(matchId).catch(() => undefined);
    }, 2000);

    return () => {
      isActive = false;
      window.clearInterval(syncTimer);
      void Promise.all(channels.map((channel) => supabase.removeChannel(channel)));
    };
  }, [currentPlayerId, match, room?.code, roomCode]);

  useEffect(() => {
    const displayTimer = window.setInterval(() => {
      setClockTick(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(displayTimer);
    };
  }, []);

  useEffect(() => {
    if (refreshError) {
      setStatusMessage(refreshError);
      return;
    }

    if (!liveMatch) {
      return;
    }

    const yourBoard = guesses.filter((guess) => guess.player_id === currentPlayerId);
    const solved = yourBoard.some((guess) => guess.result_pattern === 'CCCCC');
    const yourPlayerState = matchPlayerStates.find((playerState) => playerState.player_id === currentPlayerId) ?? null;
    const opponentPlayerState = matchPlayerStates.find((playerState) => playerState.player_id !== currentPlayerId) ?? null;

    if (liveMatch.status === 'finished') {
      if (yourPlayerState?.timed_out_at) {
        setStatusMessage('Your timer expired. Match complete.');
      } else if (opponentPlayerState?.timed_out_at) {
        setStatusMessage('Your opponent timed out. Match complete.');
      } else if (liveMatch.winnerPlayerId === currentPlayerId) {
        setStatusMessage('You solved the word first. Match complete.');
      } else if (liveMatch.winnerPlayerId) {
        setStatusMessage('Your opponent solved your word first.');
      } else {
        setStatusMessage('Match finished in a draw.');
      }

      return;
    }

    if (solved) {
      setStatusMessage('Solved. Waiting for the server to close out the match.');
      return;
    }

    setStatusMessage('Enter a valid 5-letter guess to submit it to the live match.');
  }, [currentPlayerId, guesses, liveMatch, matchPlayerStates, refreshError]);

  const yourGuesses = guesses.filter((guess) => guess.player_id === currentPlayerId);
  const opponentGuesses = guesses.filter((guess) => guess.player_id !== currentPlayerId);
  const yourBoard = yourGuesses.map(mapGuessToBoardRow);
  const opponentBoard = opponentGuesses.map(mapGuessToBoardRow);
  const keyboardState = buildKeyboardState(yourBoard);
  const currentMember = members.find((member) => member.player.id === currentPlayerId) ?? null;
  const opponentMember = members.find((member) => member.player.id !== currentPlayerId) ?? null;
  const yourName = currentMember?.player.display_name ?? currentPlayerName ?? session?.playerName ?? 'Guest Player';
  const opponentName = opponentMember?.player.display_name ?? 'Waiting for opponent';
  const maxGuesses = liveMatch?.maxGuesses ?? match?.max_guesses ?? 6;
  const canSubmit =
    Boolean(liveMatch) &&
    liveMatch?.status === 'active' &&
    currentGuess.length === 5 &&
    !isSubmitting &&
    yourBoard.length < maxGuesses;

  async function handleSubmitGuess() {
    if (!liveMatch || !currentPlayerId) {
      setStatusMessage('Match state is not ready yet.');
      return;
    }

    if (currentGuess.length !== 5) {
      setStatusMessage('Guesses must be exactly 5 letters.');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitGuess({
        matchId: liveMatch.id,
        playerId: currentPlayerId,
        guessWord: currentGuess,
      });
      setCurrentGuess('');
    } catch (submitError) {
      setStatusMessage(submitError instanceof Error ? submitError.message : 'Could not submit guess.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGuessChange(value: string) {
    if (liveMatch?.status !== 'active') {
      return;
    }

    setCurrentGuess(value.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase());
  }

  function handleKeyPress(key: string) {
    if (key === 'ENTER') {
      void handleSubmitGuess();
      return;
    }

    if (key === 'BACKSPACE') {
      setCurrentGuess((current) => current.slice(0, -1));
      return;
    }

    if (liveMatch?.status !== 'active' || currentGuess.length >= 5) {
      return;
    }

    setCurrentGuess((current) => `${current}${key}`.slice(0, 5));
  }

  return {
    room,
    liveMatch,
    currentGuess,
    yourBoard,
    opponentBoard,
    keyboardState,
    statusMessage,
    canSubmit,
    isSubmitting,
    isLoading,
    error: error ?? refreshError,
    yourName,
    opponentName,
    timerSeconds: getDisplayTimerSeconds(liveMatch?.yourTurnDeadlineAt, clockTick),
    opponentTimerSeconds: getDisplayTimerSeconds(liveMatch?.opponentTurnDeadlineAt, clockTick),
    handleGuessChange,
    handleKeyPress,
    submitGuess: handleSubmitGuess,
  };
}

function mapGuessToBoardRow(guess: GuessRecord): MockBoardRow {
  return {
    word: guess.guess_word,
    result: guess.result_pattern.split('').map(mapPatternLetter) as LetterState[],
  };
}

function mapPatternLetter(value: string): LetterState {
  switch (value) {
    case 'C':
      return 'correct';
    case 'P':
      return 'present';
    case 'A':
    default:
      return 'absent';
  }
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

function getDisplayTimerSeconds(deadlineAt: string | null | undefined, currentTimeMs: number) {
  if (!deadlineAt) {
    return 0;
  }

  const remainingSeconds = Math.ceil((new Date(deadlineAt).getTime() - currentTimeMs) / 1000);
  return Math.max(remainingSeconds, 0);
}
