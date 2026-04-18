import { useCallback } from "react";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { CommitV2 } from "@/types/github.types.wrapper";

/**
 * Fetches the commits in a GitHub pull request. Supports pagination.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @param branch: Feature branch of the pull request.
 * @returns: TanStack query result containing the list of pull request commits.
 */
export function useListCommitsQuery(
  owner: string,
  repo: string,
  pullNumber: string,
  branch: string,
) {
  return useInfiniteQuery({
    queryKey: ["list-commits", owner, repo, pullNumber],
    queryFn: async ({ pageParam }): Promise<CommitV2> =>
      fetcher(
        `/api/v2/${owner}/${repo}/pulls/${pullNumber}/commits?page=${pageParam}?branch=${branch}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    select: useCallback((data: InfiniteData<CommitV2, number>) => {
      data.pages.flatMap((page) => page.data);
    }, []),
  });
}
