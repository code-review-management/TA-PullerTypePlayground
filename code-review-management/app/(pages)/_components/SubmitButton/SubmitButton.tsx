import { MouseEventHandler } from "react";
import styles from "./SubmitButton.module.css";

/**
 * A button used for submissions.
 *
 * @param label: Label to display on the button.
 * @param isLabeled: Whether the button is disabled or not.
 * @param onClick: Function called when button is clicked.
 */
export default function SubmitButton({
  label,
  isDisabled,
  onClick,
}: {
  label: string;
  isDisabled: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className={`${styles.submit} ${isDisabled ? styles.disabled : ""}`}
      disabled={isDisabled}
      onClick={onClick ?? undefined}
    >
      {label}
    </button>
  );
}
