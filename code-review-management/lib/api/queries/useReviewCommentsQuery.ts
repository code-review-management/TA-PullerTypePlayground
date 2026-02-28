import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { Comment } from "@/types/github.types";

/**
 * Fetches the review comments made on the diffs of a GitHub pull request.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @returns: TanStack query result containing the list of review comments.
 */
export function useReviewCommentsQuery(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  return useQuery({
    queryKey: ["review-comments", owner, repo, pullNumber],
    queryFn: async (): Promise<Comment[]> =>
      fetcher(`/api/v1/${owner}/${repo}/pulls/${pullNumber}/comments`),
  });
}
