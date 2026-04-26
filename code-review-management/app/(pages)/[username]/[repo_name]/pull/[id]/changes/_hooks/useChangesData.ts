import { useParams } from "next/navigation";
import { PullParams } from "@/types/routing.types";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import { useCommitQuery } from "@/lib/api/queries/useCommitQuery";
import { useCompareCommitQuery } from "@/lib/api/queries/useCompareCommitQuery";
import { useListFilesQuery } from "@/lib/api/queries/useListFilesQuery";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";
import { usePublishedThreads } from "./usePublishedThreads";
import { useChangesViewMode } from "./useChangesViewMode";

export function useChangesData() {
  const { username, repo_name, id } = useParams<PullParams>();
  const { sha, mode } = useChangesViewMode();

  const {
    publishedThreads,
    isPending: isPublishedThreadsPending,
    isError: isPublishedThreadsError,
  } = usePublishedThreads(username, repo_name, id);

  const {
    data: pull,
    isPending: isPullPending,
    isError: isPullError,
  } = usePullQuery(username, repo_name, id);

  const {
    data: files,
    hasNextPage: hasNextFilesPage,
    fetchNextPage: fetchNextFilesPage,
    isFetching: isFilesFetching,
    isPending: isFilesPending,
    isError: isFilesError,
  } = useListFilesQuery(username, repo_name, id, mode === "pr");
  useAutoFetchAllPages(hasNextFilesPage, isFilesFetching, fetchNextFilesPage);

  const {
    data: commit,
    hasNextPage: hasNextCommitPage,
    fetchNextPage: fetchNextCommitPage,
    isFetching: isCommitFetching,
    isPending: isCommitPending,
    isError: isCommitError,
  } = useCommitQuery(username, repo_name, sha ?? "", mode === "commit");
  useAutoFetchAllPages(
    hasNextCommitPage,
    isCommitFetching,
    fetchNextCommitPage,
  );

  const {
    data: compareCommit,
    isPending: isCompareCommitPending,
    isError: isCompareCommitError,
  } = useCompareCommitQuery(
    username,
    repo_name,
    pull?.base?.ref ?? "",
    sha ?? "",
    mode === "cumulative" && !!pull?.base?.ref,
  );

  let activeFiles, isActiveFilesPending, isActiveFilesError;
  if (mode === "pr") {
    activeFiles = files;
    isActiveFilesPending = isFilesPending;
    isActiveFilesError = isFilesError;
  } else if (mode === "commit") {
    activeFiles = commit?.files;
    isActiveFilesPending = isCommitPending;
    isActiveFilesError = isCommitError;
  } else {
    activeFiles = compareCommit?.files;
    isActiveFilesPending = isCompareCommitPending;
    isActiveFilesError = isCompareCommitError;
  }

  return {
    pull,
    files: activeFiles,
    publishedThreads,
    sha,
    isPending:
      isPullPending || isPublishedThreadsPending || isActiveFilesPending,
    isError: isPullError || isPublishedThreadsError || isActiveFilesError,
  };
}
