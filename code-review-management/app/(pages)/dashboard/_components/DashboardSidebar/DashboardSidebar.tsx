import styles from "./DashboardSidebar.module.css";

export default function DashboardSidebar() {
  return <div className={styles.dashboardSidebar}>
    <div className={styles.sidebarContent}><h4>REPOSITORIES</h4></div>
    <div className={styles.sideBorder}/>
  </div>;
}
