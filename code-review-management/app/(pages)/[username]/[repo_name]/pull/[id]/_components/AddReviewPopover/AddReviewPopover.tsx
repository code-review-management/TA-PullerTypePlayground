import Image, { StaticImageData } from "next/image";
import { ReviewType, useReviewContext } from "../../_contexts/ReviewContext";
import MarkdownEditor from "@components/MarkdownEditor/MarkdownEditor";
import PopoverContent from "@components/PopoverContent/PopoverContent";
import SubmitButton from "@components/SubmitButton/SubmitButton";
import ReviewApproveIcon from "@/public/icons/review_approve.svg";
import ReviewCommentIcon from "@/public/icons/review_comment.svg";
import ReviewRequestChangesIcon from "@/public/icons/review_request_changes.svg";
import styles from "./AddReviewPopover.module.css";

const REVIEW_TYPE_INPUTS: {
  type: ReviewType;
  label: string;
  icon: StaticImageData;
}[] = [
  { type: "comment", label: "Comment", icon: ReviewCommentIcon },
  { type: "approve", label: "Approve", icon: ReviewApproveIcon },
  { type: "request-changes", label: "Request changes", icon: ReviewRequestChangesIcon },
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
    <PopoverContent>
      <div className={styles.reviewPopoverContent}>
        <MarkdownEditor
          defaultEditable={true}
          defaultContent={reviewBody}
          onChange={(markdown: string) => setReviewBody(markdown)}
        />
        <form className={styles.reviewTypes} action={handleSubmit}>
          {REVIEW_TYPE_INPUTS.map(({ type, label, icon }) => (
            <label key={type}>
              <input
                type="radio"
                name="review-type"
                value={type!}
                required
                defaultChecked={reviewType === type}
                onChange={() => setReviewType(type)}
              />
              <div className={styles.reviewTypeLabelIcon}>
                {label}
                <Image src={icon} alt={type!} />
              </div>
            </label>
          ))}
          <div className={styles.submitReview}>
            <SubmitButton label="Submit review" isDisabled={isDisabled} />
          </div>
        </form>
      </div>
    </PopoverContent>
  );
}
