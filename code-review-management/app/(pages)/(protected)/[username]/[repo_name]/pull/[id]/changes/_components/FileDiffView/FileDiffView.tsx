import refractor from "refractor";
import {
  Dispatch,
  memo,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { Fragment } from "react/jsx-runtime";
import {
  Decoration,
  Diff,
  FileData,
  GutterOptions,
  Hunk,
  tokenize,
  ViewType,
} from "react-diff-view";

import { DraftThreads, DraftThreadsByLine } from "../../_hooks/useDraftThreads";
import { useHighlight } from "../../_hooks/useHighlight";
import { PublishedThreadsByScope } from "../../_hooks/usePublishedThreads";
import { useScrollToId } from "../../_hooks/useScrollToId";
import { createDraftThread } from "../../_utils/comment-utils";
import { getActivePath, getLanguage } from "../../_utils/diff-utils";
import { getWidgets } from "../../_utils/widget-utils";
import { FileDiff } from "@/types/github.types";
import { ThreadList } from "../InlineThreadList/InlineThreadList";
import ClearHighlightContext from "../../_contexts/ClearHighlightContext";
import EmptyDiff from "../EmptyDiff/EmptyDiff";
import FileDiffHeader from "../FileDiffHeader/FileDiffHeader";
import Gutter from "../Gutter/Gutter";
import LoadRemovedFile from "../LoadRemovedFile/LoadRemovedFile";

import styles from "./FileDiffView.module.css";
import "prism-color-variables/variables.css";
import "react-diff-view/style/index.css";
import "./ReactDiffView.css";

/**
 * Docs:
 * 1. https://github.com/otakustay/react-diff-view?tab=readme-ov-file#render-diff-hunks
 */

export default memo(function FileDiffView({
  diff,
  fileMeta,
  viewType,
  publishedThreads,
  draftThreadsByLine,
  setDraftThreads,
  isCommitView,
  isExpandedDefault,
}: {
  diff: FileData;
  fileMeta?: FileDiff;
  viewType: ViewType;
  publishedThreads: PublishedThreadsByScope;
  draftThreadsByLine: DraftThreadsByLine | undefined; // Undefined when there are no draft threads in the current file.
  setDraftThreads: Dispatch<SetStateAction<DraftThreads>>;
  isCommitView: boolean;
  isExpandedDefault: boolean;
}) {
  const { type: diffType, oldPath, newPath, hunks } = diff;
  const activePath = getActivePath(diffType, oldPath, newPath);
  const { activeHighlight, highlightEvents, clearHighlight } = useHighlight(
    oldPath,
    activePath,
    fileMeta?.status ?? "",
    setDraftThreads,
    isCommitView,
  );

  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);
  const [isDiffLoaded, setIsDiffLoaded] = useState(
    fileMeta?.status !== "removed",
  );
  const fileDiffRef = useRef<HTMLDivElement>(null);
  const { scrollToId } = useScrollToId(activePath, setIsExpanded, fileDiffRef);

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
  const widgets = useMemo(() => {
    if (isCommitView) return;
    return getWidgets(
      activePath,
      hunks,
      publishedThreads.lineThreads,
      draftThreadsByLine ?? {},
    );
  }, [
    isCommitView,
    activePath,
    hunks,
    publishedThreads.lineThreads,
    draftThreadsByLine,
  ]);

  const renderGutter = ({ change, side, renderDefault }: GutterOptions) => (
    <Gutter
      change={change}
      side={side}
      renderDefault={renderDefault}
      activeHighlight={activeHighlight}
      isHighlightDisabled={isCommitView}
    />
  );

  const hasFileLevelThreads =
    publishedThreads.fileThreads.length > 0 ||
    draftThreadsByLine?.["file-level"];

  return (
    <ClearHighlightContext value={{ clearHighlight }}>
      <div
        ref={fileDiffRef}
        className={`${styles.fileDiffView} ${activeHighlight.isHighlighting ? styles.isHighlighting : ""}`}
        id={`file-${activePath}`}
      >
        <FileDiffHeader
          fileMeta={fileMeta}
          diffType={diffType}
          oldPath={oldPath}
          newPath={newPath}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isCommitView={isCommitView}
          createFileDraftThread={() => {
            createDraftThread(setDraftThreads, activePath, {
              oldPath,
              activePath,
              fileStatus: fileMeta?.status ?? "",
              body: "",
              subjectType: "file",
            });
            scrollToId(`file-draft-${activePath}`);
          }}
        />
        <div className={!isExpanded ? styles.collapsed : ""}>
          {isDiffLoaded ? (
            <>
              {hasFileLevelThreads && !isCommitView && (
                <ThreadList
                  publishedThreads={publishedThreads.fileThreads}
                  draftThread={draftThreadsByLine?.["file-level"]}
                />
              )}
              {hunks.length > 0 ? (
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
              ) : (
                <EmptyDiff diff={diff} fileMeta={fileMeta} />
              )}
            </>
          ) : (
            <LoadRemovedFile setIsDiffLoaded={setIsDiffLoaded} />
          )}
        </div>
      </div>
    </ClearHighlightContext>
  );
});
