import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";

/**
 * Fetches the diff-string of the comparison between two GitHub commits in the
 * same repository.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param base: Base branch or SHA.
 * @param head: Head branch or SHA.
 * @param enabled: Optional flag to disable the query from automatically running
 *                 if set to false.
 * @returns: TanStack query result containing the diff-string.
 */
export function useCompareCommitDiffsQuery(
  owner: string,
  repo: string,
  base: string,
  head: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["compare-commit-diffs", owner, repo, base, head],
    queryFn: async (): Promise<string> =>
      fetcher(
        `/api/v1/${owner}/${repo}/commit/compare/diff?base=${base}&head=${head}`,
      ),
    enabled,
  });
}
