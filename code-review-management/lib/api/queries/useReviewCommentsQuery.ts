import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { Comment } from "@/types/github.types";
import { CommentV2 } from "@/types/github.types.wrapper";
import { PublishedThreads } from "@/app/(pages)/[username]/[repo_name]/pull/[id]/changes/_hooks/usePublishedThreads";
import { useCallback } from "react";

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
export function useReviewCommentsQuery(
  owner: string,
  repo: string,
  pullNumber: string,
  select: (comments: Comment[]) => PublishedThreads,
) {
  return useInfiniteQuery({
    queryKey: ["review-comments", owner, repo, pullNumber],
    queryFn: async ({ pageParam }): Promise<CommentV2> =>
      fetcher(
        `/api/v2/${owner}/${repo}/pulls/${pullNumber}/comments?page=${pageParam}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    // Use `useCallback` to avoid running this `select` function on every render.
    // Docs: https://tanstack.com/query/v5/docs/framework/react/guides/render-optimizations#memoization
    select: useCallback(
      (data: InfiniteData<CommentV2, number>) => {
        // To reformat data, pass all pages of comments to
        // `buildCommentRelations` declared in `usePublishedThreads` hook.
        return select(data.pages.flatMap((page) => page.data));
      },
      [select],
    ),
  });
}
