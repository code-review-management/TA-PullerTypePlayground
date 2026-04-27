import { Repo } from "@/types/github.types";

/**
 * Sorts a flat array of repo objects into a Map of owners (usernames / org names) to repo names
 * @param repos Array of Repo objects.
 * @returns Map of owners (usernames / org names) to repo names
 */
export function sortReposByOrg(repos: Repo[]) {
  const mappedRepos = new Map<string, string[]>();
  for (const repo of repos) {
    const [owner, name] = repo.full_name.split("/");
    if (mappedRepos.get(owner)) {
      mappedRepos.get(owner)!.push(name);
    } else {
      mappedRepos.set(owner, [name]);
    }
  }
  return mappedRepos;
}
