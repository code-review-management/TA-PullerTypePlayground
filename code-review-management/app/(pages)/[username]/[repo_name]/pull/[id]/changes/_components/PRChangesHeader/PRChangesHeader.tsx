import { useParams } from "next/navigation";
import { PullRequest } from "@/types/github.types";
import BranchDisplay from "../../../_components/BranchDisplay/BranchDisplay";
import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import PageHeader from "@/app/(pages)/_components/PageHeader/PageHeader";
import StateChip from "../../../_components/StateChip/StateChip";
import styles from "./PRChangesHeader.module.css";

export default function PRChangesHeader({ pull }: { pull: PullRequest }) {
  const params = useParams();
  const { username, repo_name, id } = params;

  // Abstract this logic to make it reusable.
  const pullState = (() => {
    if (pull.draft) {
      return "draft";
    }
    if (pull.merged) {
      return "merged";
    }
    return pull.state;
  })();

  const leftChildren = (
    <>
      <StateChip state={pullState} />
      <h1 className={styles.pullTitle}>
        {pull.title} <span className={styles.pullNumber}>#{pull.number}</span>
      </h1>
      <BranchDisplay headRef={pull.head.ref} baseRef={pull.base.ref} />
    </>
  );

  const rightChildren = (
    <>
      <HeaderButton
        href={`/${username}/${repo_name}/pull/${id}`}
        variant="secondary"
      >
        View pull request
      </HeaderButton>
      <HeaderButton
        href={`/${username}/${repo_name}/pull/${id}/changes`}
        variant="secondary"
      >
        Add review
      </HeaderButton>
      <HeaderButton>Merge</HeaderButton>
    </>
  );

  return (
    <PageHeader leftChildren={leftChildren} rightChildren={rightChildren} />
  );
}
