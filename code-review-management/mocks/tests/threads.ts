import { PublishedThreadItem } from "@/app/(pages)/[username]/[repo_name]/pull/[id]/changes/_hooks/usePublishedThreads";

export function getDefaultPublishedThreadItem(): PublishedThreadItem {
  return {
    id: 1,
    path: "filename.ts",
    start_line: 1,
    line: 5,
    start_side: "LEFT",
    side: "LEFT",
    subject_type: "line",
    comments: [],
  };
}
