import { PullRequest } from "@/types/github.types";

/**
 * Sorts an array of PullRequests by update time (updated_at),
 * with the most recent pull requests first.
 * @param pulls Array of PullRequest objects
 * @returns Sorted array of PullRequest objects
 */
export function sortPullsByUpdated(pulls: PullRequest[]) {
  return pulls.toSorted(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

export function filterPulls(
  pulls: PullRequest[],
  searchString: string,
  repoSet: Set<string>,
) {
  return pulls.filter(
    (pull) =>
      pull.title.toLowerCase().includes(searchString.toLowerCase()) &&
      repoSet.has(`${pull.repository_owner}/${pull.repository_name}`),
  );
}

export function processPulls(
  pulls: PullRequest[],
  searchString: string,
  repoSet: Set<string>,
) {
  return filterPulls(sortPullsByUpdated(pulls), searchString, repoSet);
}
