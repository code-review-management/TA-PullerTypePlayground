import styles from "./FileStatusChip.module.css";

const COLOR_CLASSES: Record<string, string> = {
  added: styles.added,
  modified: styles.modified,
  removed: styles.removed,
  renamed: styles.renamed,
};

/**
 * File status chip indicating whether the file has been added, modified,
 * removed, renamed, etc.
 *
 * @param status: Status of the file.
 */
export default function FileStatusChip({ status }: { status: string }) {
  const colorClass = COLOR_CLASSES[status] ?? styles.fallback;

  return (
    <div
      className={`${styles.fileStatusChip} ${colorClass}`}
      data-testid="file-status-chip"
    >
      <p>{status}</p>
    </div>
  );
}
