import { useMutation, useQueryClient } from "@tanstack/react-query";
import { poster } from "../utils/poster";
import { CreateReviewRequest } from "@/types/request.types";
import toast from "react-hot-toast";

/**
 * Creates a review for a GitHub pull request.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @returns: TanStack query result containing the review result.
 */
export function useCreateReviewMutation(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-review", owner, repo, pullNumber],
    mutationFn: async (review: CreateReviewRequest) =>
      poster(
        `/api/v1/${owner}/${repo}/pulls/${pullNumber}/reviews`,
        JSON.stringify(review),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pull", owner, repo, pullNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline", owner, repo, pullNumber],
      });
      toast.success("Review successfully created.");
    },
    onError: () => {
      toast.error("Failed to submit review.");
    },
  });
}
