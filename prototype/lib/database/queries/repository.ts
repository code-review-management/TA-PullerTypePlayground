import { supabaseInstance } from "../client";

export const handleRepositoryRenamed = async (
  newName: string,
  newFullName: string,
  repositoryId: number,
  lastSyncedAt: string,
) => {
  await supabaseInstance
    .from("repositories")
    .update({
      last_synced_at: lastSyncedAt,
      name: newName,
      full_name: newFullName,
    })
    .eq("repo_id", repositoryId);
};

/**
 * Documentation:
 * 1. https://michaeluloth.com/javascript-filter-boolean/
 * 2. https://www.geeksforgeeks.org/typescript/explain-type-assertions-in-typescript/
 * 3. https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript
 */
export const getUserRepositoriesLastSyncTime = async (userId: number) => {
  const { data } = await supabaseInstance
    .from("repository_contributors")
    .select(
      `
      repositories (
        last_synced_at
      )
    `,
    )
    .eq("user_id", userId);

  if (data != null && data.length > 0) {
    const repoTimes = data
      .map((row) => row.repositories.last_synced_at)
      .filter(Boolean); // Filter out nulls

    (repoTimes as string[]).sort(
      // Getting the most recent time a user's repo was updated
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );
    return repoTimes[0];
  }

  return null;
};
