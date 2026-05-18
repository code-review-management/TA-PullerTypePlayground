import { DraftItem } from "@/app/(pages)/(protected)/[username]/[repo_name]/pull/[id]/changes/_components/DraftEditorActions/DraftEditorActions";
import { PublishedThreadItem } from "@/app/(pages)/(protected)/[username]/[repo_name]/pull/[id]/changes/_hooks/usePublishedThreads";

export function getExampleThreadDraftItem1(): DraftItem {
  return {
    type: "thread",
    payload: {
      oldPath: "old-path.ts",
      activePath: "active-path.ts",
      fileStatus: "modified",
      body: "example-body",
      subjectType: "line",
      start: 1,
      end: 5,
      side: "old",
    },
  };
}

export function getExampleLinePublishedThreadItem1(): PublishedThreadItem {
  return {
    id: 1,
    path: "filename.ts",
    original_start_line: 1,
    original_line: 5,
    start_line: 1,
    line: 5,
    start_side: "LEFT",
    side: "LEFT",
    subject_type: "line",
    comments: [],
  };
}
