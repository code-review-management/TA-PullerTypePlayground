import { Repo } from "@/types/github.types";

export function splitRepoName(repoName: string): {
  owner: string;
  name: string;
} {
  const splitName = repoName.split("/");
  return {
    owner: splitName[0],
    name: splitName[1],
  };
}

/**
 * Sorts a flat array of repo objects into a Map of owners (usernames / org names) to repo names
 * @param repos Array of Repo objects.
 * @returns Map of owners (usernames / org names) to repo names
 */
export function sortReposByOrg(repos: Repo[]) {
  const mappedRepos = new Map<string, string[]>();
  for (const repo of repos) {
    const { owner, name } = splitRepoName(repo.full_name);
    if (mappedRepos.get(owner)) {
      mappedRepos.get(owner)!.push(name);
    } else {
      mappedRepos.set(owner, [name]);
    }
  }
  return mappedRepos;
}

export function getOrgSetFromRepoNameList(repoNames: string[]): Set<string> {
  const orgSet = new Set<string>();
  repoNames.forEach((repoName) => {
    const { owner } = splitRepoName(repoName);
    orgSet.add(owner);
  });
  return orgSet;
}
