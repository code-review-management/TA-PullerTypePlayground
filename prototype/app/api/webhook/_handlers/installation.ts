import { octokitApp } from "@/lib/github/octokit-app";
import {
  registerData,
  unregisterUser,
} from "@/lib/database/queries/application-registration";
import { convertToRepoData, convertToUserData } from "../utilities";

/**
 * Handle new installations.
 */

octokitApp.webhooks.on("installation.created", async ({ payload }) => {
  const parsedUser = convertToUserData(payload);
  const parsedRepos = convertToRepoData(payload.repositories);
  registerData(parsedUser, parsedRepos);
});

octokitApp.webhooks.on("installation.deleted", async ({ payload }) => {
  const userId = payload.sender.id;
  unregisterUser(userId);
});
