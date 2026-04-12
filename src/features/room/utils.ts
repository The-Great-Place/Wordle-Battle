export function normalizeDisplayName(value: string) {
  return value.trim();
}

export function normalizeRoomCode(value: string) {
  return value.trim().toUpperCase();
}

export function sanitizeRoomCodeInput(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
}

export function validateDisplayName(value: string) {
  if (!value) {
    return 'Enter a display name before starting.';
  }

  if (value.length < 2) {
    return 'Use at least 2 characters so the lobby reads clearly.';
  }

  return undefined;
}

export function validateRoomCode(value: string) {
  const normalized = normalizeRoomCode(value);

  if (!normalized) {
    return 'Enter a room code to join a mock lobby.';
  }

  if (normalized.length < 4) {
    return 'Room codes should be at least 4 characters.';
  }

  return undefined;
}

export function createMockRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(
    '',
  );
}
