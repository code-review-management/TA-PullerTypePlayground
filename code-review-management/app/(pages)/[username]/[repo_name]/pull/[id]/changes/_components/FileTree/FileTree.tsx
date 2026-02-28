import styles from "./FileTree.module.css";

export default function FileTree() {
  return (
    <div className={styles.tree}>
      {/* https://stackoverflow.com/a/66389669 */}
      {Array.from({ length: 100 }).map((_, index) => (
        <div key={index}>Test</div>
      ))}
    </div>
  );
}
