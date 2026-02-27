import Image from "next/image";
import ArrowUpIcon from "@/public/icons/arrow_up.svg";
import styles from "./DraftCommentActions.module.css";
import { useMarkdownEditorContext } from "@components/MarkdownEditor/MarkdownEditorContext";

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
