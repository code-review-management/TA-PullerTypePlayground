import CISectionCollapsible from "../CISectionCollapsible/CISectionCollapsible";
import styles from "./CISection.module.css"

/**
 * The CI section of the PR View page. 
 * Includes a header and collapsible sections for passing/failing tests.
 */
export default function CISection() {
    return(
        <div className={styles.CISection}>
            <h4>CI checks</h4>
            <CISectionCollapsible iconSrc="/icons/ci_passing.svg" headerText="7 passing">View passing tests</CISectionCollapsible>
            <CISectionCollapsible iconSrc="/icons/ci_failing.svg" headerText="2 failing">View failing tests</CISectionCollapsible>
        </div>
    );
}