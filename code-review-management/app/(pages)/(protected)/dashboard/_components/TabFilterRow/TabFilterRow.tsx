import { Dispatch, SetStateAction } from "react";
import styles from "./TabFilterRow.module.css";
import { getFilterObj, DashboardTabFilter, Filter } from "@/lib/filter-utils";
import TabFilter from "../TabFilter/TabFilter";
import { PullsQueryResult } from "@/lib/api/queries/usePullsQuery";

/**
 * A row of tab filters. Displayed at the top of the dashboard page content.
 *
 * @param activeTab Currently selected tab
 * @param setActiveTab Setter for currently selected tab
 * @param pullsQueries Map of filter names to their corresponding Tanstack query.
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

  return (
    <div className={styles.tabFilters}>
      {tabFilterList.map((filterName: Filter) => (
        <TabFilter
          key={filterName}
          onClick={() => setActiveTab(getFilterObj(filterName))}
          filterObj={getFilterObj(filterName)}
          activeTab={activeTab}
        />
      ))}
    </div>
  );
}
