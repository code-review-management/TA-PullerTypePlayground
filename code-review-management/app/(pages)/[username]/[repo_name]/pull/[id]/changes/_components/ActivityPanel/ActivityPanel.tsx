import { useState } from "react";
import { useParams } from "next/navigation";
import { PublishedThreads } from "../../_hooks/usePublishedThreads";
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
  isOpen,
  togglePanel,
}: {
  publishedThreads: PublishedThreads;
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
            <CommentsTab publishedThreads={publishedThreads} />
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
}: {
  publishedThreads: PublishedThreads;
}) {
  const allThreads = [...publishedThreads.values()]
    .flatMap((byLine) => [...byLine.values()])
    .flatMap(({ left, right }) => [...left.values(), ...right.values()]);

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
