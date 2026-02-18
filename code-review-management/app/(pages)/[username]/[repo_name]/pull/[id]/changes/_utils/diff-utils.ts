import refractor from "refractor";
import path from "path";
import { ReactNode } from "react";
import { ChangeData, getChangeKey, HunkData } from "react-diff-view";
import { PublishedThreadsByLine } from "../_hooks/usePublishedThreads";
import InlineCommentThreadList from "../_components/InlineCommentThreadList/InlineCommentThreadList";

export function getLanguage(filename: string) {
  const fileExtension = path.extname(filename).slice(1);

  if (refractor.registered(fileExtension)) {
    return fileExtension;
  } else {
    return "txt";
  }
}

/**
 * We have to group threads by side because for normal, unchanged lines,
 * react-diff-view shows the widget across both sides. We need to distinguish
 * threads on the left-side and right-side to show a side-by-side comments for
 * normal lines.
 */
function getPublishedThreadsBySide(change: ChangeData, threadsByLine: PublishedThreadsByLine) {
  if (change.type === "normal") {
    return {
      leftPublishedThreads: threadsByLine.get(change.oldLineNumber)?.left ?? [],
      rightPublishedThreads: threadsByLine.get(change.newLineNumber)?.right ?? []
    };
  }

  if (change.type === "delete") {
    return {
      leftPublishedThreads: threadsByLine.get(change.lineNumber)?.left ?? [],
      rightPublishedThreads: []
    };
  }

  if (change.type === "insert") {
    return {
      leftPublishedThreads: [],
      rightPublishedThreads: threadsByLine.get(change.lineNumber)?.right ?? []
    };
  }

  return { leftPublishedThreads: [], rightPublishedThreads: [] };
}

export function getCommentWidgets(hunks: HunkData[], threadsByLine: PublishedThreadsByLine) {
  // Docs: https://www.npmjs.com/package/react-diff-view#add-widgets
  const changes = hunks.reduce<ChangeData[]>((result, { changes }) => [...result, ...changes], []);
  const widgets: Record<string, ReactNode> = {};

  changes.forEach((change) => {
    const {
      leftPublishedThreads,
      rightPublishedThreads
    } = getPublishedThreadsBySide(change, threadsByLine);
    const changeKey = getChangeKey(change);

    if (leftPublishedThreads.length > 0 || rightPublishedThreads.length > 0) {
      widgets[changeKey] = InlineCommentThreadList({
        change,
        leftPublishedThreads,
        rightPublishedThreads,
      });
    }
  });

  return widgets;
}
