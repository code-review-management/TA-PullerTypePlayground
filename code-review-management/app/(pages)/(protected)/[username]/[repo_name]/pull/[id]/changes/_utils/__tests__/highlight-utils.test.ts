import {
  getDefaultDeleteChangeData,
  getDefaultInsertChangeData,
  getDefaultNormalChangeData,
} from "@/mocks/tests/diffs";
import {
  highlightOnMouseDown,
  isWithinHighlightRange,
} from "../highlight-utils";

const mockCreateDraftThread = jest.fn();

jest.mock("../comment-utils", () => ({
  createDraftThread: () => mockCreateDraftThread(),
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

describe("highlightOnMouseDown", () => {
  const mockInsertChange = getDefaultInsertChangeData();
  const mockDeleteChange = getDefaultDeleteChangeData();
  const mockNormalChange = getDefaultNormalChangeData();

  describe("starts a highlight session at the clicked line", () => {
    it("for inserted changes", () => {
      const setActiveHighlightSync = jest.fn();
      highlightOnMouseDown(mockInsertChange, "new", setActiveHighlightSync);
      expect(setActiveHighlightSync).toHaveBeenCalledWith(
        expect.objectContaining({
          isHighlighting: true,
          start: mockInsertChange.lineNumber,
          end: mockInsertChange.lineNumber,
          side: "new",
        }),
      );
    });

    it("for deleted changes", () => {
      const setActiveHighlightSync = jest.fn();
      highlightOnMouseDown(mockDeleteChange, "old", setActiveHighlightSync);
      expect(setActiveHighlightSync).toHaveBeenCalledWith(
        expect.objectContaining({
          isHighlighting: true,
          start: mockInsertChange.lineNumber,
          end: mockInsertChange.lineNumber,
          side: "old",
        }),
      );
    });

    it("for normal changes on the new side", () => {
      const setActiveHighlightSync = jest.fn();
      highlightOnMouseDown(mockNormalChange, "new", setActiveHighlightSync);
      expect(setActiveHighlightSync).toHaveBeenCalledWith({
        isHighlighting: true,
        start: mockNormalChange.newLineNumber,
        end: mockNormalChange.newLineNumber,
        side: "new",
      });
    });

    it("or normal changes on the old side", () => {
      const setActiveHighlightSync = jest.fn();
      highlightOnMouseDown(mockNormalChange, "old", setActiveHighlightSync);
      expect(setActiveHighlightSync).toHaveBeenCalledWith({
        isHighlighting: true,
        start: mockNormalChange.oldLineNumber,
        end: mockNormalChange.oldLineNumber,
        side: "old",
      });
    });
  });
});
