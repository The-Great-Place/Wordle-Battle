import styles from './GuessComposer.module.css';

type GuessComposerProps = {
  currentGuess: string;
  statusMessage: string;
  canSubmit: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function GuessComposer({
  currentGuess,
  statusMessage,
  canSubmit,
  onChange,
  onSubmit,
}: GuessComposerProps) {
  return (
    <section className={styles.card}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Your Turn</p>
        <h3 className={styles.heading}>Build the next guess.</h3>
      </div>

      <div className={styles.controls}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter 5 letters"
          value={currentGuess}
          onChange={(event) => onChange(event.target.value)}
        />
        <button className={styles.action} type="button" onClick={onSubmit} disabled={!canSubmit}>
          Submit Guess
        </button>
      </div>

      <p className={styles.helpText}>{statusMessage}</p>
    </section>
  );
}
