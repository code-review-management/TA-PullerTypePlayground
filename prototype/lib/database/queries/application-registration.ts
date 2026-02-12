import { supabaseInstance } from "../client";
import { Octokit } from "octokit";

export interface UserData {
  user_id: number;
  login: string;
  installation_id: number;
  last_synced_at?: string;
}

export interface RepoData {
  repo_id: number;
  name: string;
  full_name: string;
  last_synced_at?: string;
}

export const registerData = async (
  userData: UserData,
  repoData: RepoData[],
) => {
  await Promise.all([registerUser(userData), registerRepos(repoData)]);
  linkContributorToRepos(
    userData.user_id,
    repoData.map((repo) => repo.repo_id),
  );
};

export const unregisterUser = async (userId: number) => {
  const { data, error } = await supabaseInstance.rpc("handle_user_uninstall", {
    target_user_id: Number(userId),
  });

  if (error) {
    console.error("handle_user_uninstall RPC failed:", error.message);
  } else {
    console.log(
      "handle_user_uninstall RPC Responsless, probably means success?",
    );
  }
};

export const unregisterRepos = async (
  userId: number,
  reposToDelete: RepoData[],
) => {
  const repoIdList: number[] = reposToDelete.map((repo) => repo.repo_id);
  const { data, error } = await supabaseInstance.rpc("remove_user_repos", {
    target_user_id: Number(userId),
    repo_ids_to_remove: repoIdList,
  });

  if (error) {
    console.error("remove_user_repos RPC failed:", error.message);
  } else {
    console.log("remove_user_repos success: ", data);
  }
};

/**
 * Registers a new user or updates their installation ID if they already exist.
 */
const registerUser = async (userData: UserData) => {
  const { data, error } = await supabaseInstance
    .from("users")
    .upsert(
      {
        user_id: userData.user_id,
        login: userData.login,
        installation_id: userData.installation_id,
        repo_last_sync_time: userData.last_synced_at
      },
      {
        onConflict: "user_id",
      },
    )
    .select()
    .single();

  if (error) {
    console.error("Failed to register user:", error.message);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Bulk upserts a list of repositories from a GitHub App installation.
 */
const registerRepos = async (repos: RepoData[]) => {
  // Map GitHub payload to Supabase schema
  const repoData = repos.map((repo) => ({
    repo_id: repo.repo_id, // BIGINT
    name: repo.name,
    full_name: repo.full_name,
    last_synced_at: new Date().toISOString(),
  }));

  const { data, error } = await supabaseInstance
    .from("repositories")
    .upsert(repoData, { onConflict: "repo_id" })
    .select();
    
  if (error) {
    console.error("Repo Sync Error:", error.message);
    throw error;
  }

  return data;
};

/**
 * Links a user to a list of repositories in the junction table.
 */
const linkContributorToRepos = async (userId: number, repoIds: number[]) => {
  const links = repoIds.map((repoId) => ({
    user_id: userId,
    repo_id: repoId,
  }));

  const { error } = await supabaseInstance
    .from("repository_contributors")
    .upsert(links, { onConflict: "user_id, repo_id" });

  if (error) {
    console.error("Junction Sync Error:", error.message);
    throw error;
  }
};
