import { MockBoardRow } from '../types';
import styles from './BoardPreview.module.css';

type BoardPreviewProps = {
  title: string;
  subtitle: string;
  rows: MockBoardRow[];
  currentGuess?: string;
  maxRows?: number;
};

export function BoardPreview({
  title,
  subtitle,
  rows,
  currentGuess,
  maxRows = 6,
}: BoardPreviewProps) {
  const displayRows = [...rows];

  if (currentGuess) {
    displayRows.push({
      word: currentGuess.padEnd(5, ' '),
      result: ['absent', 'absent', 'absent', 'absent', 'absent'],
    });
  }

  while (displayRows.length < maxRows) {
    displayRows.push({
      word: '     ',
      result: ['absent', 'absent', 'absent', 'absent', 'absent'],
    });
  }

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>{subtitle}</p>
          <h3 className={styles.title}>{title}</h3>
        </div>
      </div>

      <div className={styles.grid}>
        {displayRows.slice(0, maxRows).map((row, rowIndex) => (
          <div key={`${row.word}-${rowIndex}`} className={styles.row}>
            {row.word.split('').map((letter, letterIndex) => (
              <div
                key={`${row.word}-${letterIndex}`}
                className={`${styles.tile} ${styles[row.result[letterIndex]]}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
