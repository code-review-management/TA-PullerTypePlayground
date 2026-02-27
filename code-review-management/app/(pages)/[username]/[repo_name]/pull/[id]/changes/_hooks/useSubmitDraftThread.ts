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
  id: string,
) {
  const { setDraftThreads } = useDraftThreadsContext();
  const { editorContent } = useMarkdownEditorContext();
  const { data: pulls } = usePullQuery(owner, repo, id);
  const { mutate, isPending } = useCreateReviewCommentMutation(owner, repo, id);

  const handleSubmit = () => {
    if (!pulls) return; // TODO: Address this. Pending/error state?

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
        onSuccess: () => {
          setDraftThreads((prev) => {
            const key = getDraftThreadKey(
              draft.filename,
              draft.end,
              draft.side,
            );
            const updatedThreads = { ...prev };
            delete updatedThreads[key];
            return updatedThreads;
          });
        },
      },
    );
  };

  return { handleSubmit, isSubmitPending: isPending };
}
