import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { persistRoomSession } from '../mockSession';
import { createRoomSession, joinRoomSession } from '../roomService';
import { RoomFormErrors } from '../types';
import {
  normalizeDisplayName,
  sanitizeRoomCodeInput,
  validateDisplayName,
  validateRoomCode,
} from '../utils';

export function useRoomEntryForm() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [errors, setErrors] = useState<RoomFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedName = useMemo(() => normalizeDisplayName(displayName), [displayName]);

  async function handleCreateRoom() {
    const nameError = validateDisplayName(normalizedName);

    if (nameError) {
      setErrors({ displayName: nameError });
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await createRoomSession(normalizedName);
      persistRoomSession(session);
      navigate(`/room/${session.roomCode}`);
    } catch (error) {
      setErrors({
        displayName: error instanceof Error ? error.message : 'Could not create room.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
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

    try {
      setIsSubmitting(true);
      const session = await joinRoomSession(normalizedName, joinCode);
      persistRoomSession(session);
      navigate(`/room/${session.roomCode}`);
    } catch (error) {
      setErrors({
        joinCode: error instanceof Error ? error.message : 'Could not join room.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
    isSubmitting,
    handleCreateRoom,
    handleJoinRoom,
    handleNameChange,
    handleCodeChange,
  };
}
