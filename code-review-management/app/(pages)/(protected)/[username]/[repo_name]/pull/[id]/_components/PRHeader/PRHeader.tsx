import { useParams } from "next/navigation";
import { PullRequest } from "@/types/github.types";
import PageHeader from "@/app/(pages)/_components/PageHeader/PageHeader";
import PRHeaderActions from "../PRHeaderActions/PRHeaderActions";
import { usePermissionChecks } from "../../_hooks/usePermissionChecks";

/**
 * Header for PR view page.
 */
export default function PRHeader({ pull }: { pull: PullRequest }) {
  const params = useParams();
  const { username, repo_name, id } = params;
  const { hasWritePermission } = usePermissionChecks();
  const isResolveable = hasWritePermission && pull.mergeable_state === "dirty" && pull.head && pull.base;
  const targetBranch = pull.base ? pull.base.ref : "";
  const featureBranch = pull.head ? pull.head.ref : "";


  const rightChildren = (
    <PRHeaderActions
      viewHref={`/${username}/${repo_name}/pull/${id}/changes`}
      viewLabel="View files"
      pull={pull}
    />
    {isResolveable && (
      <PRHeaderActions 
      viewHref={`/${username}/${repo_name}/pull/${id}/conflict-resolution?target_branch=${targetBranch}&feature_branch=${featureBranch}`}
      viewLabel="Resolve"
      pull={pull}
      />)
    }
  );

  return <PageHeader rightChildren={rightChildren} />;
}
