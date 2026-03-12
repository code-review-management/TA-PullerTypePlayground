import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useReviewContext } from "../../_contexts/ReviewContext";
import { useCreateReviewMutation } from "@/lib/api/mutations/useCreateReviewMutation";
import { useMutationInFlight } from "@/lib/api/hooks/useMutationInFlight";
import { CreateReviewRequest } from "@/types/request.types";
import { PullParams } from "@/types/routing.types";
import { PullRequest } from "@/types/github.types";
import Image, { StaticImageData } from "next/image";
import MarkdownEditor from "@components/MarkdownEditor/MarkdownEditor";
import PopoverContent from "@components/PopoverContent/PopoverContent";
import SubmitButton from "@components/SubmitButton/SubmitButton";
import RadioGroup, { RadioOption } from "@components/RadioGroup/RadioGroup";
import ReviewApproveIcon from "@/public/icons/review_approve.svg";
import ReviewCommentIcon from "@/public/icons/review_comment.svg";
import ReviewRequestChangesIcon from "@/public/icons/review_request_changes.svg";
import styles from "./AddReviewPopover.module.css";

const REVIEW_TYPE_INPUTS: {
  type: CreateReviewRequest["event"];
  label: string;
  icon: StaticImageData;
}[] = [
  { type: "COMMENT", label: "Comment", icon: ReviewCommentIcon },
  { type: "APPROVE", label: "Approve", icon: ReviewApproveIcon },
  { type: "REQUEST_CHANGES", label: "Request changes", icon: ReviewRequestChangesIcon },
];

/**
 * Popover to add a review to the pull request.
 */
export default function AddReviewPopover({
  pull,
  togglePopover,
}: {
  pull: PullRequest;
  togglePopover: () => void;
}) {
  const { username, repo_name, id } = useParams<PullParams>();
  const { mutate } = useCreateReviewMutation(username, repo_name, id);
  const { reviewBody, setReviewBody, reviewType, setReviewType } = useReviewContext();
  const { data: session } = useSession();

  const handleSubmit = () => {
    mutate(
      {
        event: reviewType,
        body: reviewBody,
      },
      {
        onSuccess: () => {
          togglePopover();
          setReviewType("COMMENT"); // Reset review context.
          setReviewBody("");
        },
      },
    );
  };

  const isReviewPending = useMutationInFlight({
    mutationKey: ["create-review", username, repo_name, id],
  });

  const isReviewBodyEmpty = reviewBody.trim().length === 0;
  const isDisabled = isReviewBodyEmpty && reviewType != "APPROVE";
  const isAuthor = pull.user?.id === session?.user?.githubId;

  const reviewRadioOptions: RadioOption<CreateReviewRequest["event"]>[] =
    REVIEW_TYPE_INPUTS.map(({ type, label, icon }) => {
      const cannotSelfReview = type !== "COMMENT" && isAuthor;
      return {
        value: type,
        label: (
          <div className={styles.reviewTypeLabel}>
            {label}
            <Image src={icon} alt={type} />
          </div>
        ),
        disabled: cannotSelfReview,
        ...(cannotSelfReview && {
          tooltip: `PR author cannot ${label.toLowerCase()}`,
        }),
      };
    });

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
          <SubmitButton
            label="Submit review"
            isDisabled={isDisabled}
            isLoading={isReviewPending}
          />
        </div>
      </form>
    </PopoverContent>
  );
}
