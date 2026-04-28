import { useMutation, useQueryClient } from "@tanstack/react-query";
import { poster } from "../utils/poster";
import { SuggestionCommentUpdateRequest, SuggestionCommitRequest } from "@/types/request.types";
import toast from "react-hot-toast";

/**
 * commits a gemini comment.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @returns: TanStack query result containing the merge result.
 */
export function useCommitGeminiSuggestionMutation(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["commit-suggest", owner, repo, pullNumber],
    mutationFn: async (suggestionData: SuggestionCommitRequest) =>
      poster(
        `/api/v1/${owner}/${repo}/pulls/${pullNumber}/suggest/commit`,
        JSON.stringify(suggestionData),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["review-comments", owner, repo, pullNumber],
      });
      toast.success("Suggestion successfully commited!.");
    },
    onError: () => {
      toast.error("Failed to commit suggestion.");
    },
  });
}