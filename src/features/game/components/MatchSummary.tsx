import styles from './MatchSummary.module.css';

type MatchSummaryProps = {
  roomCode: string;
  yourName: string;
  opponentName: string;
  timerSeconds: number;
  maskedWord: string;
};

export function MatchSummary({
  roomCode,
  yourName,
  opponentName,
  timerSeconds,
  maskedWord,
}: MatchSummaryProps) {
  return (
    <section className={styles.card}>
      <div className={styles.topRow}>
        <div>
          <p className={styles.kicker}>Mock Match</p>
          <h2 className={styles.heading}>Room {roomCode}</h2>
        </div>
        <div className={styles.timerPill}>00:{timerSeconds.toString().padStart(2, '0')}</div>
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaBlock}>
          <span className={styles.label}>You</span>
          <strong>{yourName}</strong>
        </div>
        <div className={styles.metaBlock}>
          <span className={styles.label}>Opponent</span>
          <strong>{opponentName}</strong>
        </div>
        <div className={styles.metaBlock}>
          <span className={styles.label}>Hidden Word</span>
          <strong>{maskedWord}</strong>
        </div>
      </div>
    </section>
  );
}
