import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";
import { PullRequestV2 } from "@/types/github.types.wrapper";
import {
  DashboardTabFilter,
  getAllTabFiltersMapped,
} from "@/app/(pages)/dashboard/_utils/filter-utils";
import { Tab } from "@/app/(pages)/dashboard/_utils/filter-utils";

/**
 * Fetches list of pull requests relevant to the requesting user.
 *
 * @param queryType:
 * @returns: TanStack query result containing the pull request data.
 */
type PullsQueryResult = UseInfiniteQueryResult<InfiniteData<PullRequestV2>>;

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

export function usePullsQueries(activeTab: Tab): Map<Tab, PullsQueryResult> {
  const filters = getAllTabFiltersMapped();
  const getFilter = (tab: Tab): DashboardTabFilter => {
    const filter = filters.get(tab);
    if (!filter) {
      throw new Error(`Missing dashboard filter for tab: ${tab}`);
    }
    return filter;
  };

  return new Map<Tab, PullsQueryResult>([
    ["all", usePullsQuery(undefined, activeTab === "all")],
    [
      "ready_for_review",
      usePullsQuery(
        getFilter("ready_for_review").filter_string,
        activeTab === "ready_for_review",
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
      usePullsQuery(
        getFilter("merged").filter_string,
        activeTab === "merged",
      ),
    ],
    [
      "draft",
      usePullsQuery(getFilter("draft").filter_string, activeTab === "draft"),
    ],
  ]);
}
