import { isWithinHighlightRange } from "../highlight-utils";

const mockCreateDraftThread = jest.fn();
const mockGetLineNumber = jest.fn();

jest.mock("../comment-utils", () => ({
  createDraftThread: () => mockCreateDraftThread(),
}));

jest.mock("../diff-utils", () => ({
  getLineNumber: () => mockGetLineNumber(),
}));

describe("isWithinHighlightRange", () => {
  describe("when active highlight has null fields", () => {
    it("returns false when start is null", () => {
      expect(
        isWithinHighlightRange(10, "new", {
          isHighlighting: false,
          start: null,
          end: 10,
          side: "new",
        }),
      ).toBe(false);
    });

    it("returns false when end is null", () => {
      expect(
        isWithinHighlightRange(5, "new", {
          isHighlighting: false,
          start: 5,
          end: null,
          side: "new",
        }),
      ).toBe(false);
    });

    it("returns false when side is null", () => {
      expect(
        isWithinHighlightRange(7, "new", {
          isHighlighting: false,
          start: 5,
          end: 10,
          side: null,
        }),
      ).toBe(false);
    });
  });

  describe("when the side does not match the active highlight's side", () => {
    it("returns false when checking 'old' but highlight is on 'new'", () => {
      expect(
        isWithinHighlightRange(7, "old", {
          isHighlighting: false,
          start: 5,
          end: 10,
          side: "new",
        }),
      ).toBe(false);
    });

    it("returns false when checking 'new' but highlight is on 'old'", () => {
      expect(
        isWithinHighlightRange(7, "new", {
          isHighlighting: false,
          start: 5,
          end: 10,
          side: "old",
        }),
      ).toBe(false);
    });
  });

  describe("when the line is outside the active highlight range", () => {
    it("returns false when the line is below the range", () => {
      expect(
        isWithinHighlightRange(4, "new", {
          isHighlighting: false,
          start: 5,
          end: 10,
          side: "new",
        }),
      ).toBe(false);
    });

    it("returns false when the line is above the range", () => {
      expect(
        isWithinHighlightRange(11, "new", {
          isHighlighting: false,
          start: 5,
          end: 10,
          side: "new",
        }),
      ).toBe(false);
    });
  });

  describe("when the line is inside the active highlight range", () => {
    const activeHighlight = {
      isHighlighting: false,
      start: 5,
      end: 10,
      side: "new" as const,
    };

    it("returns true when the line is at the start boundary", () => {
      expect(isWithinHighlightRange(5, "new", activeHighlight)).toBe(true);
    });

    it("returns true when the line is at the end boundary", () => {
      expect(isWithinHighlightRange(10, "new", activeHighlight)).toBe(true);
    });

    it("returns true when the line is in the middle of the range", () => {
      expect(isWithinHighlightRange(7, "new", activeHighlight)).toBe(true);
    });
  });

  describe("when the highlight is dragged upwards (end < start)", () => {
    const activeHighlight = {
      isHighlighting: true,
      start: 10,
      end: 5,
      side: "new" as const,
    };

    it("returns true when the line is at the lower bound (end)", () => {
      expect(isWithinHighlightRange(5, "new", activeHighlight)).toBe(true);
    });

    it("returns true when the line is at the upper bound (start)", () => {
      expect(isWithinHighlightRange(10, "new", activeHighlight)).toBe(true);
    });

    it("returns true when the line is between end and start", () => {
      expect(isWithinHighlightRange(7, "new", activeHighlight)).toBe(true);
    });

    it("returns false when the line is below the range", () => {
      expect(isWithinHighlightRange(4, "new", activeHighlight)).toBe(false);
    });

    it("returns false when the line is above the range", () => {
      expect(isWithinHighlightRange(11, "new", activeHighlight)).toBe(false);
    });
  });

  describe("when the highlight is a single line", () => {
    const activeHighlight = {
      isHighlighting: false,
      start: 5,
      end: 5,
      side: "new" as const,
    };

    it("returns true for the single highlighted line", () => {
      expect(isWithinHighlightRange(5, "new", activeHighlight)).toBe(true);
    });

    it("returns false when the line is below the range", () => {
      expect(isWithinHighlightRange(4, "new", activeHighlight)).toBe(false);
    });

    it("returns false when the line is above the range", () => {
      expect(isWithinHighlightRange(6, "new", activeHighlight)).toBe(false);
    });
  });
});
