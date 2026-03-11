import styles from "./PlainEditor.module.css";

/**
 * A plain editor with no Markdown rendering. Used for forms.
 *
 * @param name: Name attribute for the input element.
 * @param value: Content of the editor.
 * @param onChange: Callback fired when the editor input changes.
 * @param isSingleLine: If true, renders a single-inline input instead of a textarea.
 */
export default function PlainEditor({
  name,
  value,
  onChange,
  isSingleLine,
}: {
  name: string;
  value: string;
  onChange: (body: string) => void;
  isSingleLine?: boolean;
}) {
  if (isSingleLine) {
    return (
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        className={styles.editable}
      />
    );
  } else {
    return (
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.editable}
      />
    );
  }
}
