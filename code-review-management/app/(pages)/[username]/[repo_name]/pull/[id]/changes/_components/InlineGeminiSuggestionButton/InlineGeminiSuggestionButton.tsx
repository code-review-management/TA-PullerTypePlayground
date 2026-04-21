import { PublishedThreadItem } from "../../_hooks/usePublishedThreads";
import { ThreadSuggestionRequest } from "@/types/request.types";
import styles from "./InlineGeminiSuggestionButton.module.css";
import { useParams } from "next/navigation";
import { PullParams } from "@/types/routing.types";
import { useGeminiSuggestionMutation } from "@/lib/api/mutations/useGeminiSuggestionMutation";
import Image from "next/image";

export default function InlineGeminiSuggestionButton({
  thread,
}: {
  thread: PublishedThreadItem;
}) {
  const { username, repo_name, id } = useParams<PullParams>();
  const { mutate, isPending } = useGeminiSuggestionMutation(
    username,
    repo_name,
    id,
    thread.id,
  );

  const handleCallGeminiSuggestion = () => {
    if (isPending) return;

    let line: number;
    if (thread.start_line !== null) {
      line = thread.start_line;
    } else if (thread.start_line === null && thread.line !== null) {
      line = thread.line;
    } else {
      return;
    }

    const requestParams: ThreadSuggestionRequest = {
      id: thread.id,
      filePath: thread.path,
      side: thread.side,
      line: line,
      sha: thread.comments[0].commit_id,
      comments: thread.comments,
    };

    mutate(requestParams);
  };

  return (
    <button
      className={styles.suggestionButton}
      onClick={handleCallGeminiSuggestion}
    >
      <span>{isPending ? "Pending..." : "Suggest"}</span>
      <Image
        src="/icons/ai_star.png"
        alt="AI Star"
        className={styles.buttonIcon}
      />
    </button>
  );
}
