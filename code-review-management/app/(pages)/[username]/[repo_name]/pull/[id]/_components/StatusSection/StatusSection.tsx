import { Status } from "../StatusFlagChip/statusConstants";
import StatusFlagChip from "../StatusFlagChip/StatusFlagChip";
import MOCK_PULL from "@/mocks/pull.json"
import styles from "./StatusSection.module.css"

/**
 * Status section of the PR view page where statuses such as "Merge conflict",
 * "Needs review", etc. are displayed with status flag chips. Multiple chips may be displayed
 * at a time.
 * If the PR is ready to merge, no other flags should be able to be displayed.
 */
export default function StatusSection() {
    const statuses: Status[] = [];

    if (MOCK_PULL.mergeable) {
        statuses.push("ready");
    } else {
        if (MOCK_PULL.hasConflict) {
            statuses.push("conflict");
        }
        if (MOCK_PULL.needsReview) {
            statuses.push("waiting");
        }
        if (MOCK_PULL.hasCIFailure) {
            statuses.push("failure");
        }
    }

    return(
        <div className={styles.statusSection}>
            <div className={styles.statusList}>
                { statuses.map((status: Status, id: number) =>
                    <StatusFlagChip status={status} key={id} />
                )}
            </div>
        </div>
    );
}
