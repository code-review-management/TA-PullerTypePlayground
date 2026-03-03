import Image from "next/image";
import ArrowUpIcon from "@/public/icons/arrow_up.svg";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import { useParams } from "next/navigation";
import { DraftReplyItem } from "../../_hooks/useDraftReplies";
import { DraftThreadItem } from "../../_hooks/useDraftThreads";
import { useSubmitDraftItem } from "../../_hooks/useSubmitDraftItem";
import { useMarkdownEditorContext } from "@components/MarkdownEditor/MarkdownEditorContext";
import { PullParams } from "@/types/routing.types";
import styles from "./DraftEditorActions.module.css";

export type DraftItem =
  | { type: "thread"; payload: DraftThreadItem }
  | { type: "reply"; payload: DraftReplyItem };

/**
 * Renders the action buttons for a draft comment thread. Displays a publish
 * button that submits the current draft. The button is disabled when the editor
 * content is empty, contains only whitespace, or when the pull request data is
 * still pending.
 *
 * @param draft: `DraftThreadItem` object containing data about the draft thread.
 */
export default function DraftEditorActions({ draft }: { draft: DraftItem }) {
  const { username, repo_name, id } = useParams<PullParams>();
  const { editorContent } = useMarkdownEditorContext();
  const { handleSubmit, isSubmitPending, isPullPending } = useSubmitDraftItem(
    draft,
    username,
    repo_name,
    id,
  );

  const isDraftBlank = editorContent.trim().length === 0;
  const isDisabled = isDraftBlank || isPullPending;
  // TODO: Display toast error message on submit or pulls error.

  return (
    <>
      {isSubmitPending ? (
        <LoadingSpinner />
      ) : (
        <button
          className={`${styles.submit} ${isDisabled ? styles.disabled : ""}`}
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          <Image src={ArrowUpIcon} alt="Arrow up" />
        </button>
      )}
    </>
  );
}
