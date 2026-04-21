"use client";

import { useMemo, useState } from "react";
import { useChangesData } from "./_hooks/useChangesData";
import { useDraftReplies } from "./_hooks/useDraftReplies";
import { useDraftThreads } from "./_hooks/useDraftThreads";
import { buildFileTree, flattenFileTree } from "./_utils/filetree-utils";
import ActivityPanel from "./_components/ActivityPanel/ActivityPanel";
import CommitPickerProvider from "../_contexts/CommitPickerContext";
import CommitViewBanner from "./_components/CommitViewBanner/CommitViewBanner";
import DraftRepliesContext from "./_contexts/DraftRepliesContext";
import DraftThreadsContext from "./_contexts/DraftThreadsContext";
import DiffListView from "./_components/DiffListView/DiffListView";
import FileTree from "./_components/FileTree/FileTree";
import PRChangesHeader from "./_components/PRChangesHeader/PRChangesHeader";
import styles from "./page.module.css";

export default function Changes() {
  const { draftReplies, setDraftReplies } = useDraftReplies();
  const { draftThreads, setDraftThreads } = useDraftThreads();

  const { pull, files, publishedThreads, sha, isPending, isError } =
    useChangesData();

  const fileTree = useMemo(() => buildFileTree(files ?? []), [files]);
  const flatFileTree = useMemo(() => flattenFileTree(fileTree), [fileTree]);

  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
  const toggleActivityPanel = () => setIsActivityPanelOpen((prev) => !prev);

  /**
   * TODO: Replace with proper loading/error UI. Move to affected sections
   * instead of returning at the page-level.
   */
  if (isPending) return <div>Loading changes...</div>;
  if (isError) return <div>Failed to load changes.</div>;

  return (
    <CommitPickerProvider>
      <DraftRepliesContext value={{ draftReplies, setDraftReplies }}>
        <DraftThreadsContext value={{ draftThreads, setDraftThreads }}>
          <div className={styles.page}>
            <div className={styles.pageBody}>
              <div className={styles.bodyMain}>
                <PRChangesHeader
                  pull={pull!}
                  isActivityPanelOpen={isActivityPanelOpen}
                  toggleActivityPanel={toggleActivityPanel}
                />
                <div
                  className={`${styles.changes} ${isActivityPanelOpen ? styles.changesWithPanel : ""}`}
                >
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
            {sha && <CommitViewBanner sha={sha} />}
          </div>
        </DraftThreadsContext>
      </DraftRepliesContext>
    </CommitPickerProvider>
  );
}
