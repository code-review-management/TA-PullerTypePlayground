"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";
import { PullParams } from "@/types/routing.types";
import { useDraftReplies } from "./_hooks/useDraftReplies";
import { useDraftThreads } from "./_hooks/useDraftThreads";
import { usePublishedThreads } from "./_hooks/usePublishedThreads";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import { useListFilesQuery } from "@/lib/api/queries/useListFilesQuery";
import { buildFileTree, flattenFileTree } from "./_utils/filetree-utils";
import ActivityPanel from "./_components/ActivityPanel/ActivityPanel";
import DraftRepliesContext from "./_contexts/DraftRepliesContext";
import DraftThreadsContext from "./_contexts/DraftThreadsContext";
import DiffListView from "./_components/DiffListView/DiffListView";
import FileTree from "./_components/FileTree/FileTree";
import IconTooltip from "@components/IconTooltip/IconTooltip";
import PRChangesHeader from "./_components/PRChangesHeader/PRChangesHeader";
import styles from "./page.module.css";

export default function Changes() {
  const { username, repo_name, id } = useParams<PullParams>();
  const { draftReplies, setDraftReplies } = useDraftReplies();
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
    hasNextPage: hasNextFilesPage,
    fetchNextPage: fetchNextFilesPage,
    isFetching: isFilesFetching,
    isPending: isFilesPending,
    isError: isFilesError,
  } = useListFilesQuery(username, repo_name, id);
  useAutoFetchAllPages(hasNextFilesPage, isFilesFetching, fetchNextFilesPage);

  const fileTree = useMemo(() => buildFileTree(files ?? []), [files]);
  const flatFileTree = useMemo(() => flattenFileTree(fileTree), [fileTree]);

  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
  const toggleActivityPanel = () => setIsActivityPanelOpen((prev) => !prev);

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
    <DraftRepliesContext value={{ draftReplies, setDraftReplies }}>
      <DraftThreadsContext value={{ draftThreads, setDraftThreads }}>
        <div className={styles.page}>
          <div className={styles.pageBody}>
            <div className={styles.bodyMain}>
              <PRChangesHeader
                pull={pull}
                isActivityPanelOpen={isActivityPanelOpen}
                toggleActivityPanel={toggleActivityPanel}
              />
              <div
                className={`${styles.changes} ${isActivityPanelOpen ? styles.changesWithPanel : ""}`}
              >
                <IconTooltip id="file-tree-row-tooltip" />
                <FileTree fileTree={fileTree} />
                <DiffListView
                  flatFileTree={flatFileTree}
                  // Use non-null assertion since threads are defined if not in pending/error state.
                  publishedThreads={publishedThreads!}
                />
              </div>
            </div>
            <ActivityPanel
              publishedThreads={publishedThreads!}
              isOpen={isActivityPanelOpen}
              togglePanel={toggleActivityPanel}
            />
          </div>
        </div>
      </DraftThreadsContext>
    </DraftRepliesContext>
  );
}
