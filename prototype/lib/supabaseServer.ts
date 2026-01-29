import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Keep the client private to this file
const supabaseInstance = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface UserData{
  user_id: number;
  login: string;
  instillation_id: number;
}

interface RepoData{
    repo_id: number;
    name: string;
    full_name: string;
    last_synced_at?: string;
}

/**
 * Registers a new user or updates their installation ID if they already exist.
 */
export const registerUser = async (userData: UserData) => {
  const { data, error } = await supabaseInstance
    .from('users')
    .upsert({
      user_id: userData.user_id,
      login: userData.login,
      instillation_id: userData.instillation_id,
    }, {
      onConflict: 'user_id'
    })
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
export const registerRepos = async (
  repos: RepoData[]
) => {
  // Map GitHub payload to your Supabase schema
  const repoData = repos.map(repo => ({
    repo_id: repo.repo_id,                 // BIGINT
    name: repo.name,
    full_name: repo.full_name,
    last_synced_at: new Date().toISOString()
  }));

  const { data, error } = await supabaseInstance
    .from('repositories')
    .upsert(repoData, { onConflict: 'repo_id' })
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
export const linkContributorToRepos = async (
  userId: number, 
  repoIds: number[]
) => {
  const links = repoIds.map(repoId => ({
    user_id: userId,
    repo_id: repoId
  }));

  const { error } = await supabaseInstance
    .from('repository_contributors')
    .upsert(links, { onConflict: 'user_id, repo_id' });

  if (error) {
    console.error("Junction Sync Error:", error.message);
    throw error;
  }
};