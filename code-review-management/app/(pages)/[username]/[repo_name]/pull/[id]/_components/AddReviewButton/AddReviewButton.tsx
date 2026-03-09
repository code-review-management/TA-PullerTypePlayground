import { useState } from "react";
import { ReviewType, useReviewContext } from "../../_contexts/ReviewContext";
import { Popover } from "react-tiny-popover";
import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import styles from "./AddReviewButton.module.css";

const REVIEW_TYPE_INPUTS: { type: ReviewType; label: string }[] = [
  { type: "comment", label: "Comment" },
  { type: "approve", label: "Approve" },
  { type: "request-changes", label: "Request changes" },
];

export default function AddReviewButton() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["bottom"]}
      content={<AddReviewPopover />}
      containerClassName={styles.reviewPopoverContainer}
    >
      <div className={isPopoverOpen ? styles.reviewButtonEnabled : ""}>
        <HeaderButton
          onClick={() => setIsPopoverOpen((prev) => !prev)}
          variant="secondary"
        >
          Add review
        </HeaderButton>
      </div>
    </Popover>
  );
}

function AddReviewPopover() {
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
              // Check onChange vs. onClick.
              onChange={() => setReviewType(type)}
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
