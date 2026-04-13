import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { GuessRecord, LiveMatchState, MatchPlayerStateRecord } from './types';

type MatchRow = Database['public']['Tables']['matches']['Row'];

export async function getMatchGuesses(matchId: string): Promise<GuessRecord[]> {
  const { data, error } = await supabase
    .from('guesses')
    .select('id, match_id, player_id, guess_word, result_pattern, guess_index, created_at')
    .eq('match_id', matchId)
    .order('guess_index', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getMatchById(matchId: string): Promise<LiveMatchState | null> {
  const { data, error } = await supabase
    .from('matches')
    .select('id, room_id, status, timer_seconds, max_guesses, started_at, finished_at, winner_player_id')
    .eq('id', matchId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapMatchRow(data) : null;
}

export async function getMatchPlayerStates(matchId: string): Promise<MatchPlayerStateRecord[]> {
  const { data, error } = await supabase
    .from('match_players')
    .select('id, match_id, player_id, turn_deadline_at, solved_at, timed_out_at, last_guess_at, created_at')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function submitGuess(input: {
  matchId: string;
  playerId: string;
  guessWord: string;
}) {
  const { data, error } = await supabase.rpc('submit_match_guess', {
    p_match_id: input.matchId,
    p_player_id: input.playerId,
    p_guess_word: input.guessWord,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0] ?? null;
}

export async function syncMatchTimeouts(matchId: string) {
  const { data, error } = await supabase.rpc('sync_match_timeouts', {
    p_match_id: matchId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0] ?? null;
}

function mapMatchRow(row: Pick<
  MatchRow,
  'id' | 'room_id' | 'status' | 'timer_seconds' | 'max_guesses' | 'started_at' | 'finished_at' | 'winner_player_id'
>): LiveMatchState {
  return {
    id: row.id,
    roomId: row.room_id,
    roomCode: '',
    status: row.status,
    timerSeconds: row.timer_seconds,
    maxGuesses: row.max_guesses,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    winnerPlayerId: row.winner_player_id,
    yourTurnDeadlineAt: null,
    opponentTurnDeadlineAt: null,
  };
}
