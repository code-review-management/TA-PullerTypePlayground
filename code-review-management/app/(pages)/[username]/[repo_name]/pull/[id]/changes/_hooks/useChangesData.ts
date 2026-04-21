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
  } = useListFilesQuery(username, repo_name, id, sha === null);
  useAutoFetchAllPages(hasNextFilesPage, isFilesFetching, fetchNextFilesPage);

  const {
    data: commit,
    hasNextPage: hasNextCommitPage,
    fetchNextPage: fetchNextCommitPage,
    isFetching: isCommitFetching,
    isPending: isCommitPending,
    isError: isCommitError,
  } = useCommitQuery(username, repo_name, sha ?? "", sha !== null);
  useAutoFetchAllPages(
    hasNextCommitPage,
    isCommitFetching,
    fetchNextCommitPage,
  );

  return {
    pull,
    files: sha ? commit?.files : files,
    publishedThreads,
    isPending:
      isPullPending ||
      isPublishedThreadsPending ||
      (sha ? isCommitPending : isFilesPending),
    isError:
      isPullError ||
      isPublishedThreadsError ||
      (sha ? isCommitError : isFilesError),
  };
}
