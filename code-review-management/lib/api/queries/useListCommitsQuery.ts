import { useCallback } from "react";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { CommitV2 } from "@/types/github.types.wrapper";

/**
 * Fetches the list of commits associated with a GitHub pull request. Supports
 * pagination.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @param branch: Feature branch of the pull request.
 * @param enabled: Optional flag to disable the query from automatically running
 *                 if set to false.
 * @returns: TanStack query result containing the list of pull request commits.
 */
export function useListCommitsQuery(
  owner: string,
  repo: string,
  pullNumber: string,
  branch: string,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: ["list-commits", owner, repo, pullNumber],
    queryFn: async ({ pageParam }): Promise<CommitV2> =>
      fetcher(
        `/api/v2/${owner}/${repo}/pulls/${pullNumber}/commits?page=${pageParam}&branch=${branch}?all=true`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    select: useCallback((data: InfiniteData<CommitV2, number>) => {
      return data.pages.flatMap((page) => page.data).reverse();
    }, []),
    enabled,
  });
}
