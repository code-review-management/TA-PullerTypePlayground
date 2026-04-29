import { Dispatch, SetStateAction } from "react";
import styles from "./TabFilters.module.css";
import { getAllTabFilters, Tab } from "../../_utils/filter-utils";

export default function TabFilters({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
}) {
  const filters = getAllTabFilters();

  return (
    <div className={styles.tabFilters}>
      {filters.map((filterObj) => (
        <button
          key={filterObj.filter_name}
          className={`${styles.filter} ${filterObj.filter_name === activeTab && styles.selectedFilter}`}
          onClick={() => setActiveTab(filterObj.filter_name)}
        >
          {filterObj.tab_name}
        </button>
      ))}
    </div>
  );
}
