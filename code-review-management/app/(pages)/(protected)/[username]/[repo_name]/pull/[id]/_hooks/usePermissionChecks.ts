import { useParams } from "next/navigation";
import { usePermissionQuery } from "@/lib/api/queries/usePermissionQuery";
import { PullParams } from "@/types/routing.types";

type AccessType = "implicit-read" | "explicit-read" | "write";

/**
 * API error message when GitHub App is not installed: "Resource not accessible
 * by integration" (403 status)
 *
 * API error message when GitHub App is installed but user does not have push
 * access: "Must have push access to view collaborator permission" (403 status)
 */
export function usePermissionChecks() {
  const { username, repo_name } = useParams<PullParams>();
  const {
    data: permission,
    error,
    isSuccess,
  } = usePermissionQuery(username, repo_name);

  let accessType: AccessType = "implicit-read";
  if (isSuccess && permission.user?.permissions?.push) accessType = "write";
  if (error?.status === 403 && error.message.includes("push access"))
    accessType = "explicit-read";

  return {
    hasCommentPermission: accessType !== "implicit-read",
    hasWritePermission: accessType === "write",
  };
}
