import styles from "./EditorSubmitButton.module.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Image from "next/image";
import ArrowUpIcon from "@/public/icons/arrow_up.svg";

/**
 * Renders the action buttons for a text input. Displays a publish
 * button that submits the current text content. The button is disabled when the editor
 * content is empty, contains only whitespace, or when the pull request data is
 * still pending.
 *
 * @param isSubmitPending Content from this editor is currently being submitted.
 * @param isDisabled Indicates that the button should be visible, but disabled.
 * @param handleSubmit Callback on button press.
 */
export default function EditorSubmitButton({
  isSubmitPending,
  isDisabled,
  handleSubmit,
}: {
  isSubmitPending: boolean;
  isDisabled: boolean;
  handleSubmit: () => void;
}) {
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
