import { octokitApp } from "@/lib/github/octokit-app";
import { setPullRequest } from "@/lib/database/queries/pull-request";
import { createLastSyncedTime } from "../utilities";

octokitApp.webhooks.on("pull_request", async ({ payload }) => {
  setPullRequest({
    pr_id: payload.pull_request.id,
    number: payload.pull_request.number,
    owner_id: payload.sender?.id, // FIX
    owner_repo_id: payload.repository.id,
    last_synced_at: createLastSyncedTime(),
  });
});

octokitApp.webhooks.on("pull_request_review", async ({ payload }) => {
  setPullRequest({
    pr_id: payload.pull_request.id,
    number: payload.pull_request.number,
    owner_id: payload.sender.id,
    owner_repo_id: payload.repository.id,
    last_synced_at: createLastSyncedTime(),
  });
});

octokitApp.webhooks.on("pull_request_review_comment", async ({ payload }) => {
  setPullRequest({
    pr_id: payload.pull_request.id,
    number: payload.pull_request.number,
    owner_id: payload.sender.id,
    owner_repo_id: payload.repository.id,
    last_synced_at: createLastSyncedTime(),
  });
});

octokitApp.webhooks.on("pull_request_review_thread", async ({ payload }) => {
  setPullRequest({
    pr_id: payload.pull_request.id,
    number: payload.pull_request.number,
    owner_id: payload.sender?.id, // FIX
    owner_repo_id: payload.repository.id,
    last_synced_at: createLastSyncedTime(),
  });
});
