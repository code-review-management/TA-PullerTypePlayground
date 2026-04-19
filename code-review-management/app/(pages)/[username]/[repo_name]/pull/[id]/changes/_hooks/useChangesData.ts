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
  } = useListFilesQuery(username, repo_name, id);
  useAutoFetchAllPages(hasNextFilesPage, isFilesFetching, fetchNextFilesPage);

  const {
    data: commitFiles,
    hasNextPage: hasNextCommitFilesPage,
    fetchNextPage: fetchNextCommitFilesPage,
    isFetching: isCommitFilesFetching,
    isPending: isCommitFilesPending,
    isError: isCommitFilesError,
  } = useCommitQuery(username, repo_name, sha ?? "", sha !== null);
  useAutoFetchAllPages(
    hasNextCommitFilesPage,
    isCommitFilesFetching,
    fetchNextCommitFilesPage,
  );

  return {
    pull,
    files: sha ? commitFiles?.files : files,
    publishedThreads,
    isPending:
      isPullPending ||
      isPublishedThreadsPending ||
      (sha ? isCommitFilesPending : isFilesPending),
    isError:
      isPullError ||
      isPublishedThreadsError ||
      (sha ? isCommitFilesError : isFilesError),
  };
}
