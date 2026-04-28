import { useCallback } from "react";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { FileDiffV2 } from "@/types/github.types.wrapper";

/**
 * Fetches the files changed in a GitHub pull request. Supports pagination.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @param enabled: Optional flag to disable the query from automatically running
 *                 if set to false.
 * @returns: TanStack query result containing the files changed.
 */
export function useListFilesQuery(
  owner: string,
  repo: string,
  pullNumber: string,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: ["list-files", owner, repo, pullNumber],
    queryFn: async ({ pageParam }): Promise<FileDiffV2> =>
      fetcher(
        `/api/v2/${owner}/${repo}/pulls/${pullNumber}/list-files?page=${pageParam}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    select: useCallback((data: InfiniteData<FileDiffV2, number>) => {
      return data.pages.flatMap((page) => page.data);
    }, []),
    enabled,
  });
}
