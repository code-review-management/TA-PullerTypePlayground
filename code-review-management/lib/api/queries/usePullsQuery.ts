import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";
// import { PullRequest } from "@/types/github.types";
import { PullRequestV2 } from "@/types/github.types.wrapper";

/**
 * Fetches a GitHub pull request.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @returns: TanStack query result containing the pull request data.
 */
export function usePullsQuery(queryType: "open" | "draft" | "merged" = "open") {

  return useInfiniteQuery({
    queryKey: ["pulls"],
    queryFn: ({ pageParam }): Promise<PullRequestV2> =>
      fetcher(`/api/v2/pulls?page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    getPreviousPageParam: (firstPage) => firstPage.prev,
  });
}
