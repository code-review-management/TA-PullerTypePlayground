import styles from "./DashboardGrid.module.css";
import MOCK_PULLS from "@/mocks/dashboard_pulls.json";

export default function DashboardGrid() {
  return (
    <div className={styles.dashboardGrid}>
      <tr className={styles.gridHeader}>
        <th className={styles.iconWidth} />
        <th className={styles.titleWidth}>Title</th>
        <th className={styles.assigneesWidth}>Assignees</th>
        <th className={styles.reviewersWidth}>Reviewers</th>
        <th className={styles.statusWidth}>Status</th>
        <th className={styles.updatedWidth}>Updated</th>
      </tr>
      {MOCK_PULLS.map((pull) => (
        <tr key={pull.id} className={styles.gridRow}>
          <td className={styles.iconWidth}></td>
          <td className={styles.titleWidth}>{pull.title}</td>
          <td className={styles.assigneesWidth}></td>
          <td className={styles.reviewersWidth}></td>
          <td className={styles.statusWidth}></td>
          <td className={styles.updatedWidth}></td>
        </tr>
      ))}
    </div>
  );
}
