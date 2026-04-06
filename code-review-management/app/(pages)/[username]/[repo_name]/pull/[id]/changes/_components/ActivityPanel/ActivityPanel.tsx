import { PublishedThreads } from "../../_hooks/usePublishedThreads";
import InlinePublishedThread from "../InlinePublishedThread/InlinePublishedThread";
import styles from "./ActivityPanel.module.css";

/**
 * TODO: Message if comment list is empty.
 */
export default function ActivityPanel({
  publishedThreads,
}: {
  publishedThreads: PublishedThreads;
}) {
  const allThreads = [...publishedThreads.values()]
    .flatMap((byLine) => [...byLine.values()])
    .flatMap(({ left, right }) => [...left.values(), ...right.values()]);

  return (
    <div className={styles.panel}>
      {allThreads.map((thread) => {
        return (
          <div key={`${thread.path}-${thread.id}`} className={styles.thread}>
            <InlinePublishedThread thread={thread} />
          </div>
        );
      })}
    </div>
  );
}
