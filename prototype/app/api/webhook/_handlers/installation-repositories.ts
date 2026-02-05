import { octokitApp } from "@/lib/github/octokit-app";
import {
  registerData,
  unregisterRepos,
} from "@/lib/database/queries/application-registration";
import { convertToRepoData, convertToUserData } from "../utilities";

/**
 * Handle adding/removing repos from an existing installation.
 */

octokitApp.webhooks.on("installation_repositories.added", async ({ payload }) => {
    registerUserRepoChange(payload);
});

octokitApp.webhooks.on("installation_repositories.removed", async ({ payload }) => {
    registerUserRepoChange(payload);
});

async function registerUserRepoChange(
  // payload:
  //   | EmitterWebhookEvent<"installation_repositories.added">["payload"]
  //   | EmitterWebhookEvent<"installation_repositories.removed">["payload"],
  payload, // TODO: fix type
) {
  const parsedUser = convertToUserData(payload);
  const parsedRepos = convertToRepoData(payload.repositories_added);

  if (parsedRepos.length > 0) {
    console.log("Registering!");
    await registerData(parsedUser, parsedRepos);
  }

  const parsedReposRemoved = convertToRepoData(payload.repositories_removed); // fix type
  if (parsedReposRemoved.length > 0) {
    console.log("unregistering!");
    unregisterRepos(parsedUser.user_id, parsedReposRemoved);
  } else {
    console.log("No repos to remove!");
  }
}
