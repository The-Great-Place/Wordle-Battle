import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { PlayerSlot } from '../../features/room/components/PlayerSlot';
import { SecretWordForm } from '../../features/room/components/SecretWordForm';
import { useMockLobby } from '../../features/room/hooks/useMockLobby';
import { useRoomPresence } from '../../features/room/hooks/useRoomPresence';
import styles from './RoomLobbyPage.module.css';

export function RoomLobbyPage() {
  const navigate = useNavigate();
  const { roomCode = '' } = useParams();
  const { room, match, members, currentPlayerId, currentPlayerName, isLoading, error } = useRoomPresence(roomCode);
  const {
    lobbyState,
    playerName,
    errors,
    isSaving,
    isMatchFinished,
    toggleReady,
    handleSecretWordChange,
    lockSecretWord,
    startNextRound,
  } =
    useMockLobby({
      roomId: room?.id ?? null,
      roomCode,
      roomStatus: room?.status,
      match,
      currentPlayerId,
      currentPlayerName,
      members,
    });
  const { playerOne, playerTwo } = lobbyState.players;

  useEffect(() => {
    if (room?.status === 'in_match' && match?.status === 'active') {
      navigate(`/match/${room.code}`);
    }
  }, [match?.status, navigate, room?.code, room?.status]);

  if (isLoading) {
    return (
      <section className={styles.layout}>
        <div className={styles.primaryCard}>
          <p className={styles.kicker}>Room Loading</p>
          <h2 className={styles.heading}>Fetching room state...</h2>
        </div>
      </section>
    );
  }

  if (error || !room) {
    return (
      <section className={styles.layout}>
        <div className={styles.primaryCard}>
          <p className={styles.kicker}>Room Error</p>
          <h2 className={styles.heading}>Could not load room</h2>
          <p className={styles.description}>{error ?? 'This room is unavailable right now.'}</p>
          <div className={styles.actionRow}>
            <Link className={styles.secondaryAction} to="/">
              Back to Landing
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.layout}>
      <div className={styles.primaryCard}>
        <p className={styles.kicker}>Live Lobby</p>
        <h2 className={styles.heading}>Room {lobbyState.roomCode}</h2>
        <p className={styles.description}>
          This lobby keeps the same room and players together across rounds, so
          you can finish a battle, reset the round, and pick fresh dictionary
          words without leaving the room.
        </p>

        <div className={styles.metaRow}>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>You are</span>
            <strong>{playerName}</strong>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Status</span>
            <strong>{getPhaseLabel(lobbyState.phase, isMatchFinished)}</strong>
          </div>
        </div>

        <div className={styles.playerGrid}>
          <PlayerSlot
            label="Player One"
            name={playerOne.name}
            status={getPlayerStatus(playerOne)}
          />
          <PlayerSlot
            label="Player Two"
            name={playerTwo.name}
            status={getPlayerStatus(playerTwo)}
          />
        </div>

        <div className={styles.preMatchPanel}>
          <div className={styles.panelCopy}>
            <p className={styles.panelKicker}>{isMatchFinished ? 'Round Complete' : 'Pre-Match Flow'}</p>
            <h3 className={styles.panelHeading}>
              {isMatchFinished
                ? 'Reset the room for another round with the same opponent.'
                : 'Ready up before secret-word entry unlocks.'}
            </h3>
            <p className={styles.panelDescription}>
              {isMatchFinished
                ? 'Starting the next round creates a fresh match, clears both ready states, and unlocks secret-word selection again.'
                : 'Ready state, word-lock state, and secret-word validation now flow through Supabase-backed round state.'}
            </p>
          </div>

          <div className={styles.actionRow}>
            {isMatchFinished ? (
              <button
                className={styles.primaryAction}
                type="button"
                onClick={() => void startNextRound()}
                disabled={isSaving}
              >
                {isSaving ? 'Resetting...' : 'Start Next Round'}
              </button>
            ) : (
              <button
                className={styles.primaryAction}
                type="button"
                onClick={() => void toggleReady()}
                disabled={isSaving}
              >
                {playerOne.isYou || playerTwo.isYou
                  ? isSaving
                    ? 'Saving...'
                    : getReadyButtonLabel(lobbyState.phase, playerOne.isYou ? playerOne.ready : playerTwo.ready)
                  : 'Toggle Ready'}
              </button>
            )}
            <Link className={styles.secondaryAction} to="/">
              Back to Landing
            </Link>
          </div>
        </div>

        {!isMatchFinished && (lobbyState.phase === 'word_entry' || lobbyState.phase === 'locked_in') ? (
          <SecretWordForm
            secretWord={lobbyState.secretWord}
            error={errors.secretWord}
            isLocked={playerOne.isYou ? playerOne.wordLocked : playerTwo.wordLocked}
            isSaving={isSaving}
            onChange={handleSecretWordChange}
            onLock={() => void lockSecretWord()}
          />
        ) : null}

        {room.status === 'in_match' ? (
          <div className={styles.actionRow}>
            <button className={styles.tertiaryAction} type="button" onClick={() => navigate(`/match/${room.code}`)}>
              Enter Match
            </button>
          </div>
        ) : null}
      </div>

      <div className={styles.sideCard}>
        <h3 className={styles.sideHeading}>What this proves</h3>
        <ul className={styles.checklist}>
          <li>Room membership is live from Supabase</li>
          <li>Ready state persists across tabs</li>
          <li>Secret words are checked against the shared dictionary</li>
          <li>Word locks reset cleanly between rounds</li>
          <li>Replay uses a fresh match row without creating a new room</li>
        </ul>
      </div>
    </section>
  );
}

function getPlayerStatus(player: {
  connected: boolean;
  ready: boolean;
  wordLocked: boolean;
}) {
  if (!player.connected) {
    return 'Open Slot';
  }

  if (player.wordLocked) {
    return 'Word Locked';
  }

  if (player.ready) {
    return 'Ready';
  }

  return 'Connected';
}

function getPhaseLabel(phase: 'waiting' | 'ready_check' | 'word_entry' | 'locked_in', isMatchFinished: boolean) {
  if (isMatchFinished) {
    return 'Round complete';
  }

  switch (phase) {
    case 'waiting':
      return 'Waiting for a second player';
    case 'ready_check':
      return 'Ready check in progress';
    case 'word_entry':
      return 'Entering secret words';
    case 'locked_in':
      return 'Both players locked in';
    default:
      return 'Lobby';
  }
}

function getReadyButtonLabel(phase: 'waiting' | 'ready_check' | 'word_entry' | 'locked_in', isReady: boolean) {
  if (phase === 'word_entry' || phase === 'locked_in') {
    return isReady ? 'Ready Confirmed' : 'Set Ready';
  }

  return isReady ? 'Cancel Ready' : 'Ready Up';
}
