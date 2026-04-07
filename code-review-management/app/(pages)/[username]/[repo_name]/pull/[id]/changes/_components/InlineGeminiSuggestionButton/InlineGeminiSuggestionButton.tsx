import { useSession } from "next-auth/react";
import { useDraftRepliesContext } from "../../_contexts/DraftRepliesContext";
import { getDraftReplyKey } from "../../_hooks/useDraftReplies";
import { PublishedThreadItem } from "../../_hooks/usePublishedThreads";
import { ThreadSuggestionRequest } from "@/types/request.types";
import styles from "./InlineGeminiSuggestionButton.module.css";

export default function InlineGeminiSuggestionButton({
  thread,
}: {
  thread: PublishedThreadItem;
}) {
  const { data: session } = useSession();
  const { setDraftReplies } = useDraftRepliesContext();
  const draftReplyKey = getDraftReplyKey(thread.path, thread.id);

  const handleCallGeminiSuggestion = () => {
    if (thread.start_line === null){
      return;
    }

    const requestParams: ThreadSuggestionRequest = {
      id: thread.id,
      filePath: thread.path,
      side: thread.side,
      line: thread.start_line,
      sha: thread.comments[0].commit_id,
      comments: thread.comments,
    }

    fetch(`/api/v1/${thread.owner}/${thread.repo}/pulls/suggest`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestParams),
      });
   };

  return (
    <button 
    className={styles.suggestionButton}
    onClick={handleCallGeminiSuggestion}>
      <span>Suggest</span>
      <img 
          src="/ai_star.png" 
          alt="AI Star" 
          className={styles.buttonIcon}
      />
    </button>
  );
}