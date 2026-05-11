import { usePermissionContext } from "../_contexts/PermissionContext";

type AccessType = "implicit-read" | "explicit-read" | "write";

/**
 * API error message when GitHub App is not installed: "Resource not accessible
 * by integration" (403 status)
 *
 * API error message when GitHub App is installed but user does not have push
 * access: "Must have push access to view collaborator permission" (403 status).
 * - Note: It seems like this API error message only appears if requesting from
 *   outside the GitHub App. When requesting through the GitHub App in this
 *   scenario, we get the "Resource not accessible by integration" message
 *   instead. I will still keep the logic for this message check, but as far
 *   as I know, I do not know a scenario where it is being applied. This means
 *   the access type "explicit-read" will likely be unused.
 */
export function usePermissionChecks() {
  const { data, error } = usePermissionContext();
  let accessType: AccessType | null = null;

  if (data) {
    accessType = data.user?.permissions?.push ? "write" : "explicit-read";
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
