import { PullParams } from "@/types/routing.types";
import { useParams } from "next/navigation";
import { useSubmitDiscussionItem } from "../../_hooks/useSubmitDiscussionItem";
import EditorSubmitButton from "@/app/(pages)/_components/EditorSubmitButton/EditorSubmitButton";

export default function DiscussionEditorActions({
  editorContent,
}: {
  editorContent: string;
}) {
  const { username, repo_name, id } = useParams<PullParams>();
  const { handleSubmit, isSubmitPending, isPullPending } =
    useSubmitDiscussionItem(editorContent, username, repo_name, id);

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
