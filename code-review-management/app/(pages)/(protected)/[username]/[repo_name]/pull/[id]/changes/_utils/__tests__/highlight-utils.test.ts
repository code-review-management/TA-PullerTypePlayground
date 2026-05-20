import {
  getDefaultDeleteChangeData,
  getDefaultInsertChangeData,
  getDefaultNormalChangeData,
} from "@/mocks/tests/diffs";
import {
  highlightOnMouseDown,
  highlightOnMouseEnter,
  isWithinHighlightRange,
} from "../highlight-utils";
import { ActiveHighlight } from "../../_hooks/useHighlight";

const mockCreateDraftThread = jest.fn();

jest.mock("../comment-utils", () => ({
  createDraftThread: () => mockCreateDraftThread(),
}));

const mockInsertChange = getDefaultInsertChangeData();
const mockDeleteChange = getDefaultDeleteChangeData();
const mockNormalChange = getDefaultNormalChangeData();

const makeActiveHighlightRef = (overrides: Partial<ActiveHighlight> = {}) => ({
  current: {
    isHighlighting: true,
    start: 3,
    end: 3,
    side: "new" as const,
    ...overrides,
  },
});

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
    it("returns false when querying 'old' but highlight is on 'new'", () => {
      expect(
        isWithinHighlightRange(7, "old", {
          isHighlighting: false,
          start: 5,
          end: 10,
          side: "new",
        }),
      ).toBe(false);
    });

    it("returns false when querying 'new' but highlight is on 'old'", () => {
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
    const activeHighlight = {
      isHighlighting: false,
      start: 5,
      end: 10,
      side: "new" as const,
    };

    it("returns false when the line is below the range", () => {
      expect(isWithinHighlightRange(4, "new", activeHighlight)).toBe(false);
    });

    it("returns false when the line is above the range", () => {
      expect(isWithinHighlightRange(11, "new", activeHighlight)).toBe(false);
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
          start: mockDeleteChange.lineNumber,
          end: mockDeleteChange.lineNumber,
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

describe("highlightOnMouseEnter", () => {
  describe("does not update the highlight", () => {
    it("when isHighlighting is false", () => {
      const setActiveHighlightSync = jest.fn();
      const activeHighlightRef = makeActiveHighlightRef({
        isHighlighting: false,
      });

      highlightOnMouseEnter(
        mockNormalChange,
        "new",
        activeHighlightRef,
        setActiveHighlightSync,
      );
      expect(setActiveHighlightSync).not.toHaveBeenCalled();
    });

    it("when the entered side (old) does not match the highlight's side (new)", () => {
      const setActiveHighlightSync = jest.fn();
      const activeHighlightRef = makeActiveHighlightRef({ side: "new" });

      highlightOnMouseEnter(
        mockNormalChange,
        "old",
        activeHighlightRef,
        setActiveHighlightSync,
      );
      expect(setActiveHighlightSync).not.toHaveBeenCalled();
    });

    it("when the entered side (new) does not match the highlight's side (old)", () => {
      const setActiveHighlightSync = jest.fn();
      const activeHighlightRef = makeActiveHighlightRef({ side: "old" });

      highlightOnMouseEnter(
        mockNormalChange,
        "new",
        activeHighlightRef,
        setActiveHighlightSync,
      );
      expect(setActiveHighlightSync).not.toHaveBeenCalled();
    });
  });

  describe("extends the highlight's end to the entered line", () => {
    it("for inserted changes", () => {
      const setActiveHighlightSync = jest.fn();
      const activeHighlightRef = makeActiveHighlightRef({ side: "new" });

      highlightOnMouseEnter(
        getDefaultInsertChangeData({ lineNumber: 5 }),
        "new",
        activeHighlightRef,
        setActiveHighlightSync,
      );
      expect(setActiveHighlightSync).toHaveBeenCalledWith({
        isHighlighting: true,
        start: 3,
        end: 5,
        side: "new",
      });
    });

    it("for deleted changes", () => {
      const setActiveHighlightSync = jest.fn();
      const activeHighlightRef = makeActiveHighlightRef({ side: "old" });

      highlightOnMouseEnter(
        getDefaultDeleteChangeData({ lineNumber: 5 }),
        "old",
        activeHighlightRef,
        setActiveHighlightSync,
      );
      expect(setActiveHighlightSync).toHaveBeenCalledWith({
        isHighlighting: true,
        start: 3,
        end: 5,
        side: "old",
      });
    });

    it("for normal changes on the new side", () => {
      const setActiveHighlightSync = jest.fn();
      const activeHighlightRef = makeActiveHighlightRef({ side: "new" });

      highlightOnMouseEnter(
        getDefaultNormalChangeData({ oldLineNumber: 1, newLineNumber: 5 }),
        "new",
        activeHighlightRef,
        setActiveHighlightSync,
      );
      expect(setActiveHighlightSync).toHaveBeenCalledWith({
        isHighlighting: true,
        start: 3,
        end: 5,
        side: "new",
      });
    });

    it("for normal changes on the old side", () => {
      const setActiveHighlightSync = jest.fn();
      const activeHighlightRef = makeActiveHighlightRef({ side: "old" });

      highlightOnMouseEnter(
        getDefaultNormalChangeData({ oldLineNumber: 1, newLineNumber: 5 }),
        "old",
        activeHighlightRef,
        setActiveHighlightSync,
      );
      expect(setActiveHighlightSync).toHaveBeenCalledWith({
        isHighlighting: true,
        start: 3,
        end: 1,
        side: "old",
      });
    });
  });
});
