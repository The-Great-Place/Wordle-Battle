import { LetterState } from '../types';
import styles from './Keyboard.module.css';

const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
] as const;

type KeyboardProps = {
  keyStates: Record<string, LetterState>;
  onKeyPress: (key: string) => void;
};

export function Keyboard({ keyStates, onKeyPress }: KeyboardProps) {
  return (
    <section className={styles.card}>
      <p className={styles.kicker}>Keyboard</p>
      <div className={styles.rows}>
        {KEY_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((key) => (
              <button
                key={key}
                className={`${styles.key} ${keyStates[key] ? styles[keyStates[key]] : ''} ${key.length > 1 ? styles.wideKey : ''}`}
                type="button"
                onClick={() => onKeyPress(key)}
              >
                {key === 'BACKSPACE' ? 'Delete' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
