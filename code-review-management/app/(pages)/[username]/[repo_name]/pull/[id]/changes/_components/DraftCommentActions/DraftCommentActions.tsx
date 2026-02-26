import Image from "next/image";
import ArrowUpIcon from "@/public/icons/arrow_up.svg";
import styles from "./DraftCommentActions.module.css";
import { useMarkdownEditorContext } from "@components/MarkdownEditor/MarkdownEditorContext";

export default function DraftCommentActions() {
  const { getMarkdown, setEditable } = useMarkdownEditorContext();

  const handlePublish = () => {
    console.log(getMarkdown());
    setEditable(false);
  }
  return (
    <button className={styles.publish} onClick={handlePublish}>
      <Image src={ArrowUpIcon} alt="Arrow up" />
    </button>
  );
}
