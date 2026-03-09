import { useParams } from "next/navigation";
import { PullRequest } from "@/types/github.types";
import { getPullState } from "../../../_utils/pull-utils";
import BranchDisplay from "../../../_components/BranchDisplay/BranchDisplay";
import PageHeader from "@/app/(pages)/_components/PageHeader/PageHeader";
import PRHeaderActionButtons from "../../../_components/PRHeaderActionButtons/PRHeaderActionButtons";
import StateChip from "../../../_components/StateChip/StateChip";
import styles from "./PRChangesHeader.module.css";

/**
 * Header for PR changes page.
 */
export default function PRChangesHeader({ pull }: { pull: PullRequest }) {
  const params = useParams();
  const { username, repo_name, id } = params;

  const leftChildren = (
    <>
      <StateChip state={getPullState(pull)} />
      <h1 className={styles.pullTitle}>
        {pull.title} <span className={styles.pullNumber}>#{pull.number}</span>
      </h1>
      <div className={styles.branchDisplay}>
        <BranchDisplay headRef={pull.head.ref} baseRef={pull.base.ref} />
      </div>
    </>
  );

  const rightChildren = (
    <PRHeaderActionButtons
      viewHref={`/${username}/${repo_name}/pull/${id}`}
      viewLabel="View pull request"
    />
  );

  return (
    <PageHeader leftChildren={leftChildren} rightChildren={rightChildren} />
  );
}
