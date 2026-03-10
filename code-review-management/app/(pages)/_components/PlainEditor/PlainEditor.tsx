import styles from "./PlainEditor.module.css";

export default function PlainEditor({
  isSingleLine,
}: {
  isSingleLine?: boolean;
}) {
  if (isSingleLine) {
    return <input type="text" className={styles.editor} />;
  } else {
    return <textarea className={styles.editor} />;
  }
}
