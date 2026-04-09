import UserIcon from "@/app/(pages)/_components/UserIcon/UserIcon";
import styles from "./DashboardGrid.module.css";
import MOCK_PULLS from "@/mocks/dashboard_pulls.json";
import { PullRequest, User } from "@/types/github.types";
import Link from "next/link";
import StatusIcon from "../StatusIcon/StatusIcon";
import { getPullState } from "@/app/(pages)/[username]/[repo_name]/pull/[id]/_utils/pull-utils";
import { formatRelativeDate } from "@/app/(pages)/[username]/[repo_name]/pull/[id]/_utils/date-utils";

export default function DashboardGrid() {
  // TODO: Use real data instead of MOCK_PULLS

  return (
    <table className={styles.dashboardGrid}>
      <thead>
        <tr className={styles.gridHeader}>
          <th className={styles.iconWidth} />
          <th className={styles.titleWidth}>Title</th>
          <th className={styles.reviewerAssigneeWidth}>Assignees</th>
          <th className={styles.reviewerAssigneeWidth}>Reviewers</th>
          <th className={styles.statusWidth}>Status</th>
          <th className={styles.updatedWidth}>Updated</th>
        </tr>
      </thead>
      <tbody className={styles.gridBody}>
        {MOCK_PULLS.map((pull) => (
          <DashboardGridRow pull={pull as PullRequest} key={pull.id} />
        ))}
      </tbody>
    </table>
  );
}

function DashboardGridRow({ pull }: { pull: PullRequest }) {
  const pullState = getPullState(pull);

  const formattedRelativeDate = formatRelativeDate(
    new Date(pull.updated_at),
    true,
  );

  return (
    <tr className={styles.gridRow}>
      <td className={styles.iconWidth}>
        <UserIcon
          avatarUrl={pull.user?.avatar_url ?? "/mock/octocat.png"}
          username={pull.user?.login ?? "octocat"}
          size={40}
          showTooltip
        />
      </td>
      <td className={`${styles.rowTitle} ${styles.titleWidth}`}>
        <Link
          className={styles.rowTitleTop}
          href={`${pull.base?.repo.full_name}/pull/${pull.number}`}
        >
          <h4 className={styles.titleTitle}>{pull.title}</h4>
          <span className={styles.titleNumber}>#{pull.number}</span>
        </Link>
        <span className={styles.rowTitleBottom}>{pull.head?.repo.name}</span>
      </td>
      <td className={styles.reviewerAssigneeWidth}>
        <UserIconList users={pull.assignees ?? []} />
      </td>
      <td className={styles.reviewerAssigneeWidth}>
        <UserIconList users={pull.requested_reviewers ?? []} />
      </td>
      <td className={`${styles.rowStatus} ${styles.statusWidth}`}>
        <StatusIcon state={pullState} />
      </td>
      <td className={styles.updatedWidth}>
        <span className={styles.rowUpdated}>{formattedRelativeDate}</span>
      </td>
    </tr>
  );
}

function UserIconList({ users }: { users: User[] }) {
  const firstThreeUsers = users.slice(0, 3);

  return (
    <div className={styles.userIconList}>
      {firstThreeUsers.map((reviewer, idx) => (
        <div key={reviewer.login} style={{ zIndex: 1000 - idx }}>
          <UserIcon
            avatarUrl={reviewer.avatar_url}
            username={reviewer.login}
            size={32}
            showTooltip
          />
        </div>
      ))}
      {users.length > 3 && (
        <div className={styles.extraUsers}>+{users.length - 3}</div>
      )}
    </div>
  );
}
