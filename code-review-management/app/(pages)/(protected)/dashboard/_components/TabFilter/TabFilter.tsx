import styles from "./TabFilter.module.css";
import { DashboardTabFilter } from "@/lib/filter-utils";

export default function TabFilter({
  onClick,
  filterObj,
  activeTab,
}: {
  onClick: () => void;
  filterObj: DashboardTabFilter;
  activeTab: DashboardTabFilter;
}) {
  if (!filterObj) return null;

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
