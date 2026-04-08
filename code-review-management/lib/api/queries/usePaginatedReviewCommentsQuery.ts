import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { Comment } from "@/types/github.types";
import { CommentV2 } from "@/types/github.types.wrapper";

/**
 * Fetches the review comments made on the diffs of a GitHub pull request.
 * Supports pagination.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @param select: Function that transforms the data returned.
 * @returns: TanStack query result containing the paginated list of review
 *           comments.
 */
export function usePaginatedReviewCommentsQuery(
  owner: string,
  repo: string,
  pullNumber: string,
  select?: (comments: Comment[]) => void,
) {
  return useInfiniteQuery({
    queryKey: ["review-comments", owner, repo, pullNumber],
    queryFn: async ({ pageParam }): Promise<CommentV2> =>
      fetcher(
        `/api/v2/${owner}/${repo}/pulls/${pullNumber}/comments?page=${pageParam}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });
}
