import UserIcon from "@/app/(pages)/_components/UserIcon/UserIcon";
import styles from "./DashboardGrid.module.css";
import MOCK_PULLS from "@/mocks/dashboard_pulls.json";
import { User } from "@/types/github.types";
import Link from "next/link";

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
            <td className={styles.iconWidth}>
              <UserIcon
                avatarUrl={pull.user.avatar_url}
                username={pull.user.login}
                size={40}
              />
            </td>
            <td className={`${styles.rowTitle} ${styles.titleWidth}`}>
              <Link className={styles.rowTitleTop} href={`${pull.base.repo.full_name}/pull/${pull.number}`}>
                <h4 className={styles.titleTitle}>{pull.title}</h4>
                <span className={styles.titleNumber}>#{pull.number}</span>
              </Link>
              <span className={styles.rowTitleBottom}>
                {pull.head.repo.name}
              </span>
            </td>
            <td className={styles.assigneesWidth}>
              <UserIconList users={pull.assignees} />
            </td>
            <td className={styles.reviewersWidth}>
              <UserIconList users={pull.requested_reviewers} />
            </td>
            <td className={styles.statusWidth}></td>
            <td className={styles.updatedWidth}></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UserIconList({ users }: { users: User[] }) {
  return (
    <div className={styles.userIconList}>
      {users.map((reviewer, idx) => (
        <div
          key={reviewer.login}
          className={styles.userIconListItem}
          style={{ zIndex: -idx }}
        >
          <UserIcon
            avatarUrl={reviewer.avatar_url}
            username={reviewer.login}
            size={32}
          />
        </div>
      ))}
    </div>
  );
}
