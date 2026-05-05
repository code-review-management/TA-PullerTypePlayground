import { Dispatch, SetStateAction } from "react";
import styles from "./TabFilterRow.module.css";
import {
  createDashboardTabFilter,
  DashboardTabFilter,
  getAllFiltersMap,
  Tab,
} from "../../_utils/filter-utils";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import TabFilter from "../TabFilter/TabFilter";
import { PullRequestV2 } from "@/types/github.types.wrapper";

export default function TabFilterRow({
  activeTab,
  setActiveTab,
  pullsQueries,
}: {
  activeTab: DashboardTabFilter;
  setActiveTab: Dispatch<SetStateAction<DashboardTabFilter>>;
  pullsQueries: Map<Tab, UseInfiniteQueryResult<InfiniteData<PullRequestV2>>>;
}) {
  const tabFilterList = pullsQueries.keys().toArray();
  const filtersMap = getAllFiltersMap();

  return (
    <div className={styles.tabFilters}>
      {tabFilterList.map((filterName: Tab) => (
        <TabFilter
          key={filterName}
          onClick={() =>
            setActiveTab(
              filtersMap.get(filterName) || createDashboardTabFilter("all"),
            )
          }
          filterObj={filtersMap.get(filterName)}
          activeTab={activeTab}
          pullsQueries={pullsQueries}
        />
      ))}
    </div>
  );
}
