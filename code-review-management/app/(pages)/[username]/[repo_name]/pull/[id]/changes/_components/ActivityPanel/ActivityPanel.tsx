import { useState } from "react";
import { PublishedThreads } from "../../_hooks/usePublishedThreads";
import Image from "next/image";
import CancelButton from "@components/CancelButton/CancelButton";
import CommentDiscussionIcon from "@/public/icons/comment_discussion.svg";
import InlinePublishedThread from "../InlinePublishedThread/InlinePublishedThread";
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
  const [activeTab, setActiveTab] = useState<ActivityPanelTabs>("Comments");
  const allThreads = [...publishedThreads.values()]
    .flatMap((byLine) => [...byLine.values()])
    .flatMap(({ left, right }) => [...left.values(), ...right.values()]);

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
          <div className={styles.threads}>
            {allThreads.map((thread) => (
              <div
                key={`${thread.path}-${thread.id}`}
                className={styles.thread}
              >
                <InlinePublishedThread thread={thread} viewType="panel" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
