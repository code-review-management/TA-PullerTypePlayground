import Image from "next/image";
import MOCK_PULL from "@/mocks/pull.json";
import styles from "./PullBodyHeader.module.css";
import StateChip from "../StateChip/StateChip";
import { State } from "../StateChip/stateConstants";
import UserIcon from "@/app/(pages)/_components/UserIcon/UserIcon";

/**
 * Header of the body of the PR page.
 * Includes the name of the repo, the PR name and number,
 * status of the pull request (open, closed, merged, draft),
 * the name and image of the author,
 * the names of the branches,
 * the last update time,
 * number of commits, and number of files changed, lines added, and lines deleted.
 */
export default function PullBodyHeader() {
  return (
    <div className={styles.pullBodyHeader}>
      <div className={styles.titleLeft}>
        <div className={styles.titleIdentifierHeaders}>
          <h2 className={styles.repoName}>{MOCK_PULL.repo_name}</h2>
          <div className={styles.titleAndNum}>
            <h1 className={styles.pullTitle}>
              {MOCK_PULL.title}{" "}
              <span className={styles.pullNumber}>#{MOCK_PULL.number}</span>
            </h1>
          </div>
        </div>
        <div className={styles.titleLeftInfo}>
          <StateChip state={MOCK_PULL.state as State} />
          <div className={styles.userInfo}>
            <UserIcon
              avatarUrl="/mock/octocat.png"
              username="octocat"
              size={32}
            />
            <p className={styles.user}>{MOCK_PULL.user}</p>
          </div>
          <div className={styles.branchDisplay}>
            <div className={styles.branchChip}>
              <p className={styles.branchName}>{MOCK_PULL.head_title}</p>
            </div>
            <Image
              src="/icons/merge_direction.svg"
              width={16}
              height={12}
              alt="Right arrow"
            />
            <div className={styles.branchChip}>
              <p className={styles.branchName}>{MOCK_PULL.base_title}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.titleRight}>
        <p className={styles.updated}>Updated {MOCK_PULL.updated}</p>
        <div className={styles.changesInfo}>
          <p className={styles.commits}>{MOCK_PULL.commits} commits</p>
          <p className={styles.files}>{MOCK_PULL.changed_files} files</p>
          <p className={styles.additions}>+{MOCK_PULL.additions}</p>
          <p className={styles.deletions}>+{MOCK_PULL.deletions}</p>
        </div>
      </div>
    </div>
  );
}
