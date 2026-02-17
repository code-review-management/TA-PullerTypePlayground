import "server-only";

import { App } from "octokit";
import fs from "fs";

/**
 * Documentation:
 * 1. https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/building-a-github-app-that-responds-to-webhook-events#add-code-to-respond-to-webhook-events
 * - The following code was copied from the GitHub documentation to create the
 *   Octokit App client.
 */

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

export const octokitApp = new App({
  appId,
  privateKey,
  webhooks: {
    secret: webhookSecret,
  },
});
