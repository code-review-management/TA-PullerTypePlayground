import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";

/**
 * Fetches the diff-string of a commit.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param ref: SHA or branch.
 * @param enabled: Optional flag to disable the query from automatically running
 *                 if set to false.
 * @returns: TanStack query result containing the diff-string.
 */
export function useCommitDiffQuery(
  owner: string,
  repo: string,
  ref: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["commit-diff", owner, repo, ref],
    queryFn: async (): Promise<string> =>
      fetcher(`/api/v1/${owner}/${repo}/commit/${ref}/diff`),
    enabled,
  });
}
