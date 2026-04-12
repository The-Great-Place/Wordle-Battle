import { Link, useNavigate, useParams } from 'react-router-dom';

import { persistMockMatchSession } from '../../features/game/mockMatchSession';
import { PlayerSlot } from '../../features/room/components/PlayerSlot';
import { SecretWordForm } from '../../features/room/components/SecretWordForm';
import { useMockLobby } from '../../features/room/hooks/useMockLobby';
import styles from './RoomLobbyPage.module.css';

export function RoomLobbyPage() {
  const navigate = useNavigate();
  const { roomCode = '' } = useParams();
  const { lobbyState, playerName, errors, toggleReady, handleSecretWordChange, lockSecretWord } =
    useMockLobby(roomCode);
  const { playerOne, playerTwo } = lobbyState.players;

  function handleStartMatch() {
    const you = playerOne.isYou ? playerOne : playerTwo;
    const opponent = playerOne.isYou ? playerTwo : playerOne;

    persistMockMatchSession({
      roomCode: lobbyState.roomCode,
      yourName: you.name,
      opponentName: opponent.name,
      yourSecretWord: lobbyState.secretWord,
      opponentSecretWord: 'GHOST',
      yourBoard: [
        { word: 'SLATE', result: ['absent', 'present', 'absent', 'correct', 'absent'] },
        { word: 'CRANE', result: ['present', 'correct', 'absent', 'absent', 'absent'] },
      ],
      opponentBoard: [
        { word: 'BOUND', result: ['absent', 'absent', 'present', 'absent', 'absent'] },
        { word: 'TRAIL', result: ['present', 'absent', 'absent', 'correct', 'absent'] },
      ],
    });

    navigate(`/match/${lobbyState.roomCode}`);
  }

  return (
    <section className={styles.layout}>
      <div className={styles.primaryCard}>
        <p className={styles.kicker}>Mock Lobby</p>
        <h2 className={styles.heading}>Room {lobbyState.roomCode}</h2>
        <p className={styles.description}>
          This mock lobby now includes the pre-match loop: players connect,
          ready up, and lock in a secret word before the duel starts.
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
              In the real build, this state will be shared live between both
              players. For now, join-mode simulates a connected opponent so we
              can shape the full lobby sequence.
            </p>
          </div>

          <div className={styles.actionRow}>
            <button className={styles.primaryAction} type="button" onClick={toggleReady}>
              {playerOne.isYou || playerTwo.isYou
                ? getReadyButtonLabel(lobbyState.phase, playerOne.isYou ? playerOne.ready : playerTwo.ready)
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
            onChange={handleSecretWordChange}
            onLock={lockSecretWord}
          />
        ) : null}

        <div className={styles.actionRow}>
          <button
            className={styles.tertiaryAction}
            type="button"
            disabled={lobbyState.phase !== 'locked_in'}
            onClick={handleStartMatch}
          >
            Mock Start Match
          </button>
        </div>
      </div>

      <div className={styles.sideCard}>
        <h3 className={styles.sideHeading}>What this proves</h3>
        <ul className={styles.checklist}>
          <li>The lobby has a real pre-match sequence now</li>
          <li>Ready state gates secret-word entry</li>
          <li>Secret-word entry has local validation and lock-in</li>
          <li>The mock flow now mirrors the future Supabase room lifecycle</li>
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
