import Image from "next/image";
import ArrowUpIcon from "@/public/icons/arrow_up.svg";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import { useParams } from "next/navigation";
import { PullParams } from "@/types/routing.types";
import styles from "./DraftEditorActions.module.css";

/**
 * Renders the action buttons for a the discussion box. Displays a publish
 * button that submits the current comment. The button is disabled when the editor
 * content is empty, contains only whitespace, or when the pull request data is
 * still pending.
 *
 */
export default function DiscussionBoxActions({ content }: { content: string }) {
  const { username, repo_name, id } = useParams<PullParams>();
  const handleSubmit = () => {}; // TODO: modify
  const isSubmitPending = false; // TODO: remove
  const isPullPending = false; // TODO: remove

  const isContentBlank = content.trim().length === 0;
  const isDisabled = isContentBlank || isPullPending;
  // TODO: Display toast error message on submit or pulls error.

  return (
    <>
      {isSubmitPending ? (
        <LoadingSpinner />
      ) : (
        <button
          className={`${styles.submit} ${isDisabled ? styles.disabled : ""}`}
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          <Image src={ArrowUpIcon} alt="Arrow up" />
        </button>
      )}
    </>
  );
}
