import Image from "next/image";
import ArrowUpIcon from "@/public/icons/arrow_up.svg";
import styles from "./DraftCommentActions.module.css";
import { useMarkdownEditorContext } from "@components/MarkdownEditor/MarkdownEditorContext";

/**
 * Renders the action buttons for a draft comment thread. Displays a publish
 * button that submits the current draft. The button is disabled when the editor
 * content is empty or contains only whitespace.
 */
export default function DraftCommentActions() {
  const { editorContent, setEditable } = useMarkdownEditorContext();

  const handlePublish = () => {
    console.log(editorContent);
    setEditable(false);
  };

  const isDraftBlank = editorContent.trim().length === 0;

  return (
    <button
      className={`${styles.publish} ${isDraftBlank ? styles.disabled : ""}`}
      disabled={isDraftBlank}
      onClick={handlePublish}
    >
      <Image src={ArrowUpIcon} alt="Arrow up" />
    </button>
  );
}
