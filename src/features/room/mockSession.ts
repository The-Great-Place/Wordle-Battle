import { RoomSession } from './types';

const STORAGE_KEY = 'wordle-battle.room-session';

export function readRoomSession(): RoomSession | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as RoomSession;
  } catch {
    return null;
  }
}

export function persistRoomSession(session: RoomSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
