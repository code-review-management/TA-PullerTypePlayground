import styles from "./FileTreeDividers.module.css";

/**
 * Vertical dividers for a file tree row.
 * 
 * @param depth: How many levels deep the row is nested. One divider is rendered per level.
 * @param basePadding: Fixed left offset in px.
 * @param indentPadding: Additional left offset in px added per depth level.
 */
export default function FileTreeDividers({
  depth,
  basePadding,
  indentPadding,
}: {
  depth: number;
  basePadding: number;
  indentPadding: number;
}) {
  return (
    <>
      {/* Docs: https://stackoverflow.com/a/66389669 */}
      {Array.from({ length: depth }).map((_, idx) => (
        <span
          key={idx} // Use index as key since these dividers are static.
          className={styles.divider}
          style={{
            left: idx * indentPadding + basePadding,
          }}
        />
      ))}
    </>
  );
}
