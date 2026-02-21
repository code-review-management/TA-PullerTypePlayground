import { ReactNode } from "react";
import { ChangeData, getChangeKey, HunkData } from "react-diff-view";
import { Drafts, getDraftsKey } from "../_hooks/useDrafts"
import { PublishedThreadsByLine } from "../_hooks/usePublishedThreads";
import InlineCommentThreadList from "../_components/InlineCommentThreadList/InlineCommentThreadList";
;
/**
 * We have to group threads by side because for normal, unchanged lines,
 * react-diff-view shows the widget across both sides. We need to distinguish
 * threads on the left-side and right-side to show side-by-side comments for
 * normal lines.
 */
function getPublishedThreadsBySide(
  change: ChangeData,
  threadsByLine: PublishedThreadsByLine,
) {
  if (change.type === "normal") {
    return {
      left: threadsByLine.get(change.oldLineNumber)?.left ?? [],
      right: threadsByLine.get(change.newLineNumber)?.right ?? [],
    };
  }

  if (change.type === "delete") {
    return {
      left: threadsByLine.get(change.lineNumber)?.left ?? [],
      right: [],
    };
  }

  if (change.type === "insert") {
    return {
      left: [],
      right: threadsByLine.get(change.lineNumber)?.right ?? [],
    };
  }

  return { left: [], right: [] };
}

function getDraftBySide(
  activePath: string,
  change: ChangeData,
  drafts: Drafts,
) {
  if (change.type === "normal") {
    return {
      left: drafts[getDraftsKey(activePath, change.oldLineNumber, "old")],
      right: drafts[getDraftsKey(activePath, change.newLineNumber, "new")],
    };
  }

  if (change.type === "delete") {
    return {
      left: drafts[getDraftsKey(activePath, change.lineNumber, "old")],
      right: null,
    };
  }

  if (change.type === "insert") {
    return {
      left: null,
      right: drafts[getDraftsKey(activePath, change.lineNumber, "new")],
    };
  }

  return { left: null, right: null };
}

export function getWidgets(
  activePath: string,
  hunks: HunkData[],
  threadsByLine: PublishedThreadsByLine,
  drafts: Drafts,
) {
  // Docs: https://www.npmjs.com/package/react-diff-view#add-widgets
  const changes = hunks.flatMap((hunk) => hunk.changes);
  const widgets: Record<string, ReactNode> = {};

  changes.forEach((change) => {
    const publishedThreadsBySide = getPublishedThreadsBySide(change, threadsByLine);
    const draftBySide = getDraftBySide(activePath, change, drafts);

    const hasPublishedThreads =
      publishedThreadsBySide.left.length > 0 ||
      publishedThreadsBySide.right.length > 0;
    const hasDrafts = draftBySide.left || draftBySide.right;

    if (hasPublishedThreads || hasDrafts) {
      widgets[getChangeKey(change)] = InlineCommentThreadList({
        change,
        publishedThreadsBySide,
        draftBySide,
      });
    }
  });

  return widgets;
}
