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
  const { lobbyState, playerName, errors, isSaving, toggleReady, handleSecretWordChange, lockSecretWord } =
    useMockLobby({
      roomId: room?.id ?? null,
      roomCode,
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
          This lobby now reads real room membership from Supabase and keeps
          pre-match readiness and match handoff in sync across tabs.
        </p>

        <div className={styles.metaRow}>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>You are</span>
            <strong>{playerName}</strong>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Status</span>
            <strong>{getPhaseLabel(lobbyState.phase)}</strong>
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
            <p className={styles.panelKicker}>Pre-Match Flow</p>
            <h3 className={styles.panelHeading}>Ready up before secret-word entry unlocks.</h3>
            <p className={styles.panelDescription}>
              Ready state, word-lock state, and match creation now persist through
              Supabase. Secret word contents are submitted to the backend, while
              gameplay itself is still the next remaining mock boundary.
            </p>
          </div>

          <div className={styles.actionRow}>
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
            <Link className={styles.secondaryAction} to="/">
              Back to Landing
            </Link>
          </div>
        </div>

        {lobbyState.phase === 'word_entry' || lobbyState.phase === 'locked_in' ? (
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
          <li>Word lock state persists across tabs</li>
          <li>Match rows now begin in Supabase before the match screen opens</li>
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

function getPhaseLabel(phase: 'waiting' | 'ready_check' | 'word_entry' | 'locked_in') {
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
