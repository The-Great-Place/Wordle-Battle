import { MockMatchState } from './types';

const STORAGE_KEY = 'wordle-battle.mock-match';

export function persistMockMatchSession(match: MockMatchState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
}

export function readMockMatchSession(): MockMatchState | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as MockMatchState;
  } catch {
    return null;
  }
}
