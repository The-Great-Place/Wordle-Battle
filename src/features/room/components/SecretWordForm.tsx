import styles from './SecretWordForm.module.css';

type SecretWordFormProps = {
  secretWord: string;
  error?: string;
  isLocked: boolean;
  isSaving?: boolean;
  onChange: (value: string) => void;
  onLock: () => void;
};

export function SecretWordForm({
  secretWord,
  error,
  isLocked,
  isSaving = false,
  onChange,
  onLock,
}: SecretWordFormProps) {
  return (
    <section className={styles.card}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Secret Word</p>
        <h3 className={styles.heading}>Lock in the word your opponent has to solve.</h3>
        <p className={styles.description}>
          Words are validated against the shared dictionary and stay frozen for
          the current round once you lock them in.
        </p>
      </div>

      <div className={styles.controls}>
        <input
          className={styles.input}
          type="text"
          value={secretWord}
          onChange={(event) => onChange(event.target.value)}
          disabled={isLocked || isSaving}
          placeholder="CRANE"
        />
        <button className={styles.action} type="button" onClick={onLock} disabled={isLocked || isSaving}>
          {isLocked ? 'Locked In' : isSaving ? 'Saving...' : 'Lock Secret Word'}
        </button>
      </div>

      <p className={styles.helpText}>
        {error
          ?? (isLocked
            ? 'Your secret word is locked for this round.'
            : 'Choose a valid five-letter dictionary word.')}
      </p>
    </section>
  );
}
