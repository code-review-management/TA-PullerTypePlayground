import { FileDiff } from "@/types/github.types";
import {
  buildFileTree,
  FileTreeNode,
  flattenFileTree,
} from "../filetree-utils";

describe("buildFileTree", () => {
  it("returns an empty array when given no files", () => {
    expect(buildFileTree([])).toEqual([]);
  });

  describe("flat files at the root", () => {
    it("returns a single file node for one root-level file", () => {
      const file = { filename: "a.ts" } as FileDiff;

      expect(buildFileTree([file])).toEqual([
        { type: "file", name: "a.ts", fileDiff: file },
      ]);
    });

    it("returns a file node for each root-level file", () => {
      const files = [
        { filename: "a.ts" },
        { filename: "b.ts" },
        { filename: "c.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        { type: "file", name: "a.ts", fileDiff: files[0] },
        { type: "file", name: "b.ts", fileDiff: files[1] },
        { type: "file", name: "c.ts", fileDiff: files[2] },
      ]);
    });
  });

  describe("collapsing single-child directories", () => {
    it("collapses a chain that terminates in a single file", () => {
      const file = { filename: "app/pages/utils/a.ts" } as FileDiff;

      expect(buildFileTree([file])).toEqual([
        {
          type: "directory",
          name: "app/pages/utils",
          children: [{ type: "file", name: "a.ts", fileDiff: file }],
        },
      ]);
    });

    it("collapses a chain that terminates in multiple files", () => {
      const files = [
        { filename: "app/pages/utils/a.ts" },
        { filename: "app/pages/utils/b.ts" },
        { filename: "app/pages/utils/c.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app/pages/utils",
          children: [
            { type: "file", name: "a.ts", fileDiff: files[0] },
            { type: "file", name: "b.ts", fileDiff: files[1] },
            { type: "file", name: "c.ts", fileDiff: files[2] },
          ],
        },
      ]);
    });

    it("collapses independently within separate branches of the tree", () => {
      const files = [
        { filename: "app/pages/utils/a.ts" },
        { filename: "lib/api/hooks/b.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app/pages/utils",
          children: [{ type: "file", name: "a.ts", fileDiff: files[0] }],
        },
        {
          type: "directory",
          name: "lib/api/hooks",
          children: [{ type: "file", name: "b.ts", fileDiff: files[1] }],
        },
      ]);
    });

    it("does not collapse a directory whose only child is a file", () => {
      const file = { filename: "app/a.ts" } as FileDiff;

      expect(buildFileTree([file])).toEqual([
        {
          type: "directory",
          name: "app",
          children: [{ type: "file", name: "a.ts", fileDiff: file }],
        },
      ]);
    });

    it("stops collapsing at the first branching directory", () => {
      const files = [
        { filename: "app/pages/lib/a.ts" },
        { filename: "app/pages/utils/b.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app/pages",
          children: [
            {
              type: "directory",
              name: "lib",
              children: [{ type: "file", name: "a.ts", fileDiff: files[0] }],
            },
            {
              type: "directory",
              name: "utils",
              children: [{ type: "file", name: "b.ts", fileDiff: files[1] }],
            },
          ],
        },
      ]);
    });

    it("stops collapsing when a directory contains both a file and a subdirectory", () => {
      const files = [
        { filename: "app/pages/lib/a.ts" },
        { filename: "app/pages/lib/utils/b.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app/pages/lib",
          children: [
            {
              type: "directory",
              name: "utils",
              children: [{ type: "file", name: "b.ts", fileDiff: files[1] }],
            },
            { type: "file", name: "a.ts", fileDiff: files[0] },
          ],
        },
      ]);
    });
  });

  describe("sorting", () => {
    it("sorts root-level files alphabetically", () => {
      const files = [
        { filename: "c.ts" },
        { filename: "a.ts" },
        { filename: "b.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        { type: "file", name: "a.ts", fileDiff: files[1] },
        { type: "file", name: "b.ts", fileDiff: files[2] },
        { type: "file", name: "c.ts", fileDiff: files[0] },
      ]);
    });

    it("sorts sibling directories alphabetically", () => {
      const files = [
        { filename: "mocks/c.ts" },
        { filename: "app/a.ts" },
        { filename: "lib/b.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app",
          children: [{ type: "file", name: "a.ts", fileDiff: files[1] }],
        },
        {
          type: "directory",
          name: "lib",
          children: [{ type: "file", name: "b.ts", fileDiff: files[2] }],
        },
        {
          type: "directory",
          name: "mocks",
          children: [{ type: "file", name: "c.ts", fileDiff: files[0] }],
        },
      ]);
    });

    it("sorts files alphabetically within a directory", () => {
      const files = [
        { filename: "app/b.ts" },
        { filename: "app/c.ts" },
        { filename: "app/a.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app",
          children: [
            { type: "file", name: "a.ts", fileDiff: files[2] },
            { type: "file", name: "b.ts", fileDiff: files[0] },
            { type: "file", name: "c.ts", fileDiff: files[1] },
          ],
        },
      ]);
    });

    it("places directories before files at the same level", () => {
      const files = [
        { filename: "b.ts" },
        { filename: "a.ts" },
        { filename: "app/c.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app",
          children: [{ type: "file", name: "c.ts", fileDiff: files[2] }],
        },
        { type: "file", name: "a.ts", fileDiff: files[1] },
        { type: "file", name: "b.ts", fileDiff: files[0] },
      ]);
    });

    it("sorts files and directories at every level of the tree", () => {
      const files = [
        { filename: "lib/utils/h.ts" },
        { filename: "d.ts" },
        { filename: "app/f.ts" },
        { filename: "app/lib/c.ts" },
        { filename: "app/api/b.ts" },
        { filename: "lib/api/hooks/e.ts" },
        { filename: "g.ts" },
        { filename: "app/a.ts" },
      ] as FileDiff[];

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app",
          children: [
            {
              type: "directory",
              name: "api",
              children: [{ type: "file", name: "b.ts", fileDiff: files[4] }],
            },
            {
              type: "directory",
              name: "lib",
              children: [{ type: "file", name: "c.ts", fileDiff: files[3] }],
            },
            { type: "file", name: "a.ts", fileDiff: files[7] },
            { type: "file", name: "f.ts", fileDiff: files[2] },
          ],
        },
        {
          type: "directory",
          name: "lib",
          children: [
            {
              type: "directory",
              name: "api/hooks",
              children: [{ type: "file", name: "e.ts", fileDiff: files[5] }],
            },
            {
              type: "directory",
              name: "utils",
              children: [{ type: "file", name: "h.ts", fileDiff: files[0] }],
            },
          ],
        },
        { type: "file", name: "d.ts", fileDiff: files[1] },
        { type: "file", name: "g.ts", fileDiff: files[6] },
      ]);
    });
  });
});

