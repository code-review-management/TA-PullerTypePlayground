import { createDiff } from "@/mocks/tests/filetree";
import { fixParsedDiffPaths } from "../diff-utils";

describe("fixParsedDiffPaths", () => {
  const mockEmptyDiff = createDiff({});

  it("handles paths without spaces", () => {
    const diffString = "diff --git a/src/file.txt b/src/file.txt";
    const parsedDiffs = [mockEmptyDiff];

    fixParsedDiffPaths(diffString, parsedDiffs);

    expect(parsedDiffs[0].oldPath).toBe("src/file.txt");
    expect(parsedDiffs[0].newPath).toBe("src/file.txt");
  });

  it("handles paths with one space", () => {
    const diffString = "diff --git a/src/file 1.txt b/src/file 1.txt";
    const parsedDiffs = [mockEmptyDiff];
    fixParsedDiffPaths(diffString, parsedDiffs);

    expect(parsedDiffs[0].oldPath).toBe("src/file 1.txt");
    expect(parsedDiffs[0].newPath).toBe("src/file 1.txt");
  });

  it("handles paths with multiple non-consecutive spaces", () => {
    const diffString = "diff --git a/a b c d.txt b/a b c d.txt";
    const parsedDiffs = [mockEmptyDiff];
    fixParsedDiffPaths(diffString, parsedDiffs);

    expect(parsedDiffs[0].oldPath).toBe("a b c d.txt");
    expect(parsedDiffs[0].newPath).toBe("a b c d.txt");
  });

  it("handles paths with multiple consecutive spaces", () => {
    const diffString = "diff --git a/a    b   c.txt b/a    b   c.txt";
    const parsedDiffs = [mockEmptyDiff];
    fixParsedDiffPaths(diffString, parsedDiffs);

    expect(parsedDiffs[0].oldPath).toBe("a    b   c.txt");
    expect(parsedDiffs[0].newPath).toBe("a    b   c.txt");
  });

  it("handles paths with multiple non-consecutive spaces and trailing spaces", () => {
    const diffString = "diff --git a/a b c d.txt       b/a b c d.txt      ";
    const parsedDiffs = [mockEmptyDiff];
    fixParsedDiffPaths(diffString, parsedDiffs);

    expect(parsedDiffs[0].oldPath).toBe("a b c d.txt      ");
    expect(parsedDiffs[0].newPath).toBe("a b c d.txt      ");
  });

  it("handles paths containing 'a/' and 'b/' as substrings", () => {
    const diffString = "diff --git a/a b/ a/ b.txt b/a b/ a/ b.txt";
    const parsedDiffs = [mockEmptyDiff];
    fixParsedDiffPaths(diffString, parsedDiffs);

    expect(parsedDiffs[0].oldPath).toBe("a b/ a/ b.txt");
    expect(parsedDiffs[0].newPath).toBe("a b/ a/ b.txt");
  });
});
