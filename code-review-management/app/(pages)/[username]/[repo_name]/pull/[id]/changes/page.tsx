"use client";

import { useParams } from "next/navigation";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";
import { PullParams } from "@/types/routing.types";
import { useDraftThreads } from "./_hooks/useDraftThreads";
import { usePublishedThreads } from "./_hooks/usePublishedThreads";
import { useListFilesQuery } from "@/lib/api/queries/useListFilesQuery";
import DraftThreadsContext from "./_contexts/DraftThreadsContext";
import DiffListView from "./_components/DiffListView/DiffListView";
import FileTree from "./_components/FileTree/FileTree";
import styles from "./page.module.css";

export default function Changes() {
  const { username, repo_name, id } = useParams<PullParams>();
  const { draftThreads, setDraftThreads } = useDraftThreads();
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
    isPending: isFilesPending,
    isError: isFilesError,
  } = useListFilesQuery(username, repo_name, id);

  /**
   * TODO: Replace with proper loading/error UI. Move to affected sections
   * instead of returning at the page-level.
   */
  if (isPullPending || isFilesPending || isPublishedThreadsPending) {
    return <div>Loading changes...</div>;
  }
  if (isPullError || isFilesError || isPublishedThreadsError) {
    return <div>Failed to load changes.</div>;
  }
  return (
    <DraftThreadsContext value={{ draftThreads, setDraftThreads }}>
      <div className={styles.page}>
        <h1>{pull.title}</h1>
        <div className={styles.changes}>
          <FileTree files={files} />
          {/* Use non-null assertion since threads are defined if not in pending/error state */}
          <DiffListView publishedThreads={publishedThreads!} />
        </div>
      </div>
    </DraftThreadsContext>
  );
}
