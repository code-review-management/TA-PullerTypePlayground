import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";

/**
 * Fetches the diff-string of a GitHub pull request.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @param enabled: Optional flag to disable the query from automatically running
 *                 if set to false.
 * @returns: TanStack query result containing the diff-string.
 */
export function useFileDiffsQuery(
  owner: string,
  repo: string,
  pullNumber: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["file-diffs", owner, repo, pullNumber],
    queryFn: async (): Promise<string> =>
      fetcher(`/api/v1/${owner}/${repo}/pulls/${pullNumber}/file-diffs`),
    enabled,
  });
}
