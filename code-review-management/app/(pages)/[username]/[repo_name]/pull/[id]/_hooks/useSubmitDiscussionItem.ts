import { useCreateDiscussionCommentMutation } from "@/lib/api/mutations/useCreateDiscussionCommentMutation";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";

export function useSubmitDiscussionItem(
  editorContent: string,
  owner: string,
  repo: string,
  pullNumber: string,
) {
  const {
    data: pull,
    isPending: isPullPending,
    isError: isPullError,
  } = usePullQuery(owner, repo, pullNumber);
  const {
    mutate,
    isPending: isSubmitPending,
    isError: isSubmitError,
  } = useCreateDiscussionCommentMutation(owner, repo, pullNumber);

  const handleSubmit = () => {
    // On pulls pending, button is already disabled. On pulls error, do not
    // allow submission.
    if (!pull) return;

    mutate({
      body: editorContent,
    });
  };

  return {
    handleSubmit,
    isSubmitPending,
    isSubmitError,
    isPullPending,
    isPullError,
  };
}
