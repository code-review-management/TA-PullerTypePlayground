import styles from "./SubmitButton.module.css";

/**
 * A button used for submission.
 *
 * @param label: Label to display on the button
 * @param isLabeled: Whether the button is disabled or not.
 */
export default function SubmitButton({
  label,
  isDisabled,
}: {
  label: string;
  isDisabled: boolean;
}) {
  return (
    <button
      className={`${styles.submit} ${isDisabled ? styles.disabled : ""}`}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
}
