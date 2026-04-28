import { useParams } from "next/navigation";
import { useChangesViewMode } from "./useChangesViewMode";
import { useCommitDiffsQuery } from "@/lib/api/queries/useCommitDiffsQuery";
import { useCompareCommitDiffsQuery } from "@/lib/api/queries/useCompareCommitDiffsQuery";
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
    mode === "single-commit",
  );
  const cumulativeDiffs = useCompareCommitDiffsQuery(
    username,
    repo_name,
    pull.base?.sha ?? "",
    sha ?? "",
    mode === "cumulative-commit" && !!pull.base?.sha,
  );

  const { data, isPending, isError, error } =
    mode === "pr"
      ? fileDiffs
      : mode === "single-commit"
        ? commitDiffs
        : cumulativeDiffs;

  return { diffString: data, isPending, isError, error };
}
