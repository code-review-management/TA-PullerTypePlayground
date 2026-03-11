import { useState } from "react";
import { PullRequest } from "@/types/github.types";
import AddReviewPopover from "../AddReviewPopover/AddReviewPopover";
import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import MergePopover from "../MergePopover/MergePopover";
import PRHeaderPopoverButton from "../PRHeaderPopoverButton/PRHeaderPopoverButton";

type PRHeaderPopovers = "review" | "merge";

/**
 * Shared action buttons for the PR overview and PR changes page-headers. The
 * view button toggles navigation between the two pages.
 *
 * @param viewHref: Where the view button navigates to.
 * @param viewLabel: What the view button displays.
 */
export default function PRHeaderActions({
  viewHref,
  viewLabel,
  pull,
}: {
  viewHref: string;
  viewLabel: string;
  pull: PullRequest;
}) {
  const [activePopover, setActivePopover] = useState<PRHeaderPopovers | null>(null);
  const togglePopover = (popover: PRHeaderPopovers) => {
    setActivePopover((prev) => (prev === popover ? null : popover));
  };
  const showMergeButton = !pull.merged && pull.state !== "closed";

  return (
    <>
      <HeaderButton href={viewHref} variant="secondary">
        {viewLabel}
      </HeaderButton>
      <PRHeaderPopoverButton
        buttonLabel="Add review"
        buttonVariant="secondary"
        isPopoverOpen={activePopover === "review"}
        popoverContent={<AddReviewPopover />}
        onToggle={() => togglePopover("review")}
      />
      {showMergeButton && (
        <PRHeaderPopoverButton
          buttonLabel="Merge"
          isPopoverOpen={activePopover === "merge"}
          popoverContent={<MergePopover />}
          onToggle={() => togglePopover("merge")}
          // TODO: Also disable if the user does not have appropriate write permissions.
          isDisabled={!pull.mergeable}
          {...(!pull.mergeable && {
            // TODO: Replace with more descriptive message.
            tooltip: "Pull request is not mergable",
          })}
        />
      )}
    </>
  );
}
