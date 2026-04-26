import { useParams } from "next/navigation";
import { useChangesViewMode } from "./useChangesViewMode";
import { useCommitDiffsQuery } from "@/lib/api/queries/useCommitDiffsQuery";
import { useCompareCommitsDiffsQuery } from "@/lib/api/queries/useCompareCommitsDiffsQuery";
import { useFileDiffsQuery } from "@/lib/api/queries/useFileDiffsQuery";
import { PullParams } from "@/types/routing.types";
import { PullRequest } from "@/types/github.types";

export function useActiveDiffs(pull: PullRequest) {
  const { username, repo_name, id } = useParams<PullParams>();
  const { sha, mode } = useChangesViewMode();

  const fileDiffs = useFileDiffsQuery(username, repo_name, id, mode === "pr");
  const commitDiffs = useCommitDiffsQuery(
    username,
    repo_name,
    sha ?? "",
    mode === "commit",
  );
  const cumulativeDiffs = useCompareCommitsDiffsQuery(
    username,
    repo_name,
    pull.base?.ref ?? "",
    sha ?? "",
    mode === "cumulative" && !!pull.base?.ref,
  );

  const { data, isPending, isError } =
    mode === "commit"
      ? commitDiffs
      : mode === "cumulative"
        ? cumulativeDiffs
        : fileDiffs;

  return { diffString: data, isPending, isError };
}
