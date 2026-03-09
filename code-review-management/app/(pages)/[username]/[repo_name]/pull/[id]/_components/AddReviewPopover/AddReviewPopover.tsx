import { ReviewType, useReviewContext } from "../../_contexts/ReviewContext";
import MarkdownEditor from "@components/MarkdownEditor/MarkdownEditor";
import styles from "./AddReviewPopover.module.css";

const REVIEW_TYPE_INPUTS: { type: ReviewType; label: string }[] = [
  { type: "comment", label: "Comment" },
  { type: "approve", label: "Approve" },
  { type: "request-changes", label: "Request changes" },
];

/**
 * Popover to add a review to the pull request.
 */
export default function AddReviewPopover() {
  const { reviewBody, setReviewBody, reviewType, setReviewType } =
    useReviewContext();

  const handleSubmit = (formData: FormData) => {
    console.log(reviewBody);
    console.log(formData.get("review-type"));
  };

  const isReviewBodyEmpty = reviewBody.trim().length === 0;
  const isDisabled = isReviewBodyEmpty && reviewType != "approve";

  return (
    <div className={styles.reviewPopoverContent}>
      <MarkdownEditor
        defaultEditable={true}
        defaultContent={reviewBody}
        onChange={(markdown: string) => {
          setReviewBody(markdown);
        }}
      />
      <form className={styles.reviewTypes} action={handleSubmit}>
        {REVIEW_TYPE_INPUTS.map(({ type, label }) => (
          <label key={type}>
            <input
              type="radio"
              name="review-type"
              value={type!}
              required
              defaultChecked={reviewType === type}
              onChange={() => setReviewType(type)} // Check onChange vs. onClick.
            />
            {label}
          </label>
        ))}
        <button
          type="submit"
          className={`${styles.submit} ${isDisabled ? styles.disabled : ""}`}
          disabled={isDisabled}
        >
          Submit review
        </button>
      </form>
    </div>
  );
}
