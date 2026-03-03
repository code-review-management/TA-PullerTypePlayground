import { useDraftRepliesContext } from "../../_contexts/DraftRepliesContext";
import { getDraftReplyKey } from "../../_hooks/useDraftReplies";
import { PublishedThreadItem } from "../../_hooks/usePublishedThreads";
import Image from "next/image";
import styles from "./InlineDraftReplyTrigger.module.css";

export default function InlineDraftReplyTrigger({
  thread,
}: {
  thread: PublishedThreadItem;
}) {
  const { setDraftReplies } = useDraftRepliesContext();
  const draftReplyKey = getDraftReplyKey(thread.path, thread.id);

  const handleCreateDraftReply = () => {
    setDraftReplies((prev) => ({
      ...prev,
      [draftReplyKey]: {
        filename: thread.path,
        parentId: thread.id,
        body: "",
      },
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        {/* TODO: Replace with authenticated user. */}
        <Image src={"/mock/octocat.png"} alt={`@octocat`} fill />
      </div>
      <button className={styles.trigger} onClick={handleCreateDraftReply}>
        Reply
      </button>
    </div>
  );
}
