import { PullParams } from "@/types/routing.types";
import { useParams } from "next/navigation";
import { useSubmitDiscussionItem } from "../../_hooks/useSubmitDiscussionItem";
import EditorSubmitButton from "@/app/(pages)/_components/EditorSubmitButton/EditorSubmitButton";

/**
 * Renders the action buttons for a discussion comment. Displays a publish
 * button that submits the current discussion comment. The button is disabled when the editor
 * content is empty, contains only whitespace, or when the pull request data is
 * still pending.
 *
 * @param draft: `DraftItem` object containing data about the draft thread or reply.
 */
export default function DiscussionEditorActions({
  editorContent,
  onSuccess,
}: {
  editorContent: string;
  onSuccess: () => void;
}) {
  const { username, repo_name, id } = useParams<PullParams>();
  const { handleSubmit, isSubmitPending, isPullPending } =
    useSubmitDiscussionItem(editorContent, username, repo_name, id, onSuccess);

  const isEditorBlank = editorContent.trim().length === 0;
  const isDisabled = isEditorBlank || isPullPending;
  // TODO: Display toast error message on submit or pulls error.

  return (
    <EditorSubmitButton
      isSubmitPending={isSubmitPending}
      isDisabled={isDisabled}
      handleSubmit={handleSubmit}
    />
  );
}
