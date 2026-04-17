import { FileDiff } from "@/types/github.types";
import { FileTreeNode } from "@/app/(pages)/[username]/[repo_name]/pull/[id]/changes/_utils/filetree-utils";

export function getExampleFileTree1(): FileTreeNode[] {
  return [
    {
      type: "directory",
      name: "src",
      children: [
        {
          type: "directory",
          name: "pages",
          children: [
            {
              type: "file",
              name: "home.tsx",
              fileDiff: { filename: "src/pages/home.tsx" } as FileDiff,
            },
            {
              type: "file",
              name: "layout.tsx",
              fileDiff: { filename: "src/pages/layout.tsx" } as FileDiff,
            },
          ],
        },
        {
          type: "file",
          name: "utils.ts",
          fileDiff: { filename: "src/utils.ts" } as FileDiff,
        },
      ],
    },
    { type: "directory", name: "lib", children: [] },
    { type: "file", name: "a.ts", fileDiff: { filename: "a.ts" } as FileDiff },
  ];
}
