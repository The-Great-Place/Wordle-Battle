import { useEffect, useState } from 'react';

import { supabase } from '../../../lib/supabase';
import { readRoomSession } from '../mockSession';
import { getLatestMatchByRoomId, getRoomByCode, getRoomMembers } from '../roomService';
import { MatchRecord, RoomMemberRecord, RoomRecord } from '../types';
import { normalizeRoomCode } from '../utils';

export function useRoomPresence(roomCode: string) {
  const [room, setRoom] = useState<RoomRecord | null>(null);
  const [match, setMatch] = useState<MatchRecord | null>(null);
  const [members, setMembers] = useState<RoomMemberRecord[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [currentPlayerName, setCurrentPlayerName] = useState('Guest Player');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const channels: Array<ReturnType<typeof supabase.channel>> = [];

    async function refreshRoomState(input: { roomId: string; roomCode: string }) {
      const [roomMembers, nextRoom, nextMatch] = await Promise.all([
        getRoomMembers(input.roomId),
        getRoomByCode(input.roomCode),
        getLatestMatchByRoomId(input.roomId),
      ]);

      if (!isActive) {
        return;
      }

      setRoom(nextRoom);
      setMembers(roomMembers);
      setMatch(nextMatch);
    }

    async function loadRoom() {
      try {
        setIsLoading(true);
        setError(null);

        const normalizedCode = normalizeRoomCode(roomCode);
        const session = readRoomSession();

        if (session && normalizeRoomCode(session.roomCode) === normalizedCode) {
          setCurrentPlayerId(session.playerId);
          setCurrentPlayerName(session.playerName);
        }

        const roomRecord = await getRoomByCode(normalizedCode);

        if (!roomRecord) {
          throw new Error('This room does not exist anymore.');
        }

        const roomMembers = await getRoomMembers(roomRecord.id);

        if (!isActive) {
          return;
        }

        setRoom(roomRecord);
        setMembers(roomMembers);
        setMatch(await getLatestMatchByRoomId(roomRecord.id));

        const roomPlayersChannel = supabase
          .channel(`room-players-${roomRecord.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'room_players',
              filter: `room_id=eq.${roomRecord.id}`,
            },
            () => {
              void refreshRoomState({
                roomId: roomRecord.id,
                roomCode: roomRecord.code,
              });
            },
          )
          .subscribe();

        channels.push(roomPlayersChannel);

        const roomChannel = supabase
          .channel(`room-${roomRecord.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'rooms',
              filter: `id=eq.${roomRecord.id}`,
            },
            () => {
              void refreshRoomState({
                roomId: roomRecord.id,
                roomCode: roomRecord.code,
              });
            },
          )
          .subscribe();

        channels.push(roomChannel);

        const matchChannel = supabase
          .channel(`matches-${roomRecord.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'matches',
              filter: `room_id=eq.${roomRecord.id}`,
            },
            () => {
              void refreshRoomState({
                roomId: roomRecord.id,
                roomCode: roomRecord.code,
              });
            },
          )
          .subscribe();

        channels.push(matchChannel);

        if (!isActive) {
          await Promise.all(channels.map((channel) => supabase.removeChannel(channel)));
        }
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Could not load room.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadRoom();

    return () => {
      isActive = false;
      void Promise.all(channels.map((channel) => supabase.removeChannel(channel)));
    };
  }, [roomCode]);

  return {
    room,
    match,
    members,
    currentPlayerId,
    currentPlayerName,
    isLoading,
    error,
  };
}
