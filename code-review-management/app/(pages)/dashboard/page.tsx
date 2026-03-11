import DashboardGrid from "./_components/DashboardGrid/DashboardGrid";
import styles from "./page.module.css";

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.repoSideBar} />
      <div className={styles.pageBody}>
          <DashboardGrid />
      </div>
    </div>
  );
}
