import { useCreateReviewCommentMutation } from "@/lib/api/mutations/useCreateReviewCommentMutation";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";
import { useMarkdownEditorContext } from "@components/MarkdownEditor/MarkdownEditorContext";
import { useDraftThreadsContext } from "../_contexts/DraftThreadsContext";
import { DraftThreadItem, getDraftThreadKey } from "./useDraftThreads";
import { toGitHubSide } from "../_utils/diff-utils";

export function useSubmitDraftThread(
  draft: DraftThreadItem,
  owner: string,
  repo: string,
  pullNumber: string,
) {
  const { setDraftThreads } = useDraftThreadsContext();
  const { editorContent } = useMarkdownEditorContext();
  const {
    data: pulls,
    isPending: isPullsPending,
    isError: isPullsError,
  } = usePullQuery(owner, repo, pullNumber);
  const {
    mutate,
    isPending: isSubmitPending,
    isError: isSubmitError,
  } = useCreateReviewCommentMutation(owner, repo, pullNumber);

  const handleSubmit = () => {
    // On pulls pending, button is already disabled. On pulls error, do not
    // allow submission. TODO: Display toast error message on pulls error.
    if (!pulls) return; 
    const side = toGitHubSide(draft.side);

    mutate(
      {
        body: editorContent,
        commit_id: pulls.head.sha,
        path: draft.filename,
        start_side: side,
        side,
        start_line: draft.start,
        line: draft.end,
      },
      {
        // Fires after invalidating the TanStack cache for review comments
        // and refetching them.
        onSuccess: () => {
          setDraftThreads((prev) => {
            const key = getDraftThreadKey(
              draft.filename,
              draft.end,
              draft.side,
            );
            const draftThreads = { ...prev };
            delete draftThreads[key];
            return draftThreads;
          });
        },
      },
    );
  };

  return {
    handleSubmit,
    isSubmitPending,
    isSubmitError,
    isPullsPending,
    isPullsError,
  };
}
