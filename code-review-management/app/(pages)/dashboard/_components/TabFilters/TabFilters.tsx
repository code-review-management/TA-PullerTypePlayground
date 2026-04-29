import { Dispatch, SetStateAction } from "react";
import styles from "./TabFilters.module.css";
import { DashboardTabFilter, getAllTabFilters } from "../../_utils/filter-utils";

export default function TabFilters({
  activeTab,
  setActiveTab,
}: {
  activeTab: DashboardTabFilter;
  setActiveTab: Dispatch<SetStateAction<DashboardTabFilter>>;
}) {
  const filters = getAllTabFilters();

  return (
    <div className={styles.tabFilters}>
      {filters.map((filterObj) => (
        <button
          key={filterObj.filter_name}
          className={`${styles.filter} ${filterObj.filter_name === activeTab.filter_name && styles.selectedFilter}`}
          onClick={() => setActiveTab(filterObj)}
        >
          {filterObj.tab_name}
        </button>
      ))}
    </div>
  );
}
