import { FileDiff } from "@/types/github.types";
import {
  buildFileTree,
  FileTreeNode,
  flattenFileTree,
} from "../filetree-utils";

// Helper function to construct an array of FileDiff's given a list of filenames.
function createFileDiffs(filenames: string[]): FileDiff[] {
  return filenames.map((filename) => ({ filename }) as FileDiff);
}

describe("buildFileTree", () => {
  it("returns an empty array when given no files", () => {
    expect(buildFileTree([])).toEqual([]);
  });

  describe("flat files at the root", () => {
    it("returns a single file node for one root-level file", () => {
      const files = createFileDiffs(["a.ts"]);

      expect(buildFileTree(files)).toEqual([
        { type: "file", name: "a.ts", fileDiff: files[0] },
      ]);
    });

    it("returns a file node for each root-level file", () => {
      const files = createFileDiffs(["a.ts", "b.ts", "c.ts"]);

      expect(buildFileTree(files)).toEqual([
        { type: "file", name: "a.ts", fileDiff: files[0] },
        { type: "file", name: "b.ts", fileDiff: files[1] },
        { type: "file", name: "c.ts", fileDiff: files[2] },
      ]);
    });
  });

  describe("collapsing single-child directories", () => {
    it("collapses a chain that ends in a single file", () => {
      const files = createFileDiffs(["app/pages/utils/a.ts"]);

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app/pages/utils",
          children: [{ type: "file", name: "a.ts", fileDiff: files[0] }],
        },
      ]);
    });

    it("collapses a chain that ends in multiple files", () => {
      const files = createFileDiffs([
        "app/pages/utils/a.ts",
        "app/pages/utils/b.ts",
        "app/pages/utils/c.ts",
      ]);

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
      const files = createFileDiffs([
        "app/pages/utils/a.ts",
        "lib/api/hooks/b.ts",
      ]);

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
      const files = createFileDiffs(["app/a.ts"]);

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app",
          children: [{ type: "file", name: "a.ts", fileDiff: files[0] }],
        },
      ]);
    });

    it("stops collapsing at the first branching directory", () => {
      const files = createFileDiffs([
        "app/pages/lib/a.ts",
        "app/pages/utils/b.ts",
      ]);

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
      const files = createFileDiffs([
        "app/pages/lib/a.ts",
        "app/pages/lib/utils/b.ts",
      ]);

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
      const files = createFileDiffs(["c.ts", "a.ts", "b.ts"]);

      expect(buildFileTree(files)).toEqual([
        { type: "file", name: "a.ts", fileDiff: files[1] },
        { type: "file", name: "b.ts", fileDiff: files[2] },
        { type: "file", name: "c.ts", fileDiff: files[0] },
      ]);
    });

    it("sorts sibling directories alphabetically", () => {
      const files = createFileDiffs(["mocks/c.ts", "app/a.ts", "lib/b.ts"]);

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

    it("sorts files alphabetically within a single directory", () => {
      const files = createFileDiffs(["app/b.ts", "app/c.ts", "app/a.ts"]);

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
      const files = createFileDiffs(["b.ts", "a.ts", "app/c.ts", "lib/d.ts"]);

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app",
          children: [{ type: "file", name: "c.ts", fileDiff: files[2] }],
        },
        {
          type: "directory",
          name: "lib",
          children: [{ type: "file", name: "d.ts", fileDiff: files[3] }],
        },
        { type: "file", name: "a.ts", fileDiff: files[1] },
        { type: "file", name: "b.ts", fileDiff: files[0] },
      ]);
    });

    it("sorts files and directories at every level of the tree", () => {
      const files = createFileDiffs([
        "lib/utils/h.ts",
        "d.ts",
        "app/api/i.ts",
        "app/f.ts",
        "app/lib/c.ts",
        "app/api/b.ts",
        "lib/api/hooks/e.ts",
        "g.ts",
        "app/a.ts",
      ]);

      expect(buildFileTree(files)).toEqual([
        {
          type: "directory",
          name: "app",
          children: [
            {
              type: "directory",
              name: "api",
              children: [
                { type: "file", name: "b.ts", fileDiff: files[5] },
                { type: "file", name: "i.ts", fileDiff: files[2] },
              ],
            },
            {
              type: "directory",
              name: "lib",
              children: [{ type: "file", name: "c.ts", fileDiff: files[4] }],
            },
            { type: "file", name: "a.ts", fileDiff: files[8] },
            { type: "file", name: "f.ts", fileDiff: files[3] },
          ],
        },
        {
          type: "directory",
          name: "lib",
          children: [
            {
              type: "directory",
              name: "api/hooks",
              children: [{ type: "file", name: "e.ts", fileDiff: files[6] }],
            },
            {
              type: "directory",
              name: "utils",
              children: [{ type: "file", name: "h.ts", fileDiff: files[0] }],
            },
          ],
        },
        { type: "file", name: "d.ts", fileDiff: files[1] },
        { type: "file", name: "g.ts", fileDiff: files[7] },
      ]);
    });
  });
});

describe("flattenFileTree", () => {
  it("returns an empty array when given an empty tree", () => {
    expect(flattenFileTree([])).toEqual([]);
  });

  it("flattens a tree of root-level files", () => {
    const files = createFileDiffs(["a.ts", "b.ts", "c.ts"]);

    const tree: FileTreeNode[] = [
      { type: "file", name: "a.ts", fileDiff: files[0] },
      { type: "file", name: "b.ts", fileDiff: files[1] },
      { type: "file", name: "c.ts", fileDiff: files[2] },
    ];

    expect(flattenFileTree(tree)).toEqual([files[0], files[1], files[2]]);
  });

  it("flattens a tree of files within a single directory", () => {
    const files = createFileDiffs(["app/a.ts", "app/b.ts", "app/c.ts"]);

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

  it("flattens a tree of files across multiple nested directories", () => {
    const files = createFileDiffs([
      "app/a.ts",
      "app/page/b.ts",
      "app/pages/utils/c.ts",
    ]);

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

  it("flattens a tree of files with sibling directories", () => {
    const files = createFileDiffs(["a.ts", "b.ts", "app/c.ts", "app/d.ts"]);

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
