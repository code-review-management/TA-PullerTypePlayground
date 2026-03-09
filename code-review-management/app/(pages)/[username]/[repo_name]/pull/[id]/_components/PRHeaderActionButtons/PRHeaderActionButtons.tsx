import AddReviewButton from "../AddReviewButton/AddReviewButton";
import HeaderButton from "@components/HeaderButton/HeaderButton";

/**
 * Shared action buttons for the PR overview and PR changes page-headers. The
 * view button toggles navigation between the two pages.
 *
 * @param viewHref: Where the view button navigates to.
 * @param viewLabel: What the view button displays.
 */
export default function PRHeaderActionButtons({
  viewHref,
  viewLabel,
}: {
  viewHref: string;
  viewLabel: string;
}) {
  return (
    <>
      <HeaderButton href={viewHref} variant="secondary">
        {viewLabel}
      </HeaderButton>
      <AddReviewButton />
      <HeaderButton>Merge</HeaderButton>
    </>
  );
}
