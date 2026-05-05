import { Dispatch, SetStateAction } from "react";
import styles from "./TabFilterRow.module.css";
import {
  createDashboardTabFilter,
  DashboardTabFilter,
  getAllFiltersMap,
  Filter,
} from "../../_utils/filter-utils";
import TabFilter from "../TabFilter/TabFilter";
import { PullsQueryResult } from "@/lib/api/queries/usePullsQuery";

/**
 * A row of tab filters. Displayed at the top of the dashboard page content.
 *
 * @param activeTab Currently selected tab
 * @param setActiveTab Setter for currently selected tab
 * @param pullsQueries Map of filter names to their corresponding Tanstack query.
 * @returns
 */
export default function TabFilterRow({
  activeTab,
  setActiveTab,
  pullsQueries,
}: {
  activeTab: DashboardTabFilter;
  setActiveTab: Dispatch<SetStateAction<DashboardTabFilter>>;
  pullsQueries: Map<Filter, PullsQueryResult>;
}) {
  const tabFilterList = pullsQueries.keys().toArray();
  const filtersMap = getAllFiltersMap();

  return (
    <div className={styles.tabFilters}>
      {tabFilterList.map((filterName: Filter) => (
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
