import { PublishedThreads } from "../../_hooks/usePublishedThreads";
import Image from "next/image";
import InlinePublishedThread from "../InlinePublishedThread/InlinePublishedThread";
import styles from "./ActivityPanel.module.css";

export default function ActivityPanel({
  publishedThreads,
  isOpen,
}: {
  publishedThreads: PublishedThreads;
  isOpen: boolean;
}) {
  const allThreads = [...publishedThreads.values()]
    .flatMap((byLine) => [...byLine.values()])
    .flatMap(({ left, right }) => [...left.values(), ...right.values()]);

  return (
    <div
      className={`${styles.panelWrapper} ${!isOpen ? styles.panelWrapperClosed : ""}`}
    >
      <div className={styles.panel}>
        <div className={styles.tabs}>
          <div className={styles.tab}>Comments</div>
          <div className={styles.tab}>Timeline</div>
        </div>
        {allThreads.length === 0 ? (
          <div className={styles.emptyCommentsMessage}>
            <Image
              src="/icons/comment_discussion.svg"
              alt="Comment discussion"
              height={24}
              width={24}
            />
            No comments on files yet.
          </div>
        ) : (
          <div className={styles.threads}>
            {allThreads.map((thread) => {
              return (
                <div
                  key={`${thread.path}-${thread.id}`}
                  className={styles.thread}
                >
                  <InlinePublishedThread thread={thread} viewType="panel" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
