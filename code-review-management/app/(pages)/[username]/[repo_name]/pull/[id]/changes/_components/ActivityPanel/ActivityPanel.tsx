import { useState } from "react";
import { useParams } from "next/navigation";
import {
  PublishedThreadItem,
  PublishedThreads,
} from "../../_hooks/usePublishedThreads";
import { FileDiff } from "@/types/github.types";
import { PullParams } from "@/types/routing.types";
import Image from "next/image";
import CancelButton from "@components/CancelButton/CancelButton";
import CommentDiscussionIcon from "@/public/icons/comment_discussion.svg";
import InlinePublishedThread from "../InlinePublishedThread/InlinePublishedThread";
import TimelineDisplay from "../../../_components/TimelineDisplay/TimelineDisplay";
import styles from "./ActivityPanel.module.css";

// Docs: https://stackoverflow.com/a/62900613
const TABS = ["Comments", "Timeline"] as const;
export type ActivityPanelTabs = (typeof TABS)[number];

export default function ActivityPanel({
  publishedThreads,
  flatFileTree,
  isOpen,
  togglePanel,
}: {
  publishedThreads: PublishedThreads;
  flatFileTree: FileDiff[];
  isOpen: boolean;
  togglePanel: () => void;
}) {
  const { username, repo_name, id } = useParams<PullParams>();
  const [activeTab, setActiveTab] = useState<ActivityPanelTabs>("Comments");

  return (
    <div
      className={`${styles.panelWrapper} ${!isOpen ? styles.panelWrapperClosed : ""}`}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          {TABS.map((tab) => (
            <div
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
          <div className={styles.close}>
            <CancelButton
              onClick={() => togglePanel()}
              tooltipContent="Close panel"
              size={13}
            />
          </div>
        </div>
        <div className={styles.body}>
          {activeTab === "Comments" ? (
            <CommentsTab
              publishedThreads={publishedThreads}
              flatFileTree={flatFileTree}
            />
          ) : (
            <div className={styles.timeline} data-view="activity-panel">
              <TimelineDisplay
                username={username}
                repoName={repo_name}
                id={id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentsTab({
  publishedThreads,
  flatFileTree,
}: {
  publishedThreads: PublishedThreads;
  flatFileTree: FileDiff[];
}) {
  const allThreads = [...publishedThreads.values()].flatMap((byGroup) => {
    const lineThreads = [...byGroup.lineThreads.values()].flatMap(
      ({ left, right }) => [...left, ...right],
    );
    return [...byGroup.fileThreads, ...lineThreads];
  });

  allThreads.sort((a, b) => {
    const getIndex = (thread: PublishedThreadItem) =>
      flatFileTree.findIndex(
        (node) =>
          node.filename === thread.path ||
          (node.status === "renamed" && node.previous_filename === thread.path),
      );

    // Sort by file position in the flat file tree.
    const indexA = getIndex(a);
    const indexB = getIndex(b);
    if (indexA !== indexB) return indexA - indexB;

    // For renamed files, put previous filename before new filename.
    const nodeA = flatFileTree[indexA];
    if (nodeA?.status === "renamed") {
      const isOldPathA = a.path === nodeA.previous_filename;
      const isOldPathB = b.path === nodeA.previous_filename;
      if (isOldPathA !== isOldPathB) return isOldPathA ? -1 : 1;
    }

    // Within the same file, put file-level comments first.
    const isFileA = a.subject_type === "file";
    const isFileB = b.subject_type === "file";
    if (isFileA !== isFileB) return isFileA ? -1 : 1;

    // For line-level comments, sort by line number, then side.
    if (!isFileA && !isFileB && a.line && b.line) {
      if (a.line !== b.line) return a.line - b.line;
      if (a.side !== b.side) return a.side === "LEFT" ? -1 : 1;
    }

    // Fallback: sort by creation time.
    return (
      new Date(a.comments[0].created_at).getTime() -
      new Date(b.comments[0].created_at).getTime()
    );
  });

  return (
    <>
      {allThreads.length === 0 ? (
        <div className={styles.emptyCommentsMessage}>
          <Image
            src={CommentDiscussionIcon}
            alt="Comment activity"
            height={24}
            width={24}
          />
          No comments on files yet.
        </div>
      ) : (
        <>
          {allThreads.map((thread) => (
            <div key={`${thread.path}-${thread.id}`} className={styles.thread}>
              <InlinePublishedThread thread={thread} viewType="panel" />
            </div>
          ))}
        </>
      )}
    </>
  );
}
