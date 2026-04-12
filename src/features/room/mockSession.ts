import { MockRoomSession } from './types';

const STORAGE_KEY = 'wordle-battle.mock-session';

export function readMockRoomSession(): MockRoomSession | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as MockRoomSession;
  } catch {
    return null;
  }
}

export function persistMockRoomSession(session: MockRoomSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
