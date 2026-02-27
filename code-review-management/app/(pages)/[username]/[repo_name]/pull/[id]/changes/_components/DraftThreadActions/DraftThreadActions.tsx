import Image from "next/image";
import ArrowUpIcon from "@/public/icons/arrow_up.svg";
import { useParams } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";
import { DraftThreadItem } from "../../_hooks/useDraftThreads";
import { useSubmitDraftThread } from "../../_hooks/useSubmitDraftThread";
import { useMarkdownEditorContext } from "@components/MarkdownEditor/MarkdownEditorContext";
import { PullParams } from "@/types/routing.types";
import styles from "./DraftThreadActions.module.css";

/**
 * Renders the action buttons for a draft comment thread. Displays a publish
 * button that submits the current draft. The button is disabled when the editor
 * content is empty or contains only whitespace.
 *
 * @param draft: `DraftThreadItem` object containing data about the draft thread.
 */
export default function DraftCommentActions({
  draft,
}: {
  draft: DraftThreadItem;
}) {
  const { username, repo_name, id } = useParams<PullParams>();
  const { editorContent } = useMarkdownEditorContext();
  const { handleSubmit, isSubmitPending } = useSubmitDraftThread(
    draft,
    username,
    repo_name,
    id,
  );
  const isDraftBlank = editorContent.trim().length === 0;

  return (
    <>
      {isSubmitPending ? (
        // TODO: Use global color.
        <RotatingLines height={20} width={20} color={"grey"} />
      ) : (
        <button
          className={`${styles.submit} ${isDraftBlank ? styles.disabled : ""}`}
          disabled={isDraftBlank}
          onClick={handleSubmit}
        >
          <Image src={ArrowUpIcon} alt="Arrow up" />
        </button>
      )}
    </>
  );
}
