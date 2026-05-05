import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";
import { PullRequestV2 } from "@/types/github.types.wrapper";
import {
  DashboardTabFilter,
  getAllFiltersMap,
} from "@/app/(pages)/dashboard/_utils/filter-utils";
import { Filter } from "@/app/(pages)/dashboard/_utils/filter-utils";

// Result of `usePullsQuery`
export type PullsQueryResult = UseInfiniteQueryResult<
  InfiniteData<PullRequestV2>
>;

/**
 * Fetches list of pull requests relevant to the requesting user. Supports pagination.
 *
 * @param queryType:
 * @returns: TanStack query result containing the pull request data.
 */
export function usePullsQuery(filterString?: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ["pulls", filterString],
    queryFn: async ({ pageParam }): Promise<PullRequestV2> =>
      fetcher(
        `/api/v2/pulls?page=${pageParam}${filterString ? "&" + filterString : ""}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    getPreviousPageParam: (firstPage) => firstPage.prev,
    enabled,
  });
}

/**
 * Uses usePullsQuery and saves results to a Map
 * mapping filter name to a `PullsQueryResult`.
 * Used on dashboard page to access queries for all tab filters.
 *
 * Adding to the return value of this function will add another tab filter on the page.
 * Make sure to check `app/(pages)/dashboard/_utils/filter-utils.ts` to ensure
 * relevant info for newly added tab filters is available before adding a tab filter here.
 *
 * @param activeTab The filter name of the tab that is currently selected.
 * @returns
 */
export function usePullsQueries(
  activeTab: Filter,
): Map<Filter, PullsQueryResult> {
  const filters = getAllFiltersMap();
  const getFilter = (tab: Filter): DashboardTabFilter => {
    const filter = filters.get(tab);
    if (!filter) {
      throw new Error(`Missing dashboard filter for tab: ${tab}`);
    }
    return filter;
  };

  return new Map<Filter, PullsQueryResult>([
    ["all", usePullsQuery(undefined, activeTab === "all")],
    [
      "requires_review",
      usePullsQuery(
        getFilter("requires_review").filter_string,
        activeTab === "requires_review",
      ),
    ],
    [
      "needs_your_review",
      usePullsQuery(
        getFilter("needs_your_review").filter_string,
        activeTab === "needs_your_review",
      ),
    ],
    [
      "authored",
      usePullsQuery(
        getFilter("authored").filter_string,
        activeTab === "authored",
      ),
    ],
    [
      "assigned",
      usePullsQuery(
        getFilter("assigned").filter_string,
        activeTab === "assigned",
      ),
    ],
    [
      "merged",
      usePullsQuery(getFilter("merged").filter_string, activeTab === "merged"),
    ],
    [
      "draft",
      usePullsQuery(getFilter("draft").filter_string, activeTab === "draft"),
    ],
  ]);
}
