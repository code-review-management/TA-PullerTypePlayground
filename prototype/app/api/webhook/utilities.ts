import { EmitterWebhookEvent } from "@octokit/webhooks";
import {
  UserData,
  RepoData,
} from "@/lib/database/queries/application-registration";

export function createLastSyncedTime() {
  return new Date().toISOString();
}

export function convertToUserData(
  payload:
    | EmitterWebhookEvent<"installation.created">["payload"]
    | EmitterWebhookEvent<"installation_repositories.added">["payload"]
    | EmitterWebhookEvent<"installation_repositories.removed">["payload"],
): UserData {
  return {
    user_id: payload.sender.id,
    login: payload.sender.login,
    installation_id: payload.installation.id,
    last_synced_at: new Date().toISOString()
  };
}

export function convertToRepoData(
  repoPayload:
    | EmitterWebhookEvent<"installation.created">["payload"]["repositories"]
    | EmitterWebhookEvent<"installation_repositories.added">["payload"]["repositories_added"]
    | EmitterWebhookEvent<"installation_repositories.removed">["payload"]["repositories_removed"],
): RepoData[] {
  return (repoPayload ?? []).map((repo) => {
    return {
      repo_id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
    };
  });
}
