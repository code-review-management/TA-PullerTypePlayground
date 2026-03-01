import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";
import { FileDiff } from "@/types/github.types";

/**
 * Fetches the files changed in a GitHub pull request.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @returns: TanStack query result containing the files changed.
 */
export function useListFilesQuery(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  return useQuery({
    queryKey: ["list-files", owner, repo, pullNumber],
    queryFn: async (): Promise<FileDiff[]> =>
      fetcher(`/api/v1/${owner}/${repo}/pulls/${pullNumber}/list-files`),
  });
}
