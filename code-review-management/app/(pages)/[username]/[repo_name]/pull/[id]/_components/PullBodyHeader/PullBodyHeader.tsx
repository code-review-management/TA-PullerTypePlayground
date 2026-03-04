import { Roboto_Mono } from "next/font/google";
import Image from "next/image";
import MOCK_PULL from "@/mocks/pull.json";
import styles from "./PullBodyHeader.module.css";
import StateChip from "../StateChip/StateChip";
import { State } from "../StateChip/stateConstants";
import { PullRequest } from "@/types/github.types";
import { formatRelativeDate } from "../../_utils/date-utils";

// Used for display of the branch names in the pull body header
// TODO: Move to root layout
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

/**
 * Header of the body of the PR page.
 * Includes the name of the repo, the PR name and number,
 * status of the pull request (open, closed, merged, draft),
 * the name and image of the author,
 * the names of the branches,
 * the last update time,
 * number of commits, and number of files changed, lines added, and lines deleted.
 */
export default function PullBodyHeader({pullData} : {pullData: PullRequest}) {
  const formattedRelativeDate = formatRelativeDate(new Date(pullData.updated_at));
  return (
    <div className={`${styles.pullBodyHeader} ${robotoMono.variable}`}>
      <div className={styles.titleLeft}>
        <div className={styles.titleIdentifierHeaders}>
          <h2 className={styles.repoName}>{MOCK_PULL.repo_name}</h2>
          <div className={styles.titleAndNum}>
            <h1 className={styles.pullTitle}>
              {pullData.title}{" "}
              <span className={styles.pullNumber}>#{pullData.number}</span>
            </h1>
          </div>
        </div>
        <div className={styles.titleLeftInfo}>
          <StateChip state={pullData.state as State} />
          <div className={styles.userInfo}>
            <div className={styles.tempUserIcon}>
              <Image src="/mock/octocat.png" alt="@octocat" fill />
            </div>{" "}
            {/** TODO: Replace with user icon component */}
            <p className={styles.user}>{pullData.user?.login}</p>
          </div>
          <div className={styles.branchDisplay}>
            <div className={styles.branchChip}>
              <p className={styles.branchName}>{pullData.head.ref}</p>
            </div>
            <Image
              src="/icons/merge_direction.svg"
              width={16}
              height={12}
              alt="Right arrow"
            />
            <div className={styles.branchChip}>
              <p className={styles.branchName}>{pullData.base.ref}</p>
            </div>
          </div>
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
