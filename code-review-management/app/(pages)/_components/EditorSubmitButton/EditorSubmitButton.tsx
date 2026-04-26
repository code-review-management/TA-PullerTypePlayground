import styles from "./EditorSubmitButton.module.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Image from "next/image";
import ArrowUpIcon from "@/public/icons/arrow_up.svg";

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
