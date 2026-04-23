import { DraftItem } from "@/app/(pages)/[username]/[repo_name]/pull/[id]/changes/_components/DraftEditorActions/DraftEditorActions";

export function getDefaultDraftItem(): DraftItem {
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
