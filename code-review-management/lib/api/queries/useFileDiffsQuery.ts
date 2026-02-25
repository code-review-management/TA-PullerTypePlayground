import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";

/**
 * Fetches the diff-string of a GitHub pull request.
 * 
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param id: Pull request number.
 * @returns: TanStack query result containing the diff-string.
 */
export function useFileDiffsQuery(owner: string, repo: string, id: string) {
  return useQuery({
    queryKey: ["file-diffs", owner, repo, id],
    queryFn: async (): Promise<string> =>
      fetcher(`/api/v1/${owner}/${repo}/pulls/${id}/file-diffs`),
  });
}
