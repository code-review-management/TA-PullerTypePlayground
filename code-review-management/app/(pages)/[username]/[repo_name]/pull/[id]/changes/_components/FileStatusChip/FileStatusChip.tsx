import styles from "./FileStatusChip.module.css";

const COLOR_CLASSES: Record<string, string> = {
  added: styles.added,
  modified: styles.modified,
  removed: styles.removed,
  renamed: styles.renamed,
};

// TODO: Handle other types of status
export default function FileStatusChip({ status }: { status: string }) {
  const colorClass = COLOR_CLASSES[status];

  return (
    <div className={`${styles.fileStatusChip} ${colorClass}`}>
      <p>{status}</p>
    </div>
  );
}
