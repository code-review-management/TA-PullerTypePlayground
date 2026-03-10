import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/utils/fetcher";
import { PullRequest } from "@/types/github.types";

/**
 * Fetches the timeline for a GitHub pull request.
 *
 * @param owner: Owner of the repository.
 * @param repo: Name of the repository.
 * @param pullNumber: Pull request number.
 * @returns: TanStack query result containing the timeline data.
 */
export function useTimelineQuery(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  return useQuery({
    queryKey: ["timeline", owner, repo, pullNumber],
    queryFn: async (): Promise<PullRequest> =>
      fetcher(`/api/v1/${owner}/${repo}/pulls/${pullNumber}/timeline`),
  });
}
