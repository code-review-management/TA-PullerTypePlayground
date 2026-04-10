import { ReactNode } from "react";
import { ChangeData, getChangeKey, HunkData } from "react-diff-view";
import {
  DraftThreadsByLine,
  getDraftThreadKey,
} from "../_hooks/useDraftThreads";
import { PublishedThreadsByLine } from "../_hooks/usePublishedThreads";
import InlineThreadList from "../_components/InlineThreadList/InlineThreadList";
import { buildSuggestionWidget, buildStandardWidget } from '../_components/SuggestionEntry/diffWidgetBuilder';
import { Comment } from "@/types/github.types";

interface SuggestiveComment {
  hasSuggestion: boolean,
  relativeStartLine: number,
  deletionContent: string,
  additionContent: string,
}

/**
 * For a given line in the file diff, group its published and draft threads by
 * side (left or right).
 *
 * @param filename: File associated with these threads.
 * @param change: `Change` object containing data about this line in the file diff.
 * @param publishedThreads: Published threads for this file, keyed by line number.
 * @param draftThreads: Draft threads for this file, keyed by draft thread key.
 * @returns: An object with `published` and `draft` sub-objects that groups
 *           threads by left and right sides.
 */
export function getThreadsBySide(
  filename: string,
  change: ChangeData,
  publishedThreads: PublishedThreadsByLine,
  draftThreads: DraftThreadsByLine,
) {
  if (change.type === "normal") {
    return {
      published: {
        left: publishedThreads.get(change.oldLineNumber)?.left ?? [],
        right: publishedThreads.get(change.newLineNumber)?.right ?? [],
      },
      draft: {
        left: draftThreads[getDraftThreadKey(change.oldLineNumber, "old")],
        right: draftThreads[getDraftThreadKey(change.newLineNumber, "new")],
      },
    };
  }

  if (change.type === "delete") {
    return {
      published: {
        left: publishedThreads.get(change.lineNumber)?.left ?? [],
        right: [],
      },
      draft: {
        left: draftThreads[getDraftThreadKey(change.lineNumber, "old")],
        right: null,
      },
    };
  }

  if (change.type === "insert") {
    return {
      published: {
        left: [],
        right: publishedThreads.get(change.lineNumber)?.right ?? [],
      },
      draft: {
        left: null,
        right: draftThreads[getDraftThreadKey(change.lineNumber, "new")],
      },
    };
  }

  return {
    published: { left: [], right: [] },
    draft: { left: null, right: null },
  };
}

/**
 * Parses out every comment in a thread and finds if there is a suggestion. If so, it will return the content 
 */
function extractSuggestions(comments: Comment[]): SuggestiveComment {
  const extractedSuggestion: SuggestiveComment = {
    hasSuggestion: false,
    relativeStartLine: 0,
    deletionContent: "",
    additionContent: "",
  };

  for (let i = comments.length - 1; i >= 0; i--) {
    const comment: Comment = comments[i];
    const text = comment.body; 

    const match = text.match(/<!--\[Gemini Suggestion#HLTP]\[(.*?)\]/);
    if (match) {
      const relativeStartLine = parseInt(match[1]);
      extractedSuggestion.relativeStartLine = relativeStartLine;

      const deletedMatch = text.match(
        /<!--Gemini-Tag \[Code To Be Deleted]-->\n([\s\S]*?)\n<!--Gemini-Tag \[Code To Be Inserted]-->/
      );

      const insertedMatch = text.match(
        /<!--Gemini-Tag \[Code To Be Inserted]-->\n([\s\S]*?)\n<!--Gemini-Tag \[Diff End] -->/
      );

      if (deletedMatch){
        extractedSuggestion.deletionContent = deletedMatch[1];
      } else {
        console.log("tag tampered!");
        return extractedSuggestion;
      }

      if (insertedMatch) {
        extractedSuggestion.additionContent = insertedMatch[1];
      } else {
        console.log("tag tampered!");
        return extractedSuggestion;
      }
      // Break after finding the most recent suggestion
      extractedSuggestion.hasSuggestion = true;
      break;
    }
  }

  return extractedSuggestion;
}

/**
 * Builds a map of widgets to render within `react-diff-view`.
 *
 * @param filename: File being diffed.
 * @param hunks: Hunks that make up this file's diff.
 * @param publishedThreads: Published threads for this file, keyed by line number.
 * @param draftThreads: Draft threads for this file, keyed by draft thread key.
 * @returns: A record that maps change-keys to their corresponding thread list widgets.
 */
export function getWidgets(
  filename: string,
  hunks: HunkData[],
  publishedThreads: PublishedThreadsByLine,
  draftThreads: DraftThreadsByLine,
) {
  const changes = hunks.flatMap((hunk) => hunk.changes);
  const widgets: Record<string, ReactNode> = {};

  changes.forEach((change) => {
    const { published: publishedThreadsBySide, draft: draftThreadsBySide } =
      getThreadsBySide(filename, change, publishedThreads, draftThreads);

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

export function prepareDiffData(
  filename: string,
  hunks: HunkData[],
  publishedThreads: PublishedThreadsByLine,
  draftThreads: DraftThreadsByLine
) {
  const widgets: Record<string, ReactNode> = {};
  const processedHunks: HunkData[] = [];

  hunks.forEach((hunk) => {
    const newChanges: ChangeData[] = [];
    let previousChangeKey: string | null = null;

    hunk.changes.forEach((change) => {
      const { published, draft } = getThreadsBySide(
        filename,
        change,
        publishedThreads,
        draftThreads
      );

      const allPublishedThreads = [
        ...published.left,
        ...published.right
      ];

      const allDraftThreads = [
        ...draft.left,
        ...draft.right
      ]

      const currentChangeKey = getChangeKey(change);

      let hasSuggestion = false;

      allPublishedThreads.forEach((thread) => {
        const suggestionData = extractSuggestions(thread.comments || []);

        if (suggestionData.hasSuggestion) {
          hasSuggestion = true;

          const anchorKey = previousChangeKey || currentChangeKey;
          const existingWidget = widgets[anchorKey] || null;

          widgets[anchorKey] = buildSuggestionWidget(
            anchorKey,
            suggestionData.suggestions,
            existingWidget
          );
        } else {
          // Normal thread → render normally
          const existingWidget = widgets[currentChangeKey] || null;

          widgets[currentChangeKey] = buildStandardWidget(
            change,
            published,
            draft,
            existingWidget
          );
        }
      });

      // 🔥 KEY BEHAVIOR CHANGE
      if (!hasSuggestion) {
        // normal line → render as usual
        newChanges.push(change);
        previousChangeKey = currentChangeKey;
      } else {
        // suggestion line → DO NOT render original line
        if (previousChangeKey === null) {
          // edge case: first line is suggestion
          newChanges.push(change);
          previousChangeKey = currentChangeKey;
        }
      }
    });

    processedHunks.push({
      ...hunk,
      changes: newChanges,
    });
  });

  return { widgets, processedHunks };
}
