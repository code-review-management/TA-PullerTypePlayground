import styles from "./FileTreeDividers.module.css";

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
          key={idx}
          className={styles.divider}
          style={{
            left: idx * indentPadding + basePadding,
          }}
        />
      ))}
    </>
  );
}
