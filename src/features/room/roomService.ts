import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { MatchRecord, RoomMemberRecord, RoomRecord, RoomSession } from './types';
import { createMockRoomCode, normalizeRoomCode } from './utils';

type PlayerInsert = Database['public']['Tables']['players']['Insert'];
type RoomInsert = Database['public']['Tables']['rooms']['Insert'];
type RoomPlayerInsert = Database['public']['Tables']['room_players']['Insert'];
type MatchInsert = Database['public']['Tables']['matches']['Insert'];
type MatchUpdate = Database['public']['Tables']['matches']['Update'];
type SecretWordInsert = Database['public']['Tables']['secret_words']['Insert'];
type RoomUpdate = Database['public']['Tables']['rooms']['Update'];

export async function createRoomSession(displayName: string): Promise<RoomSession> {
  const player = await createGuestPlayer(displayName);
  const room = await createRoom(player.id);
  await addPlayerToRoom({
    roomId: room.id,
    playerId: player.id,
    seat: 'A',
  });

  return {
    playerId: player.id,
    roomCode: room.code,
    playerName: player.display_name,
    joinedVia: 'create',
  };
}

export async function joinRoomSession(displayName: string, roomCode: string): Promise<RoomSession> {
  const normalizedCode = normalizeRoomCode(roomCode);
  const room = await getRoomByCode(normalizedCode);

  if (!room) {
    throw new Error('Room not found. Double-check the code and try again.');
  }

  const roomMembers = await getRoomMembers(room.id);

  if (roomMembers.length >= 2) {
    throw new Error('That room is already full.');
  }

  const player = await createGuestPlayer(displayName);
  await addPlayerToRoom({
    roomId: room.id,
    playerId: player.id,
    seat: roomMembers.some((member) => member.seat === 'A') ? 'B' : 'A',
  });

  return {
    playerId: player.id,
    roomCode: room.code,
    playerName: player.display_name,
    joinedVia: 'join',
  };
}

export async function getRoomByCode(code: string): Promise<RoomRecord | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select('id, code, status')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getLatestMatchByRoomId(roomId: string): Promise<MatchRecord | null> {
  const { data, error } = await supabase
    .from('matches')
    .select(
      'id, room_id, status, timer_seconds, max_guesses, started_at, finished_at, winner_player_id, created_at',
    )
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getRoomMembers(roomId: string): Promise<RoomMemberRecord[]> {
  const { data, error } = await supabase
    .from('room_players')
    .select(
      `
        id,
        seat,
        ready_state,
        word_locked,
        player:players!room_players_player_id_fkey (
          id,
          display_name
        )
      `,
    )
    .eq('room_id', roomId)
    .order('seat', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((member) => ({
    id: member.id,
    seat: member.seat,
    ready_state: member.ready_state,
    word_locked: member.word_locked,
    player: Array.isArray(member.player) ? member.player[0] : member.player,
  }));
}

export async function updateRoomMemberState(input: {
  roomPlayerId: string;
  readyState?: boolean;
  wordLocked?: boolean;
}) {
  const payload: Database['public']['Tables']['room_players']['Update'] = {};

  if (typeof input.readyState === 'boolean') {
    payload.ready_state = input.readyState;
  }

  if (typeof input.wordLocked === 'boolean') {
    payload.word_locked = input.wordLocked;
  }

  const { error } = await supabase
    .from('room_players')
    .update(payload)
    .eq('id', input.roomPlayerId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function ensurePendingMatchForRoom(roomId: string) {
  const existingMatch = await getLatestMatchByRoomId(roomId);

  if (existingMatch && existingMatch.status !== 'finished') {
    return existingMatch;
  }

  const payload: MatchInsert = {
    room_id: roomId,
    status: 'awaiting_words',
  };

  const { data, error } = await supabase
    .from('matches')
    .insert(payload)
    .select(
      'id, room_id, status, timer_seconds, max_guesses, started_at, finished_at, winner_player_id, created_at',
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function submitSecretWord(input: {
  matchId: string;
  playerId: string;
  word: string;
}) {
  const payload: SecretWordInsert = {
    match_id: input.matchId,
    player_id: input.playerId,
    encrypted_word: input.word,
    word_length: input.word.length,
  };

  const { error } = await supabase.from('secret_words').insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateRoomStatus(roomId: string, status: RoomRecord['status']) {
  const payload: RoomUpdate = { status };

  const { error } = await supabase.from('rooms').update(payload).eq('id', roomId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateMatchState(matchId: string, input: MatchUpdate) {
  const { error } = await supabase.from('matches').update(input).eq('id', matchId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function syncRoomMatchLifecycle(roomId: string) {
  const [members, match] = await Promise.all([
    getRoomMembers(roomId),
    getLatestMatchByRoomId(roomId),
  ]);

  if (members.length < 2) {
    await updateRoomStatus(roomId, 'waiting_for_players');
    return { match: null, roomStatus: 'waiting_for_players' as const };
  }

  if (!match) {
    await updateRoomStatus(roomId, 'waiting_for_words');
    return { match: null, roomStatus: 'waiting_for_words' as const };
  }

  const lockedCount = members.filter((member) => member.word_locked).length;

  if (lockedCount >= 2) {
    if (match.status !== 'active') {
      const { error } = await supabase.rpc('activate_match_with_turns', {
        p_match_id: match.id,
      });

      if (error) {
        throw new Error(error.message);
      }
    }

    await updateRoomStatus(roomId, 'in_match');
    return { match, roomStatus: 'in_match' as const };
  }

  await updateRoomStatus(roomId, 'waiting_for_words');
  return { match, roomStatus: 'waiting_for_words' as const };
}

async function createGuestPlayer(displayName: string) {
  const payload: PlayerInsert = {
    display_name: displayName,
    is_guest: true,
  };

  const { data, error } = await supabase.from('players').insert(payload).select('id, display_name').single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function createRoom(playerId: string) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const payload: RoomInsert = {
      code: createMockRoomCode(),
      created_by_player_id: playerId,
      status: 'waiting_for_players',
    };

    const { data, error } = await supabase.from('rooms').insert(payload).select('id, code, status').single();

    if (!error) {
      return data;
    }

    if (error.code !== '23505') {
      throw new Error(error.message);
    }
  }

  throw new Error('Could not generate a unique room code. Please try again.');
}

async function addPlayerToRoom(input: {
  roomId: string;
  playerId: string;
  seat: 'A' | 'B';
}) {
  const payload: RoomPlayerInsert = {
    room_id: input.roomId,
    player_id: input.playerId,
    seat: input.seat,
  };

  const { error } = await supabase.from('room_players').insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}
