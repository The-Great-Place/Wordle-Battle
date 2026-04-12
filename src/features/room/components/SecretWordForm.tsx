import styles from './SecretWordForm.module.css';

type SecretWordFormProps = {
  secretWord: string;
  error?: string;
  isLocked: boolean;
  onChange: (value: string) => void;
  onLock: () => void;
};

export function SecretWordForm({
  secretWord,
  error,
  isLocked,
  onChange,
  onLock,
}: SecretWordFormProps) {
  return (
    <section className={styles.card}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Secret Word</p>
        <h3 className={styles.heading}>Lock in the word your opponent has to solve.</h3>
        <p className={styles.description}>
          This is still mock state, but it models the exact step we&apos;ll later
          secure behind server-side validation.
        </p>
      </div>

      <div className={styles.controls}>
        <input
          className={styles.input}
          type="text"
          value={secretWord}
          onChange={(event) => onChange(event.target.value)}
          disabled={isLocked}
          placeholder="CRANE"
        />
        <button className={styles.action} type="button" onClick={onLock} disabled={isLocked}>
          {isLocked ? 'Locked In' : 'Lock Secret Word'}
        </button>
      </div>

      <p className={styles.helpText}>
        {error ?? (isLocked ? 'Your secret word is locked for this mock round.' : 'Five letters only for now.')}
      </p>
    </section>
  );
}
