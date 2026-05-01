import styles from "./TabFilter.module.css";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { DashboardTabFilter, Tab } from "../../_utils/filter-utils";
import { PullRequestV2 } from "@/types/github.types.wrapper";

export default function TabFilter({
  onClick,
  filterObj,
  activeTab,
  pullsQueries,
}: {
  onClick: () => void;
  filterObj: DashboardTabFilter;
  activeTab: DashboardTabFilter;
  pullsQueries: Map<Tab, UseInfiniteQueryResult<InfiniteData<PullRequestV2>>>;
}) {
  if (!pullsQueries || !pullsQueries.has(filterObj.filter_name)) return null;

  return (
    <button
      className={`${styles.filter} ${filterObj.filter_name === activeTab.filter_name && styles.selectedFilter}`}
      onClick={onClick}
    >
      {filterObj.tab_name}
      {/** TODO: Add counter badge */}
    </button>
  );
}
