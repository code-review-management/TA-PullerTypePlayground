import { useMutation } from "@tanstack/react-query";
import { poster } from "../utils/poster";
import { Comment } from "@/types/github.types";

export function useCreateReviewCommentMutation(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  return useMutation({
    mutationFn: async (comment: Comment) =>
      poster(
        `/api/v1/${owner}/${repo}/pulls/${pullNumber}/comments`,
        JSON.stringify(comment),
      ),
  });
}
