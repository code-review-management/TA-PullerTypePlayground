import { useState } from "react";
import AddReviewPopover from "../AddReviewPopover/AddReviewPopover";
import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import PopoverContent from "@/app/(pages)/_components/PopoverContent/PopoverContent";
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
}: {
  viewHref: string;
  viewLabel: string;
}) {
  const [activePopover, setActivePopover] = useState<PRHeaderPopovers | null>(null);
  const togglePopover = (popover: PRHeaderPopovers) => {
    setActivePopover((prev) => (prev === popover ? null : popover));
  };

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
      <PRHeaderPopoverButton
        buttonLabel="Merge"
        isPopoverOpen={activePopover === "merge"}
        popoverContent={
          <PopoverContent>Temporary merge popover</PopoverContent>
        }
        onToggle={() => togglePopover("merge")}
      />
    </>
  );
}
