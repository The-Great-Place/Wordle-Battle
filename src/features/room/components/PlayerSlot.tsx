import styles from './PlayerSlot.module.css';

type PlayerSlotProps = {
  label: string;
  name: string;
  status: string;
};

export function PlayerSlot({ label, name, status }: PlayerSlotProps) {
  return (
    <article className={styles.playerSlot}>
      <span className={styles.slotLabel}>{label}</span>
      <strong className={styles.slotName}>{name}</strong>
      <span className={styles.slotStatus}>{status}</span>
    </article>
  );
}
