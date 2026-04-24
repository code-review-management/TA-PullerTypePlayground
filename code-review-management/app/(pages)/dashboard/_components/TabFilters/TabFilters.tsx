import { Dispatch, SetStateAction } from "react";
import styles from "./TabFilters.module.css";
import { FILTERS, Tab } from "../../_utils/filter-utils";

export default function TabFilters({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
}) {
  return (
    <div className={styles.tabFilters}>
      {FILTERS.map((filterName) => (
        <button
          key={filterName}
          className={`${styles.filter} ${filterName === activeTab && styles.selectedFilter}`}
          onClick={() => setActiveTab(filterName)}
        >
          {filterName}
        </button>
      ))}
    </div>
  );
}
