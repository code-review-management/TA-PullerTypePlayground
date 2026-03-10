import sharedStyles from "../EditorContainer/EditorContainer.module.css";

export default function PlainEditor({
  isSingleLine,
}: {
  isSingleLine?: boolean;
}) {
  if (isSingleLine) {
    return <input type="text" className={sharedStyles.editable} />;
  } else {
    return <textarea className={sharedStyles.editable} />;
  }
}
