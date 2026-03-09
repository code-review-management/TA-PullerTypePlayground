import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import AddReviewButton from "../AddReviewButton/AddReviewButton";

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
