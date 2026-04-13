import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";
import { PullRequestV2 } from "@/types/github.types.wrapper";

/**
 * Fetches list of pull requests relevant to the requesting user.
 *
 * @param queryType:
 * @returns: TanStack query result containing the pull request data.
 */
export function usePullsQuery(queryType?: "open" | "draft" | "merged") {
  const queryTypeString = queryType ? `&${queryType}=true` : "";

  return useInfiniteQuery({
    queryKey: ["pulls"],
    queryFn: async ({ pageParam }): Promise<PullRequestV2> =>
      fetcher(`/api/v2/pulls?page=${pageParam}${queryTypeString}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    getPreviousPageParam: (firstPage) => firstPage.prev,
  });
}
