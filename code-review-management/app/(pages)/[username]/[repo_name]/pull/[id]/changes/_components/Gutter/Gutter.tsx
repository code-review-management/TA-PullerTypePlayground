import { ReactNode } from "react";
import { ChangeData } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";
import { ActiveHighlight } from "../../_hooks/useHighlight";
import { getLineNumber } from "../../_utils/diff-utils";
import { isWithinHighlightRange } from "../../_utils/highlight-utils";

/**
 * Gutter that contains the line numbers in the diff view. Dynamically sets
 * classname if gutter is currently highlighted.
 *
 * Docs: https://www.npmjs.com/package/react-diff-view#customize-gutter
 *
 * @param change: `Change` object containing data about the line associated with the gutter.
 * @param side: Side of the gutter ("old" or "new").
 * @param renderDefault: Default render function provided by react-diff-view, which returns line number if possible.
 * @param activeHighlight: State of the active highlight in the file diff.
 */
export default function Gutter({
  change,
  side,
  renderDefault,
  activeHighlight,
  isHighlightDisabled,
}: {
  change: ChangeData;
  side: Side;
  renderDefault: () => ReactNode;
  activeHighlight: ActiveHighlight;
  isHighlightDisabled?: boolean;
}) {
  const line = getLineNumber(change, side);
  const isHighlighted =
    !isHighlightDisabled && isWithinHighlightRange(line, side, activeHighlight);

  return (
    // Do not use CSS module for "diff-gutter-highlighted" class, so we can
    // access it in ReactDiffView.css when overriding react-diff-view styling.
    <div
      className={`${isHighlighted ? "diff-gutter-highlighted" : ""} ${isHighlightDisabled ? "diff-gutter-highlight-disabled" : ""}`}
    >
      {renderDefault()}
    </div>
  );
}
