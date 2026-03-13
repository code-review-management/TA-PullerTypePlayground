import { MouseEventHandler } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import styles from "./SubmitButton.module.css";

/**
 * A button used for submissions.
 *
 * @param label: Label to display on the button.
 * @param isLabeled: Whether the button is disabled or not.
 * @param isLoading: If true, replaces the button with a loading spinner.
 * @param onClick: Function called when button is clicked.
 */
export default function SubmitButton({
  label,
  isDisabled,
  isLoading,
  onClick,
}: {
  label: string;
  isDisabled: boolean;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className={`${styles.submit} ${isDisabled ? styles.disabled : ""} ${isLoading ? styles.loading : ""}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {label}
      {isLoading && (
        <span className={styles.spinner}>
          <LoadingSpinner />
        </span>
      )}
    </button>
  );
}
