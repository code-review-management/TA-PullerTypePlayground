import { useState } from "react";
import { Popover } from "react-tiny-popover";
import AddReviewPopover from "../AddReviewPopover/AddReviewPopover";
import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import styles from "./AddReviewButton.module.css";

/**
 * Header button to add a review to the pull request. Displays a popover when
 * clicked.
 */
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
