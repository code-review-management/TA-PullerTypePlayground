import refractor from "refractor";
import { useMemo, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import {
  Decoration,
  Diff,
  FileData,
  GutterOptions,
  Hunk,
  HunkData,
  tokenize,
  ViewType,
} from "react-diff-view";

import { useDraftThreadsContext } from "../../_contexts/DraftThreadsContext";
import { useHighlight } from "../../_hooks/useHighlight";
import { PublishedThreadsByLine } from "../../_hooks/usePublishedThreads";
import { getActivePath, getLanguage } from "../../_utils/diff-utils";
import { getWidgets } from "../../_utils/widget-utils";
import ClearHighlightContext from "../../_contexts/ClearHighlightContext";
import FileDiffHeader from "../FileDiffHeader/FileDiffHeader";
import Gutter from "../Gutter/Gutter";

import styles from "./FileDiffView.module.css";
import "prism-color-variables/variables.css";
import "react-diff-view/style/index.css";
import "./ReactDiffView.css";

/**
 * Docs:
 * 1. https://github.com/otakustay/react-diff-view?tab=readme-ov-file#render-diff-hunks
 */

export default function FileDiffView({
  oldPath,
  newPath,
  diffType,
  viewType,
  hunks,
  publishedThreadsByLine,
}: {
  oldPath: string;
  newPath: string;
  diffType: FileData["type"];
  viewType: ViewType;
  hunks: HunkData[];
  publishedThreadsByLine: PublishedThreadsByLine;
}) {
  const activePath = getActivePath(diffType, oldPath, newPath);
  const { draftThreads, setDraftThreads } = useDraftThreadsContext();
  const { activeHighlight, highlightEvents, clearHighlight } = useHighlight(
    activePath,
    setDraftThreads,
  );
  const [isExpanded, setIsExpanded] = useState(true);

  // Use memoization to reduce lag while highlighting.
  const tokens = useMemo(
    () =>
      tokenize(hunks, {
        highlight: true,
        refractor: refractor,
        language: getLanguage(activePath),
      }),
    [activePath, hunks],
  );

  // Use memoization to avoid re-calculations of widgets while highlighting.
  const widgets = useMemo(
    () => getWidgets(activePath, hunks, publishedThreadsByLine, draftThreads),
    [activePath, hunks, publishedThreadsByLine, draftThreads],
  );

  const renderGutter = ({ change, side, renderDefault }: GutterOptions) => (
    <Gutter
      change={change}
      side={side}
      renderDefault={renderDefault}
      activeHighlight={activeHighlight}
    />
  );

  return (
    <ClearHighlightContext value={{ clearHighlight }}>
      <div
        className={`${styles.fileDiffView} ${activeHighlight.isHighlighting ? styles.isHighlighting : ""}`}
        id={`file-${activePath}`}
      >
        <FileDiffHeader
          diffType={diffType}
          oldPath={oldPath}
          newPath={newPath}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        <div className={!isExpanded ? styles.collapsed : ""}>
          <Diff
            viewType={viewType}
            diffType={diffType}
            hunks={hunks}
            tokens={tokens}
            widgets={widgets}
            renderGutter={renderGutter}
            gutterEvents={highlightEvents}
          >
            {(hunks) =>
              hunks.map((hunk) => (
                <Fragment key={hunk.content}>
                  <Decoration>{hunk.content}</Decoration>
                  <Hunk hunk={hunk} />
                </Fragment>
              ))
            }
          </Diff>
        </div>
      </div>
    </ClearHighlightContext>
  );
}
