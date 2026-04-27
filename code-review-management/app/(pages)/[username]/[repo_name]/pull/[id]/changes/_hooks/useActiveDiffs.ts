import { useCommitDiffsQuery } from "@/lib/api/queries/useCommitDiffsQuery";
import { useFileDiffsQuery } from "@/lib/api/queries/useFileDiffsQuery";
import { PullParams } from "@/types/routing.types";
import { useParams, useSearchParams } from "next/navigation";

export function useActiveDiffs() {
  const { username, repo_name, id } = useParams<PullParams>();
  const sha = useSearchParams().get("sha");

  const fileDiffs = useFileDiffsQuery(username, repo_name, id, sha === null);
  const commitDiffs = useCommitDiffsQuery(
    username,
    repo_name,
    sha ?? "",
    sha !== null,
  );

  const { data, isPending, isError } = sha ? commitDiffs : fileDiffs;

  return { diffString: data, isPending, isError };
}
