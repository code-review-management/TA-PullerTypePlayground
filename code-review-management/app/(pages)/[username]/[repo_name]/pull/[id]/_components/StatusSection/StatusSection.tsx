import { Status } from "../StatusFlagChip/statusConstants";
import StatusFlagChip from "../StatusFlagChip/StatusFlagChip";
import styles from "./StatusSection.module.css";
import { PullRequest } from "@/types/github.types";

/**
 * Status section of the PR view page where statuses such as "Merge conflict",
 * "Needs review", etc. are displayed with status flag chips. Multiple chips may be displayed
 * at a time.
 * If the PR is ready to merge, no other flags should be able to be displayed.
 */
export default function StatusSection({ pullData }: { pullData: PullRequest }) {
  const statuses: Status[] = [];

  if (pullData.mergeable_state === "ready") {
    statuses.push("ready");
  } else {
    if (pullData.mergeable_state === "dirty") {
      statuses.push("conflict");
    }
    if (pullData.mergeable_state === "blocked") {
      statuses.push("waiting");
    }
    // TODO: Check if CI failure
  }

  return (
    <div className={styles.statusSection}>
      <div className={styles.statusList}>
        {statuses.map((status: Status) => (
          <StatusFlagChip status={status} key={status} />
        ))}
      </div>
    </div>
  );
}
