import { ReactNode } from "react";
import { ChangeData, getChangeKey, HunkData } from "react-diff-view";
import { DraftThreads, getDraftThreadKey } from "../_hooks/useDraftThreads";
import { PublishedThreadsByLine } from "../_hooks/usePublishedThreads";
import InlineThreadList from "../_components/InlineThreadList/InlineThreadList";

/**
 * For a given line number, group its published and draft threads by side.
 * 
 * @param filename 
 * @param change 
 * @param threadsByLine 
 * @param drafts 
 * @returns 
 */
function getThreadsBySide(
  filename: string,
  change: ChangeData,
  threadsByLine: PublishedThreadsByLine,
  draftThreads: DraftThreads,
) {
  if (change.type === "normal") {
    return {
      published: {
        left: threadsByLine.get(change.oldLineNumber)?.left ?? [],
        right: threadsByLine.get(change.newLineNumber)?.right ?? [],
      },
      draft: {
        left: draftThreads[getDraftThreadKey(filename, change.oldLineNumber, "old")],
        right: draftThreads[getDraftThreadKey(filename, change.newLineNumber, "new")],
      },
    };
  }

  if (change.type === "delete") {
    return {
      published: {
        left: threadsByLine.get(change.lineNumber)?.left ?? [],
        right: [],
      },
      draft: {
        left: draftThreads[getDraftThreadKey(filename, change.lineNumber, "old")],
        right: null,
      },
    };
  }

  if (change.type === "insert") {
    return {
      published: {
        left: [],
        right: threadsByLine.get(change.lineNumber)?.right ?? [],
      },
      draft: {
        left: null,
        right: draftThreads[getDraftThreadKey(filename, change.lineNumber, "new")],
      },
    };
  }

  return {
    published: { left: [], right: [] },
    draft: { left: null, right: null },
  };
}

export function getWidgets(
  filename: string,
  hunks: HunkData[],
  publishedThreadsByLine: PublishedThreadsByLine,
  draftThreads: DraftThreads,
) {
  const changes = hunks.flatMap((hunk) => hunk.changes);
  const widgets: Record<string, ReactNode> = {};

  changes.forEach((change) => {
    const { published: publishedThreadsBySide, draft: draftThreadsBySide } =
      getThreadsBySide(filename, change, publishedThreadsByLine, draftThreads);

    const hasContent =
      publishedThreadsBySide.left.length > 0 ||
      publishedThreadsBySide.right.length > 0 ||
      draftThreadsBySide.left ||
      draftThreadsBySide.right;

    if (hasContent) {
      widgets[getChangeKey(change)] = InlineThreadList({
        change,
        publishedThreadsBySide,
        draftThreadsBySide,
      });
    }
  });

  return widgets;
}
