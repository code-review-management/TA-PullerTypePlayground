import { octokitApp } from "@/lib/github/octokit-app";
import { handleRepositoryRenamed } from "@/lib/database/queries/repository";
import { createLastSyncedTime } from "../utilities";

octokitApp.webhooks.on("repository.renamed", async ({ payload }) => {
  handleRepositoryRenamed(
    payload.repository.name,
    payload.repository.full_name,
    Number(payload.repository.id),
    createLastSyncedTime(),
  );
});
