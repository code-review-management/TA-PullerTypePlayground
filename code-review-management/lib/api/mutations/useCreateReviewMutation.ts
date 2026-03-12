import { Dispatch, SetStateAction } from "react";
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
 * @param setReviewBody: State setter for review body, declared in ReviewContext.
 * @param setReviewType: State setter for review type, declared in ReviewContext.
 * @returns: TanStack query result containing the review result.
 */
export function useCreateReviewMutation(
  owner: string,
  repo: string,
  pullNumber: string,
  setReviewBody: Dispatch<SetStateAction<string>>,
  setReviewType: Dispatch<SetStateAction<CreateReviewRequest["event"]>>,
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

      // Reset review context.
      setReviewType("COMMENT");
      setReviewBody("");
    },
    onError: () => {
      toast.error("Failed to submit review.");
    },
  });
}
