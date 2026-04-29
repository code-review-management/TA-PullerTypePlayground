import { Dispatch, SetStateAction } from "react";
import styles from "./TabFilterRow.module.css";
import {
  DashboardTabFilter,
  getAllTabFilters,
  Tab,
} from "../../_utils/filter-utils";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import TabFilter from "../TabFilter/TabFilter";
import { PullRequestV2 } from "@/types/github.types.wrapper";

export default function TabFilterRow({
  activeTab,
  setActiveTab,
  pullsQueries,
  repoSet,
}: {
  activeTab: DashboardTabFilter;
  setActiveTab: Dispatch<SetStateAction<DashboardTabFilter>>;
  pullsQueries: Map<Tab, UseInfiniteQueryResult<InfiniteData<PullRequestV2>>>;
  repoSet: Set<string>;
}) {
  const filters = getAllTabFilters();

  return (
    <div className={styles.tabFilters}>
      {filters.map((filterObj) => (
        <TabFilter
          key={filterObj.filter_name}
          activeTab={activeTab}
          filterObj={filterObj}
          pullsQueries={pullsQueries}
          onClick={() => setActiveTab(filterObj)}
          repoSet={repoSet}
        />
      ))}
    </div>
  );
}
