import Image, { StaticImageData } from "next/image";
import { ReviewType, useReviewContext } from "../../_contexts/ReviewContext";
import MarkdownEditor from "@components/MarkdownEditor/MarkdownEditor";
import PopoverContent from "@components/PopoverContent/PopoverContent";
import SubmitButton from "@components/SubmitButton/SubmitButton";
import RadioGroup, { RadioOption } from "@components/RadioGroup/RadioGroup";
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

  const handleSubmit = () => {
    console.log(reviewBody);
    console.log(reviewType);
  };

  const isReviewBodyEmpty = reviewBody.trim().length === 0;
  const isDisabled = isReviewBodyEmpty && reviewType != "approve";
  const reviewRadioOptions: RadioOption<ReviewType>[] = REVIEW_TYPE_INPUTS.map(
    ({ type, label, icon }) => ({
      value: type,
      label: (
        <div className={styles.reviewTypeLabel}>
          {label}
          <Image src={icon} alt={type} />
        </div>
      ),
    }),
  );

  return (
    <PopoverContent>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <MarkdownEditor
          defaultEditable={true}
          defaultContent={reviewBody}
          onChange={(markdown: string) => setReviewBody(markdown)}
        />
        <RadioGroup
          name="review-type"
          options={reviewRadioOptions}
          selected={reviewType}
          onChange={(type) => setReviewType(type)}
        />
        <div className={styles.submit}>
          <SubmitButton label="Submit review" isDisabled={isDisabled} />
        </div>
      </form>
    </PopoverContent>
  );
}
