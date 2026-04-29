import styles from "./TabFilter.module.css";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { DashboardTabFilter } from "../../_utils/filter-utils";
import { PullRequestV2 } from "@/types/github.types.wrapper";
import { filterPulls } from "../../_utils/pulls-utils";

export default function TabFilter({
  onClick,
  filterObj,
  activeTab,
  pullsQueries,
  repoSet,
}: {
  onClick: () => void;
  filterObj: DashboardTabFilter;
  activeTab: DashboardTabFilter;
  pullsQueries: Map<string, UseInfiniteQueryResult<InfiniteData<PullRequestV2>>>;
  repoSet: Set<string>;
}) {
  if (!pullsQueries || !pullsQueries.has(filterObj.filter_name)) return;

  const pullQuery = pullsQueries.get(filterObj.filter_name)!;

  const items = pullQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const filteredItems = filterPulls(items, "", repoSet);

  const hasMoreItems = pullQuery.hasNextPage || pullQuery.isFetching;

  return (
    <button
      className={`${styles.filter} ${filterObj.filter_name === activeTab.filter_name && styles.selectedFilter}`}
      onClick={onClick}
    >
      {filterObj.tab_name} ({filteredItems.length}
      {hasMoreItems ? "+" : ""})
    </button>
  );
}
