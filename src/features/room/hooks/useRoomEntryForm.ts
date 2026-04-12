import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { persistMockRoomSession } from '../mockSession';
import { RoomFormErrors } from '../types';
import {
  createMockRoomCode,
  normalizeDisplayName,
  normalizeRoomCode,
  sanitizeRoomCodeInput,
  validateDisplayName,
  validateRoomCode,
} from '../utils';

export function useRoomEntryForm() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [errors, setErrors] = useState<RoomFormErrors>({});

  const normalizedName = useMemo(() => normalizeDisplayName(displayName), [displayName]);

  function handleCreateRoom() {
    const nameError = validateDisplayName(normalizedName);

    if (nameError) {
      setErrors({ displayName: nameError });
      return;
    }

    const roomCode = createMockRoomCode();
    persistMockRoomSession({
      roomCode,
      playerName: normalizedName,
      joinedVia: 'create',
    });
    navigate(`/room/${roomCode}`);
  }

  function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nameError = validateDisplayName(normalizedName);
    const codeError = validateRoomCode(joinCode);

    if (nameError || codeError) {
      setErrors({
        displayName: nameError,
        joinCode: codeError,
      });
      return;
    }

    const normalizedCode = normalizeRoomCode(joinCode);
    persistMockRoomSession({
      roomCode: normalizedCode,
      playerName: normalizedName,
      joinedVia: 'join',
    });
    navigate(`/room/${normalizedCode}`);
  }

  function handleNameChange(value: string) {
    setDisplayName(value);
    setErrors((current) => ({ ...current, displayName: undefined }));
  }

  function handleCodeChange(value: string) {
    setJoinCode(sanitizeRoomCodeInput(value));
    setErrors((current) => ({ ...current, joinCode: undefined }));
  }

  return {
    displayName,
    joinCode,
    errors,
    handleCreateRoom,
    handleJoinRoom,
    handleNameChange,
    handleCodeChange,
  };
}
