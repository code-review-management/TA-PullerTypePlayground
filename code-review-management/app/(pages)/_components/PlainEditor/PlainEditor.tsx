import styles from "./PlainEditor.module.css";

export default function PlainEditor({
  name,
  defaultValue,
  onChange,
  isSingleLine,
}: {
  name: string;
  defaultValue?: string;
  onChange?: (body: string) => void;
  isSingleLine?: boolean;
}) {
  if (isSingleLine) {
    return (
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={styles.editable}
      />
    );
  } else {
    return (
      <textarea
        name={name}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={styles.editable}
      />
    );
  }
}
