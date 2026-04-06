import styles from "./PullBodyHeader.module.css";
import StateChip from "../StateChip/StateChip";
import { PullRequest } from "@/types/github.types";
import { formatRelativeDate } from "../../_utils/date-utils";
import { getPullState } from "../../_utils/pull-utils";
import UserIcon from "@/app/(pages)/_components/UserIcon/UserIcon";
import BranchDisplay from "../BranchDisplay/BranchDisplay";

/**
 * Header of the body of the PR page.
 * Includes the name of the repo, the PR name and number,
 * status of the pull request (open, closed, merged, draft),
 * the name and image of the author,
 * the names of the branches,
 * the last update time,
 * number of commits, and number of files changed, lines added, and lines deleted.
 */
export default function PullBodyHeader({
  pullData,
}: {
  pullData: PullRequest;
}) {
  const formattedRelativeDate = formatRelativeDate(
    new Date(pullData.updated_at),
  );
  const pullState = getPullState(pullData);

  return (
    <div className={styles.pullBodyHeader}>
      <div className={styles.titleLeft}>
        <div className={styles.titleIdentifierHeaders}>
          <h2 className={styles.repoName}>{pullData.base.repo.name}</h2>
          <div className={styles.titleAndNum}>
            <h1 className={styles.pullTitle}>
              {pullData.title}{" "}
              <span className={styles.pullNumber}>#{pullData.number}</span>
            </h1>
          </div>
        </div>
        <div className={styles.titleLeftInfo}>
          <StateChip state={pullState} />
          <div className={styles.userInfo}>
            <UserIcon
              avatarUrl={pullData.user?.avatar_url || ""}
              username={pullData.user?.login || ""}
              size={32}
            />
            <p className={styles.user}>{pullData.user?.login}</p>
          </div>
          <BranchDisplay
            headRef={pullData.head.ref}
            baseRef={pullData.base.ref}
          />
        </div>
      </div>
      <div className={styles.titleRight}>
        <p className={styles.updated}>Updated {formattedRelativeDate} ago</p>
        <div className={styles.changesInfo}>
          <p className={styles.commits}>{pullData.commits} commits</p>
          <p className={styles.files}>{pullData.changed_files} files</p>
          <p className={styles.additions}>+{pullData.additions}</p>
          <p className={styles.deletions}>+{pullData.deletions}</p>
        </div>
      </div>
    </div>
  );
}
