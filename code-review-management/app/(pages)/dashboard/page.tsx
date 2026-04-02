"use client";
import IconTooltip from "../_components/IconTooltip/IconTooltip";
import DashboardGrid from "./_components/DashboardGrid/DashboardGrid";
import styles from "./page.module.css";

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <IconTooltip id="user-icon-tooltip" />
      <div className={styles.repoSideBar} />
      <div className={styles.pageBody}>
          <DashboardGrid />
      </div>
    </div>
  );
}
