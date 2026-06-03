import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { getExampleThreadDraftItem1 } from "@/mocks/tests/threads";
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
  const mockDraft = getExampleThreadDraftItem1();

  const defaultUseSubmitDraftItem = {
    isSubmitPending: false,
    isPullPending: false,
    handleSubmit: jest.fn(),
  };

  const defaultUseMarkdownEditorContext = {
    editorContent: "example-editor-content",
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
});
