import { useCreateDiscussionCommentMutation } from "@/lib/api/mutations/useCreateDiscussionCommentMutation";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";

export function useSubmitDiscussionItem(
  editorContent: string,
  owner: string,
  repo: string,
  pullNumber: string,
  onSuccess: () => void,
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

    mutate(
      {
        body: editorContent,
      },
      { onSuccess },
    );
  };

  return {
    handleSubmit,
    isSubmitPending,
    isSubmitError,
    isPullPending,
    isPullError,
  };
}
