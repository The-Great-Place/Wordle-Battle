import { useRoomEntryForm } from '../../features/room/hooks/useRoomEntryForm';
import styles from './LandingPage.module.css';

export function LandingPage() {
  const {
    displayName,
    joinCode,
    errors,
    isSubmitting,
    handleCreateRoom,
    handleJoinRoom,
    handleNameChange,
    handleCodeChange,
  } = useRoomEntryForm();

  return (
    <section className={styles.layout}>
      <div className={styles.heroCard}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Phase 1 Mock Flow</p>
          <h2 className={styles.heading}>Race a friend to solve each other&apos;s hidden word.</h2>
          <p className={styles.description}>
            Wordle Battle turns the familiar puzzle into a fast two-player duel.
            Create a room, lock in a secret word, and watch both boards unfold
            side by side in real time.
          </p>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.label}>Display Name</span>
            <input
              className={styles.input}
              type="text"
              placeholder="Pick a quick name"
              value={displayName}
              onChange={(event) => handleNameChange(event.target.value)}
            />
            <span className={styles.helpText}>
              {errors.displayName ?? 'This is mock state for now, but the flow is real.'}
            </span>
          </label>

          <div className={styles.actions}>
            <button
              className={styles.primaryAction}
              type="button"
              onClick={handleCreateRoom}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Working...' : 'Create Room'}
            </button>
          </div>

          <form className={styles.joinCard} onSubmit={handleJoinRoom}>
            <label className={styles.field}>
              <span className={styles.label}>Room Code</span>
              <input
                className={styles.input}
                type="text"
                placeholder="ABC123"
                value={joinCode}
                onChange={(event) => handleCodeChange(event.target.value)}
              />
              <span className={styles.helpText}>
                {errors.joinCode ?? 'Use any 4-6 letter or number code in this mock flow.'}
              </span>
            </label>

            <button className={styles.secondaryAction} type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Working...' : 'Join With Code'}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <span>Your Board</span>
          <span>Opponent Board</span>
        </div>

        <div className={styles.boardRow}>
          <BoardPreview word="CRANE" result="mixed" />
          <BoardPreview word="SLATE" result="partial" />
        </div>

        <div className={styles.boardRow}>
          <BoardPreview word="BOUND" result="miss" />
          <BoardPreview word="TRAIL" result="mixed" />
        </div>

        <div className={styles.statusStrip}>
          <span>Room Code: `BATTLE`</span>
          <span>Timer: 00:22</span>
        </div>
      </div>
    </section>
  );
}

type BoardPreviewProps = {
  word: string;
  result: 'mixed' | 'partial' | 'miss';
};

function BoardPreview({ word, result }: BoardPreviewProps) {
  const states = getLetterStates(result);

  return (
    <div className={styles.board}>
      {word.split('').map((letter, index) => (
        <div
          key={`${word}-${index}`}
          className={`${styles.tile} ${styles[states[index]]}`}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}

function getLetterStates(result: BoardPreviewProps['result']) {
  switch (result) {
    case 'partial':
      return ['present', 'absent', 'correct', 'absent', 'present'] as const;
    case 'miss':
      return ['absent', 'absent', 'absent', 'absent', 'absent'] as const;
    case 'mixed':
    default:
      return ['correct', 'present', 'absent', 'correct', 'absent'] as const;
  }
}