describe("flattenFileTree", () => {
  it("returns an empty array when given an empty tree", () => {
    expect(flattenFileTree([])).toEqual([]);
  });

  it("flattens a tree of root-level files", () => {
    const files = [
      { filename: "a.ts" },
      { filename: "b.ts" },
      { filename: "c.ts" },
    ] as FileDiff[];

    const tree: FileTreeNode[] = [
      { type: "file", name: "a.ts", fileDiff: files[0] },
      { type: "file", name: "b.ts", fileDiff: files[1] },
      { type: "file", name: "c.ts", fileDiff: files[2] },
    ];

    expect(flattenFileTree(tree)).toEqual([files[0], files[1], files[2]]);
  });

  it("flattens a tree with files within a single directory", () => {
    const files = [
      { filename: "app/a.ts" },
      { filename: "app/b.ts" },
      { filename: "app/c.ts" },
    ] as FileDiff[];

    const tree: FileTreeNode[] = [
      {
        type: "directory",
        name: "app",
        children: [
          { type: "file", name: "a.ts", fileDiff: files[0] },
          { type: "file", name: "b.ts", fileDiff: files[1] },
          { type: "file", name: "c.ts", fileDiff: files[2] },
        ],
      },
    ];

    expect(flattenFileTree(tree)).toEqual([files[0], files[1], files[2]]);
  });

  it("flattens a tree with files across multiple nested directories", () => {
    const files = [
      { filename: "app/a.ts" },
      { filename: "app/pages/b.ts" },
      { filename: "app/pages/utils/c.ts" },
    ] as FileDiff[];

    const tree: FileTreeNode[] = [
      {
        type: "directory",
        name: "app",
        children: [
          {
            type: "directory",
            name: "pages",
            children: [
              {
                type: "directory",
                name: "utils",
                children: [{ type: "file", name: "c.ts", fileDiff: files[2] }],
              },
              { type: "file", name: "b.ts", fileDiff: files[1] },
            ],
          },
          { type: "file", name: "a.ts", fileDiff: files[0] },
        ],
      },
    ];
    expect(flattenFileTree(tree)).toEqual([files[2], files[1], files[0]]);
  });

  it("flattens a tree with sibling directories and files", () => {
    const files = [
      { filename: "a.ts" },
      { filename: "b.ts" },
      { filename: "app/c.ts" },
      { filename: "app/d.ts" },
    ] as FileDiff[];
    const tree: FileTreeNode[] = [
      {
        type: "directory",
        name: "app",
        children: [
          { type: "file", name: "c.ts", fileDiff: files[2] },
          { type: "file", name: "d.ts", fileDiff: files[3] },
        ],
      },
      { type: "file", name: "a.ts", fileDiff: files[0] },
      { type: "file", name: "b.ts", fileDiff: files[1] },
    ];
    expect(flattenFileTree(tree)).toEqual([
      files[2],
      files[3],
      files[0],
      files[1],
    ]);
  });
});
