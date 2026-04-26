import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { CompareCommits } from "@/types/github.types";

/**
 * Fetches the comparison between two commits in the same GitHub repository.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param base: Base branch or SHA.
 * @param head: Head branch or SHA.
 * @param enabled: Optional flag to disable the query from automatically running
 *                 if set to false.
 * @returns: TanStack query result containing the commit comparison.
 */
export function useCompareCommitQuery(
  owner: string,
  repo: string,
  base: string,
  head: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["compare-commit", owner, repo, base, head],
    queryFn: async (): Promise<CompareCommits> =>
      fetcher(
        `/api/v1/${owner}/${repo}/commit/compare?base=${base}&head=${head}`,
      ),
    enabled,
  });
}
