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
  const { data, error, isPending } = usePermissionContext();
  let accessType: AccessType | null = null;

  if (
    // Note: Data is only returned for users with write-access to the repo.
    data?.user?.permissions?.push ||
    data?.permission === "write" ||
    data?.permission === "admin"
  ) {
    accessType = "write";
  } else if (
    error?.status === 403 &&
    error.message.includes("Must have push access")
  ) {
    accessType = "explicit-read";
  } else if (!isPending) {
    // Only assign fallback after request finishes pending so toast message does
    // not temporarily show for repos with write access.
    accessType = "implicit-read";
  }

  return {
    accessType,
    hasCommentPermission:
      accessType === "explicit-read" || accessType === "write",
    hasWritePermission: accessType === "write",
  };
}
