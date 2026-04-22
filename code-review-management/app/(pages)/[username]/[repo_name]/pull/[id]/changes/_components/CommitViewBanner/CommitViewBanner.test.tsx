import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommitViewBanner from "./CommitViewBanner";

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useParams: () => ({
    username: "owner",
    repo_name: "repo",
    id: "1",
  }),
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

const mockSetSelectedSha = jest.fn();
jest.mock("../../../_contexts/CommitPickerContext", () => ({
  useCommitPickerContext: () => ({
    setSelectedSha: mockSetSelectedSha,
  }),
}));

describe("CommitViewBanner", () => {
  const mockSha = "ab102f9301df14";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders message with shortened SHA", () => {
    render(<CommitViewBanner sha={mockSha} />);
    expect(screen.getByTestId("commit-view-banner")).toHaveTextContent(
      "Commenting is disabled while viewing commit ab102f9",
    );
  });

  it("renders back to all changes button", () => {
    render(<CommitViewBanner sha={mockSha} />);
    expect(
      screen.getByRole("button", { name: "Back to all changes" }),
    ).toBeInTheDocument();
  });

  it("routes the user to the default changes page on button click", async () => {
    const user = userEvent.setup();
    render(<CommitViewBanner sha={mockSha} />);
    await user.click(
      screen.getByRole("button", { name: "Back to all changes" }),
    );
    expect(mockRouterPush).toHaveBeenCalledWith("/owner/repo/pull/1/changes");
  });

  it("sets the selected sha to null on button click", async () => {
    const user = userEvent.setup();
    render(<CommitViewBanner sha={mockSha} />);
    await user.click(
      screen.getByRole("button", { name: "Back to all changes" }),
    );
    expect(mockSetSelectedSha).toHaveBeenCalledWith(null);
  });
});
