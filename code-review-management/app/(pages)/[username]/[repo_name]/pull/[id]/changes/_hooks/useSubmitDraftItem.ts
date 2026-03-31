import { useCreateReviewCommentMutation } from "@/lib/api/mutations/useCreateReviewCommentMutation";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";
import { useMarkdownEditorContext } from "@components/MarkdownEditor/MarkdownEditorContext";
import { useDraftRepliesContext } from "../_contexts/DraftRepliesContext";
import { useDraftThreadsContext } from "../_contexts/DraftThreadsContext";
import { getDraftReplyKey } from "./useDraftReplies";
import { deleteDraftThread } from "../_utils/comment-utils";
import { toGitHubSide } from "../_utils/diff-utils";
import { DraftItem } from "../_components/DraftEditorActions/DraftEditorActions";
import { PullRequest } from "@/types/github.types";

export function useSubmitDraftItem(
  draft: DraftItem,
  owner: string,
  repo: string,
  pullNumber: string,
) {
  const { setDraftReplies } = useDraftRepliesContext();
  const { setDraftThreads } = useDraftThreadsContext();
  const { editorContent } = useMarkdownEditorContext();
  const {
    data: pull,
    isPending: isPullPending,
    isError: isPullError,
  } = usePullQuery(owner, repo, pullNumber);
  const {
    mutate,
    isPending: isSubmitPending,
    isError: isSubmitError,
  } = useCreateReviewCommentMutation(owner, repo, pullNumber, draft);

  const submitThread = (
    draft: Extract<DraftItem, { type: "thread" }>,
    pull: PullRequest,
  ) => {
    const side = toGitHubSide(draft.payload.side);
    mutate(
      {
        body: editorContent,
        commit_id: pull.head.sha,
        path: draft.payload.activePath,
        start_side: side,
        side,
        start_line: draft.payload.start,
        line: draft.payload.end,
      },
      {
        // Fires after invalidating the TanStack cache for review comments
        // and refetching them.
        onSuccess: () => deleteDraftThread(draft.payload, setDraftThreads),
      },
    );
  };

  const submitReply = (
    draft: Extract<DraftItem, { type: "reply" }>,
    pull: PullRequest,
  ) => {
    mutate(
      {
        body: editorContent,
        commit_id: pull.head.sha,
        path: draft.payload.filename,
        in_reply_to: draft.payload.parentId,
      },
      {
        onSuccess: () => {
          setDraftReplies((prev) => {
            const key = getDraftReplyKey(
              draft.payload.filename,
              draft.payload.parentId,
            );
            const draftReplies = { ...prev };
            delete draftReplies[key];
            return draftReplies;
          });
        },
      },
    );
  };

  const handleSubmit = () => {
    // On pulls pending, button is already disabled. On pulls error, do not
    // allow submission. TODO: Display toast error message on pulls error.
    if (!pull) return;
    if (draft.type === "thread") {
      submitThread(draft, pull);
    } else {
      submitReply(draft, pull);
    }
  };

  return {
    handleSubmit,
    isSubmitPending,
    isSubmitError,
    isPullPending,
    isPullError,
  };
}
