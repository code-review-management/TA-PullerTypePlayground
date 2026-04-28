import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";
import { RepoV2 } from "@/types/github.types.wrapper";
import { useCallback } from "react";

/**
 * Fetches list of repos relevant to the requesting user.
 *
 * @returns: TanStack query result containing the repo data.
 */
export function useReposQuery() {
  return useInfiniteQuery({
    queryKey: ["repos"],
    queryFn: async ({ pageParam }): Promise<RepoV2> =>
      fetcher(`/api/v2/repos?page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    getPreviousPageParam: (firstPage) => firstPage.prev,
    select: useCallback((data: InfiniteData<RepoV2, number>) => {
      return data.pages.flatMap((page) => page.data);
    }, []),
  });
}
