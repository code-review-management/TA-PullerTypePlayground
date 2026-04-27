import { useParams, useSearchParams } from "next/navigation";
import { PullParams } from "@/types/routing.types";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import { useCommitQuery } from "@/lib/api/queries/useCommitQuery";
import { useListFilesQuery } from "@/lib/api/queries/useListFilesQuery";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";
import { usePublishedThreads } from "./usePublishedThreads";

export function useChangesData() {
  const sha = useSearchParams().get("sha");
  const { username, repo_name, id } = useParams<PullParams>();

  const {
    publishedThreads,
    isPending: isPublishedThreadsPending,
    isError: isPublishedThreadsError,
    error: publishedThreadsError,
  } = usePublishedThreads(username, repo_name, id);

  const {
    data: pull,
    isPending: isPullPending,
    isError: isPullError,
    error: pullError,
  } = usePullQuery(username, repo_name, id);

  const {
    data: files,
    hasNextPage: hasNextFilesPage,
    fetchNextPage: fetchNextFilesPage,
    isFetching: isFilesFetching,
    isPending: isFilesPending,
    isError: isFilesError,
    error: filesError,
  } = useListFilesQuery(username, repo_name, id, sha === null);
  useAutoFetchAllPages(hasNextFilesPage, isFilesFetching, fetchNextFilesPage);

  const {
    data: commit,
    hasNextPage: hasNextCommitPage,
    fetchNextPage: fetchNextCommitPage,
    isFetching: isCommitFetching,
    isPending: isCommitPending,
    isError: isCommitError,
    error: commitError,
  } = useCommitQuery(username, repo_name, sha ?? "", sha !== null);
  useAutoFetchAllPages(
    hasNextCommitPage,
    isCommitFetching,
    fetchNextCommitPage,
  );

  const isActiveFilesPending = sha ? isCommitPending : isFilesPending;
  const isActiveFilesError = sha ? isCommitError : isFilesError;
  const activeFilesError = sha ? commitError : filesError;

  return {
    pull,
    files: sha ? commit?.files : files,
    publishedThreads,
    sha,
    isPending:
      isPullPending || isPublishedThreadsPending || isActiveFilesPending,
    isError: isPullError || isPublishedThreadsError || isActiveFilesError,
    error: pullError ?? publishedThreadsError ?? activeFilesError ?? null,
    errorSource: getErrorSource(
      isPullError,
      isPublishedThreadsError,
      isActiveFilesError,
      sha,
    ),
  };
}

function getErrorSource(
  isPullError: boolean,
  isPublishedThreadsError: boolean,
  isActiveFilesError: boolean,
  sha: string | null,
): "pull request" | "commit" | null {
  if (isPullError || isPublishedThreadsError) return "pull request";
  // Files in default PR-viewing mode are associated with the pull request
  // resource. Otherwise, files in commit-viewing mode are associated with the
  // commit resource.
  if (isActiveFilesError) return sha ? "commit" : "pull request";
  return null;
}
