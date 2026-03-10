import styles from "../EditorContainer/EditorContainer.module.css";

export default function PlainEditor({
  isSingleLine,
}: {
  isSingleLine?: boolean;
}) {
  if (isSingleLine) {
    return <input type="text" className={styles.editable} />;
  } else {
    return <textarea className={styles.editable} />;
  }
}
