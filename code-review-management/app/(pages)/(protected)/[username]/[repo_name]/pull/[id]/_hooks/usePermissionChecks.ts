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
  const { data: permission, error } = usePermissionQuery(username, repo_name);

  let accessType: AccessType | null = null;

  if (permission) {
    accessType = permission.user?.permissions?.push ? "write" : "explicit-read";
  } else if (error?.status === 403) {
    if (error.message.includes("Must have push access")) {
      accessType = "explicit-read";
    } else if (error.message.includes("Resource not accessible")) {
      accessType = "implicit-read";
    }
  }

  return {
    accessType,
    hasCommentPermission:
      accessType === "explicit-read" || accessType === "write",
    hasWritePermission: accessType === "write",
  };
}
