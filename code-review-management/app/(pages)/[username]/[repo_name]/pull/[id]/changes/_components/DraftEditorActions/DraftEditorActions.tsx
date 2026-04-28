import { useParams } from "next/navigation";
import { DraftReplyItem } from "../../_hooks/useDraftReplies";
import { DraftThreadItem } from "../../_hooks/useDraftThreads";
import { useSubmitDraftItem } from "../../_hooks/useSubmitDraftItem";
import { useMarkdownEditorContext } from "@components/MarkdownEditor/MarkdownEditorContext";
import { PullParams } from "@/types/routing.types";
import EditorSubmitButton from "@/app/(pages)/_components/EditorSubmitButton/EditorSubmitButton";

export type DraftItem =
  | { type: "thread"; payload: DraftThreadItem }
  | { type: "reply"; payload: DraftReplyItem };

/**
 * Renders the action buttons for a draft thread or reply. Displays `EditorSubmitButton`
 * which submits the current draft. The button is disabled when the editor
 * content is empty, contains only whitespace, or when the pull request data is
 * still pending.
 *
 * @param draft: `DraftItem` object containing data about the draft thread or reply.
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
    <EditorSubmitButton
      isSubmitPending={isSubmitPending}
      isDisabled={isDisabled}
      handleSubmit={handleSubmit}
    />
  );
}
