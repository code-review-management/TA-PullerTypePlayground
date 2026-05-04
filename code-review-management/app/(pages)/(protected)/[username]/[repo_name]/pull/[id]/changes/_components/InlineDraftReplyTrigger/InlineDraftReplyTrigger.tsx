import { useSession } from "next-auth/react";
import { useDraftRepliesContext } from "../../_contexts/DraftRepliesContext";
import { getDraftReplyKey } from "../../_hooks/useDraftReplies";
import { PublishedThreadItem } from "../../_hooks/usePublishedThreads";
import UserIcon from "@components/UserIcon/UserIcon";
import styles from "./InlineDraftReplyTrigger.module.css";

/**
 * Displays a button for the user to reply to a published thread.
 *
 * @param thread: `PublishedThreadItem` object containing data about the published thread.
 */
export default function InlineDraftReplyTrigger({
  thread,
}: {
  thread: PublishedThreadItem;
}) {
  const { data: session } = useSession();
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
      <UserIcon
        avatarUrl={session?.user.image ?? "/mock/octocat.png"}
        username={session?.user.githubLogin ?? ""}
        size={22}
      />
      <button className={styles.trigger} onClick={handleCreateDraftReply}>
        Reply
      </button>
    </div>
  );
}
