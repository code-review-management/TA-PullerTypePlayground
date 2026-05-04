import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { getExampleLinePublishedThreadItem1 } from "@/mocks/tests/threads";
import { getDefaultAuthenticatedSession } from "@/mocks/tests/session";
import userEvent from "@testing-library/user-event";
import InlineDraftReplyTrigger from "./InlineDraftReplyTrigger";

const mockUseSession = jest.fn();
const mockSetDraftReplies = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

jest.mock("../../_contexts/DraftRepliesContext", () => ({
  useDraftRepliesContext: () => ({
    setDraftReplies: mockSetDraftReplies,
  }),
}));

jest.mock("../../_hooks/useDraftReplies", () => ({
  getDraftReplyKey: () => "mock-key",
}));

jest.mock("@components/UserIcon/UserIcon", () => ({
  __esModule: true,
  default: ({
    avatarUrl,
    username,
  }: {
    avatarUrl: string;
    username: string;
  }) => (
    <div
      data-testid="user-icon"
      data-avatar-url={avatarUrl}
      data-username={username}
    />
  ),
}));

describe("InlineDraftReplyTrigger", () => {
  const mockThread = getExampleLinePublishedThreadItem1();
  const mockSession = getDefaultAuthenticatedSession();

  beforeEach(() => {
    jest.resetAllMocks();
    // Since mocks are reset to clear .mockReturnValue instances, restore
    // implementation here.
    mockUseSession.mockReturnValue({
      data: mockSession,
    });
  });

  describe("user icon", () => {
    it("renders the user icon", () => {
      render(<InlineDraftReplyTrigger thread={mockThread} />);
      expect(screen.getByTestId("user-icon")).toBeInTheDocument();
    });

    it("uses the session image as the avatar url", () => {
      render(<InlineDraftReplyTrigger thread={mockThread} />);
      expect(screen.getByTestId("user-icon")).toHaveAttribute(
        "data-avatar-url",
        "example-user-image",
      );
    });

    it("uses fallback image as the avatar url if session image is missing", () => {
      mockUseSession.mockReturnValue({ data: null });
      render(<InlineDraftReplyTrigger thread={mockThread} />);
      expect(screen.getByTestId("user-icon")).toHaveAttribute(
        "data-avatar-url",
        "/mock/octocat.png",
      );
    });

    it("uses the github login as the username", () => {
      render(<InlineDraftReplyTrigger thread={mockThread} />);
      expect(screen.getByTestId("user-icon")).toHaveAttribute(
        "data-username",
        "example-user-github-login",
      );
    });

    it("uses empty string as the username when github login is missing", () => {
      mockUseSession.mockReturnValue({ data: null });
      render(<InlineDraftReplyTrigger thread={mockThread} />);
      expect(screen.getByTestId("user-icon")).toHaveAttribute(
        "data-username",
        "",
      );
    });
  });

  describe("reply button", () => {
    it("renders the reply button", () => {
      render(<InlineDraftReplyTrigger thread={mockThread} />);
      expect(screen.getByRole("button", { name: "Reply" })).toBeInTheDocument();
    });

    it("calls setDraftReplies when clicked", async () => {
      const user = userEvent.setup();
      render(<InlineDraftReplyTrigger thread={mockThread} />);
      await user.click(screen.getByRole("button", { name: "Reply" }));
      expect(mockSetDraftReplies).toHaveBeenCalledTimes(1);
    });

    it("adds a new draft reply in the setDraftReplies callback", async () => {
      const user = userEvent.setup();
      render(<InlineDraftReplyTrigger thread={mockThread} />);
      await user.click(screen.getByRole("button", { name: "Reply" }));

      const setDraftRepliesCallback = mockSetDraftReplies.mock.lastCall[0];
      expect(setDraftRepliesCallback({})).toEqual({
        "mock-key": {
          filename: "filename.ts",
          parentId: 1,
          body: "",
        },
      });
    });

    it("does not override existing draft replies in the setDraftReplies callback", async () => {
      const user = userEvent.setup();
      render(<InlineDraftReplyTrigger thread={mockThread} />);
      await user.click(screen.getByRole("button", { name: "Reply" }));

      const setDraftRepliesCallback = mockSetDraftReplies.mock.lastCall[0];
      const newState = setDraftRepliesCallback({
        "key-1": { filename: "a.ts", parentId: 2, body: "body 1" },
        "key-2": { filename: "b.ts", parentId: 3, body: "body 2" },
      });
      expect(newState).toEqual({
        "key-1": { filename: "a.ts", parentId: 2, body: "body 1" },
        "key-2": { filename: "b.ts", parentId: 3, body: "body 2" },
        "mock-key": {
          filename: "filename.ts",
          parentId: 1,
          body: "",
        },
      });
    });
  });
});
