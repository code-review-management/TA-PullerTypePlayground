import { useMutation, useQueryClient } from "@tanstack/react-query";
import { poster } from "../utils/poster";
import { PRMergeRequest } from "@/types/request.types";
import toast from "react-hot-toast";

/**
 * Merges a GitHub pull request.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @returns: TanStack query result containing the merge result.
 */
export function useMergeMutation(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["merge", owner, repo, pullNumber],
    mutationFn: async (mergeRequest: PRMergeRequest) =>
      poster(
        `/api/v1/${owner}/${repo}/pulls/${pullNumber}/merge`,
        JSON.stringify(mergeRequest),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pull", owner, repo, pullNumber],
      });
      toast.success("Pull request successfully merged.");
    },
    onError: () => {
      toast.error("Failed to merge pull request.");
    },
  });
}
