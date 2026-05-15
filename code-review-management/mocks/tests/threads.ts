import { PublishedThreadItem } from "@/app/(pages)/(protected)/[username]/[repo_name]/pull/[id]/changes/_hooks/usePublishedThreads";

export function getExampleLinePublishedThreadItem1(): PublishedThreadItem {
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
