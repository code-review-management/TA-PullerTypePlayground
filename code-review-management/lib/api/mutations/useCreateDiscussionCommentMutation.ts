import { useMutation, useQueryClient } from "@tanstack/react-query";
import { poster } from "../utils/poster";
import { CreateIssueCommentRequest } from "@/types/request.types";
import toast from "react-hot-toast";

/**
 * Creates a new discussion comment on a GitHub pull request.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @returns: TanStack query result containing the newly created comment.
 */
export function useCreateDiscussionCommentMutation(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-discussion-comment"],
    mutationFn: async (comment: CreateIssueCommentRequest) =>
      poster(
        `/api/v1/${owner}/${repo}/issues/${pullNumber}/comment`,
        JSON.stringify(comment),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["timeline", owner, repo, pullNumber],
      });
    },
    onError: () => {
      toast.error("Failed to post discussion comment.");
    },
  });
}
