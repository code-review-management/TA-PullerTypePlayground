import { useMutation, useQueryClient } from "@tanstack/react-query";
import { poster } from "../utils/poster";
import { CommentCreateRequest } from "@/types/request.types";

export function useCreateReviewCommentMutation(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: CommentCreateRequest) =>
      poster(
        `/api/v1/${owner}/${repo}/pulls/${pullNumber}/comments`,
        JSON.stringify(comment),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["review-comments", owner, repo, pullNumber],
      });
    },
  });
}
