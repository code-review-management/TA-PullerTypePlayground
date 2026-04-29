import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";
import { PullRequestV2 } from "@/types/github.types.wrapper";
import {
  getAllTabFiltersMapped,
} from "@/app/(pages)/dashboard/_utils/filter-utils";
import { PullRequest } from "@/types/github.types";

/**
 * Fetches list of pull requests relevant to the requesting user.
 *
 * @param queryType:
 * @returns: TanStack query result containing the pull request data.
 */
export function usePullsQuery(filterString?: string) {
  return useInfiniteQuery({
    queryKey: ["pulls", filterString],
    queryFn: async ({ pageParam }): Promise<PullRequestV2> =>
      fetcher(
        `/api/v2/pulls?page=${pageParam}${filterString ? "&" + filterString : ""}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    getPreviousPageParam: (firstPage) => firstPage.prev,
  });
}

export function usePullsQueries(): Map<string, UseInfiniteQueryResult<InfiniteData<PullRequest>>> {
  const filters = getAllTabFiltersMapped();
  const pullsQueries = new Map();
  pullsQueries.set("all", usePullsQuery());
  pullsQueries.set(
    "ready_for_review",
    usePullsQuery(filters.get("ready_for_review").filter_string),
  );
  pullsQueries.set(
    "needs_your_review",
    usePullsQuery(filters.get("needs_your_review").filter_string),
  );
  pullsQueries.set(
    "authored",
    usePullsQuery(filters.get("authored").filter_string),
  );
  pullsQueries.set(
    "draft",
    usePullsQuery(filters.get("draft").filter_string),
  );

  return pullsQueries;
}
