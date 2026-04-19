import { PullParams } from "@/types/routing.types";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import { useListFilesQuery } from "@/lib/api/queries/useListFilesQuery";
import { useParams } from "next/navigation";
import { usePublishedThreads } from "./usePublishedThreads";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";

export function useChangesData() {
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

  return {
    pull,
    files,
    publishedThreads,
    isPending: isPullPending || isFilesPending || isPublishedThreadsPending,
    isError: isPullError || isFilesError || isPublishedThreadsError,
  };
}
