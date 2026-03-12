import UserIcon from "@/app/(pages)/_components/UserIcon/UserIcon";
import styles from "./DashboardGrid.module.css";
import MOCK_PULLS from "@/mocks/dashboard_pulls.json";

export default function DashboardGrid() {
  return (
    <table className={styles.dashboardGrid}>
      <thead>
        <tr className={styles.gridHeader}>
          <th className={styles.iconWidth} />
          <th className={styles.titleWidth}>Title</th>
          <th className={styles.assigneesWidth}>Assignees</th>
          <th className={styles.reviewersWidth}>Reviewers</th>
          <th className={styles.statusWidth}>Status</th>
          <th className={styles.updatedWidth}>Updated</th>
        </tr>
      </thead>
      <tbody className={styles.gridBody}>
        {MOCK_PULLS.map((pull) => (
          <tr key={pull.id} className={styles.gridRow}>
            <td className={styles.iconWidth}><UserIcon avatarUrl={pull.user.avatar_url} username={pull.user.login} size={40}/></td>
            <td className={`${styles.rowTitle} ${styles.titleWidth}`}>
              <div className={styles.rowTitleTop}>
                <h4 className={styles.titleTitle}>{pull.title}</h4>
                <span className={styles.titleNumber}>#{pull.number}</span>
              </div>
              <span className={styles.rowTitleBottom}>
                {pull.head.repo.name}
              </span>
            </td>
            <td className={styles.assigneesWidth}></td>
            <td className={styles.reviewersWidth}></td>
            <td className={styles.statusWidth}></td>
            <td className={styles.updatedWidth}></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
