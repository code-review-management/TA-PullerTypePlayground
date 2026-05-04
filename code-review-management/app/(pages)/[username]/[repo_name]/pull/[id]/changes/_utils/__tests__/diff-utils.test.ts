import { createDiff } from "@/mocks/tests/filetree";
import { fixParsedDiffPaths } from "../diff-utils";

describe("fixParsedDiffPaths", () => {
  const mockEmptyDiff = createDiff({});

  it("handles filenames with one space", () => {
    const diffString = "diff --git a/Src/main renamed.c b/Src/main renamed.c";
    const parsedDiffs = [mockEmptyDiff];
    fixParsedDiffPaths(diffString, parsedDiffs);

    expect(parsedDiffs[0].oldPath).toBe("Src/main renamed.c");
    expect(parsedDiffs[0].newPath).toBe("Src/main renamed.c");
  });

  it("handles filenames with multiple non-consecutive spaces", () => {
    const diffString = "diff --git a/a b c d.txt b/a b c d.txt";
    const parsedDiffs = [mockEmptyDiff];
    fixParsedDiffPaths(diffString, parsedDiffs);

    expect(parsedDiffs[0].oldPath).toBe("a b c d.txt");
    expect(parsedDiffs[0].newPath).toBe("a b c d.txt");
  });

  it("handles filenames with multiple non-consecutive spaces and trailing spaces", () => {
    const diffString =
      "diff --git a/file with trailing whitespace       b/file with trailing whitespace      ";
    const parsedDiffs = [mockEmptyDiff];
    fixParsedDiffPaths(diffString, parsedDiffs);

    expect(parsedDiffs[0].oldPath).toBe("file with trailing whitespace      ");
    expect(parsedDiffs[0].newPath).toBe("file with trailing whitespace      ");
  });
});

// diff --git a/Src/main renamed.c b/Src/main renamed.c
// index 9a819c9..9c26c3b 100644
// --- a/Src/main renamed.c
// +++ b/Src/main renamed.c
// @@ -3,6 +3,8 @@
//  #define RUN_TEST	0	// 0 = run IntelliSat, 1 = run a very specific test
//  #define TEST_ID 	0	// ID of the test to run in case RUN_TEST = 1

// +// Update in a renamed file
// +
//  #include <TestDefinition.h>

//  int main() {
// diff --git a/file with ending whitespace b/file with ending whitespace
// new file mode 100644
// index 0000000..d670460
// --- /dev/null
// +++ b/file with ending whitespace
// @@ -0,0 +1 @@
// +test content
// diff --git a/file with ending whitespace       b/file with ending whitespace
// new file mode 100644
// index 0000000..ce24705
// --- /dev/null
// +++ b/file with ending whitespace
// @@ -0,0 +1 @@
// +different test content
// diff --git a/img/project_settings/project includes whitespace   .png b/img/project_settings/project includes whitespace   renamed .png
// similarity index 100%
// rename from img/project_settings/project includes whitespace   .png
// rename to img/project_settings/project includes whitespace   renamed .png
// diff --git a/white space file.    test.txt b/white space file.    test.txt
// new file mode 100644
// index 0000000..8b13789
// --- /dev/null
// +++ b/white space file.    test.txt
// @@ -0,0 +1 @@
// +
