import { useParams } from "next/navigation";
import { PullRequest } from "@/types/github.types";
import { getPullState } from "../../../_utils/pull-utils";
import Image from "next/image";
import BranchDisplay from "../../../_components/BranchDisplay/BranchDisplay";
import CommentDiscussionIcon from "@/public/icons/comment_discussion.svg";
import HeaderButton from "@components/HeaderButton/HeaderButton";
import PageHeader from "@components/PageHeader/PageHeader";
import PRHeaderActions from "../../../_components/PRHeaderActions/PRHeaderActions";
import StateChip from "../../../_components/StateChip/StateChip";
import styles from "./PRChangesHeader.module.css";

/**
 * Header for PR changes page.
 */
export default function PRChangesHeader({
  pull,
  isActivityPanelOpen,
  toggleActivityPanel,
}: {
  pull: PullRequest;
  isActivityPanelOpen: boolean;
  toggleActivityPanel: () => void;
}) {
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
    <>
      <PRHeaderActions
        viewHref={`/${username}/${repo_name}/pull/${id}`}
        viewLabel="View pull request"
        pull={pull}
      />
      <HeaderButton variant="secondary" onClick={toggleActivityPanel}>
        <span className={styles.activity}>
          <Image src={CommentDiscussionIcon} alt="Activity" />
        </span>
      </HeaderButton>
    </>
  );

  return (
    <PageHeader
      leftChildren={leftChildren}
      rightChildren={rightChildren}
      className={isActivityPanelOpen ? styles.headerWithPanel : ""}
    />
  );
}
