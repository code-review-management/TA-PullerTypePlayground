import { supabaseInstance } from "../client";

export interface PullRequestData {
  pr_id: number;
  number: number;
  owner_id: number | undefined;
  owner_repo_id: number;
  last_synced_at?: string;
}

export const setPullRequest = async (prData: PullRequestData) => {
  const { data, error } = await supabaseInstance
    .from("pull_requests")
    .upsert(prData, { onConflict: "pr_id" })
    .select();

  if (error) {
    console.error("Repo Sync Error:", error.message);
    throw error;
  }

  return data;
};

export const getPRLastSyncTime = async (pr_id: number) => {
  const { data, error } = await supabaseInstance
    .from("pull_requests")
    .select("last_synced_at")
    .eq("pr_id", pr_id)
    .single();

  if (error) {
    console.error("Fetch PR Modify Time Error:", error.message);
  }

  // Returns the timestamp string (or null if not set)
  return data?.last_synced_at;
};
