import styles from "./FileStatusChip.module.css";

const COLOR_CLASSES: Record<string, string> = {
  added: styles.added,
  modified: styles.modified,
  removed: styles.removed,
  renamed: styles.renamed,
};

export default function FileStatusChip({ status }: { status: string }) {
  const colorClass = COLOR_CLASSES[status] ?? styles.fallback;

  return (
    <div className={`${styles.fileStatusChip} ${colorClass}`}>
      <p>{status}</p>
    </div>
  );
}
