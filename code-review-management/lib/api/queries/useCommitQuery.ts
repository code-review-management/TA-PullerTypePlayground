import { useCallback } from "react";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { CommitV2 } from "@/types/github.types.wrapper";

/**
 * Fetches a commit in a GitHub repository.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param ref: SHA or branch.
 * @param enabled: Optional flag to disable the query from automatically running
 *                 if set to false.
 * @returns: TanStack query result containing the commit.
 */
export function useCommitQuery(
  owner: string,
  repo: string,
  ref: string,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: ["commit", owner, repo, ref],
    queryFn: async ({ pageParam }): Promise<CommitV2> =>
      fetcher(`/api/v2/${owner}/${repo}/commit/${ref}?page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    select: useCallback(
      (data: InfiniteData<CommitV2, number>) => ({
        // API returns an array containing only 1 commit (hence `.data[0]`).
        // Spread out commit metadata since that is the same across pages.
        ...data.pages[0].data[0],
        // Combine files across all pages.
        files: data.pages.flatMap((page) => page.data[0].files ?? []),
      }),
      [],
    ),
    enabled,
  });
}
