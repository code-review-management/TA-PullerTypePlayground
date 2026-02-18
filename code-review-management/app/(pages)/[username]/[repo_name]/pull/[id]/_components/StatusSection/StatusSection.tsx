import { Status } from "../StatusFlagChip/statusConstants";
import StatusFlagChip from "../StatusFlagChip/StatusFlagChip";
import MOCK_PULL from "@/mocks/pull.json"
import styles from "./StatusSection.module.css"

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

    console.log(statuses);

    return(
        <div className={styles.statusSection}>
            { statuses.map((status: Status, id: number) => 
                <StatusFlagChip status={status} key={id} />
            )}
        </div>
    );
}
