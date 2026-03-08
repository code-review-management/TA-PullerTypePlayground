import { useRef, useState } from "react";
import { Popover } from "react-tiny-popover";
import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import styles from "./AddReviewButton.module.css";

export default function AddReviewButton() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover
      isOpen={true} // Do not unmount the component, but use CSS to hide it instead.
      positions={["bottom"]}
      content={
        <div style={!isPopoverOpen ? { display: "none" } : undefined}>
          <AddReviewPopover />
        </div>
      }
      containerClassName={styles.popoverContainer}
    >
      <div className={isPopoverOpen ? styles.buttonEnabled : ""}>
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
  const reviewTextRef = useRef("");

  const submitReview = (formData: FormData) => {
    console.log(reviewTextRef.current);
    console.log(formData.get("review-type"));
  };

  return (
    <div className={styles.popoverContent}>
      <MarkdownEditor
        defaultEditable={true}
        onChange={(markdown: string) => {
          reviewTextRef.current = markdown;
        }}
      />
      <form className={styles.reviewTypes} action={submitReview}>
        <label>
          <input type="radio" name="review-type" id="comment" value="comment" required />
          Comment
        </label>
        <label>
          <input type="radio" name="review-type" id="approve" value="approve" required />
          Approve
        </label>
        <label>
          <input type="radio" name="review-type" id="request-changes" value="request-changes" required />
          Request changes
        </label>
        <button type="submit" className={styles.submit}>
          Submit review
        </button>
      </form>
    </div>
  );
}
