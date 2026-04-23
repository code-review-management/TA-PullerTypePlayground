import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { getDefaultDraftItem } from "@/mocks/tests/threads";
import userEvent from "@testing-library/user-event";
import DraftEditorActions from "./DraftEditorActions";

jest.mock("next/navigation", () => ({
  useParams: () => ({
    username: "owner",
    repo_name: "repo",
    id: "1",
  }),
}));

const mockUseSubmitDraftItem = jest.fn();
const mockUseMarkdownEditorContext = jest.fn();

jest.mock("@components/LoadingSpinner/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner" />,
}));

jest.mock("../../_hooks/useSubmitDraftItem", () => ({
  useSubmitDraftItem: () => mockUseSubmitDraftItem(),
}));

jest.mock("@components/MarkdownEditor/MarkdownEditorContext", () => ({
  useMarkdownEditorContext: () => mockUseMarkdownEditorContext(),
}));

describe("DraftEditorActions", () => {
  const mockDraft = getDefaultDraftItem();
  const defaultUseSubmitDraftItem = {
    isSubmitPending: false,
    isPullPending: false,
    handleSubmit: jest.fn(),
  };
  const defaultUseMarkdownEditorContext = {
    editorContent: "example markdown body",
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockUseSubmitDraftItem.mockReturnValue(defaultUseSubmitDraftItem);
    mockUseMarkdownEditorContext.mockReturnValue(
      defaultUseMarkdownEditorContext,
    );
  });

  describe("loading spinner", () => {
    it("renders loading spinner if submit is pending", () => {
      mockUseSubmitDraftItem.mockReturnValue({
        ...defaultUseSubmitDraftItem,
        isSubmitPending: true,
      });
      render(<DraftEditorActions draft={mockDraft} />);
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("does not render loading spinner if submit is not pending", () => {
      render(<DraftEditorActions draft={mockDraft} />);
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  describe("publish button", () => {
    it("renders the publish button", () => {
      render(<DraftEditorActions draft={mockDraft} />);
      expect(screen.getByAltText("Arrow up")).toBeInTheDocument();
    });

    it("is enabled when neither draft is blank nor pull is pending", () => {
      render(<DraftEditorActions draft={mockDraft} />);
      expect(
        screen.getByRole("button", { name: "Arrow up" }),
      ).not.toHaveAttribute("disabled");
    });

    it("is disabled when draft is blank", () => {
      mockUseMarkdownEditorContext.mockReturnValue({
        editorContent: "",
      });
      render(<DraftEditorActions draft={mockDraft} />);
      expect(screen.getByRole("button", { name: "Arrow up" })).toHaveAttribute(
        "disabled",
      );
    });

    it("is disabled when pull is pending", () => {
      mockUseSubmitDraftItem.mockReturnValue({
        ...defaultUseSubmitDraftItem,
        isPullPending: true,
      });
      render(<DraftEditorActions draft={mockDraft} />);
      expect(screen.getByRole("button", { name: "Arrow up" })).toHaveAttribute(
        "disabled",
      );
    });

    it("calls handleSubmit on click", async () => {
      const user = userEvent.setup();
      render(<DraftEditorActions draft={mockDraft} />);
      await user.click(screen.getByRole("button", { name: "Arrow up" }));
      expect(defaultUseSubmitDraftItem.handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
