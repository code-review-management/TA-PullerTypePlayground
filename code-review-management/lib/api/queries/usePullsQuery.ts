import {
  InfiniteData,
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";
// import { PullRequest } from "@/types/github.types";
import { PullRequestV2 } from "@/types/github.types.wrapper";
import { useCallback } from "react";
import { PullRequest } from "@/types/github.types";

/**
 * Fetches a GitHub pull request.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @returns: TanStack query result containing the pull request data.
 */
export function usePullsQuery<T>(
  queryType?: "open" | "draft" | "merged",
) {
  return useInfiniteQuery({
    queryKey: ["pulls"],
    queryFn: async ({ pageParam }): Promise<PullRequestV2> =>
      fetcher(`/api/v2/pulls?page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    getPreviousPageParam: (firstPage) => firstPage.prev,
  });
}
