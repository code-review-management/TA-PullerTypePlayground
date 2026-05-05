import { render, screen } from "@testing-library/react";
import PullBodyHeader from "./PullBodyHeader";
import { getExamplePull1 } from "@/mocks/tests/pulls";

jest.mock("../StateChip/StateChip", () => ({
  __esModule: true,
  default: () => <div data-testid="state-chip" />,
}));

jest.mock("../../_utils/date-utils", () => ({
  formatRelativeDate: () => "formatteddate",
}));

jest.mock("../../_utils/pull-utils", () => ({
  getPullState: () => "",
}));

jest.mock("@/app/(pages)/_components/UserIcon/UserIcon", () => ({
  __esModule: true,
  default: () => <div data-testid="user-icon" />,
}));

jest.mock("../BranchDisplay/BranchDisplay", () => ({
  __esModule: true,
  default: () => <div data-testid="branch-display" />,
}));

describe("Pull body header", () => {
  const examplePull1 = getExamplePull1();

  it("renders the repo name in a heading", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(
      screen.getByRole("heading", { name: examplePull1.base?.repo.name || "" }),
    );
  });

  it("renders the pull title and number in a heading", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(
      screen.getByRole("heading", {
        name: `${examplePull1.title || ""} #${examplePull1.number}`,
      }),
    );
  });

  it("renders the state chip component", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByTestId("state-chip")).toBeDefined();
  });

  it("renders the pull author avatar and username", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByTestId("user-icon")).toBeDefined();
    expect(screen.getByText(examplePull1.user?.login || "")).toBeDefined();
  });

  it("renders the branch display component", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByTestId("branch-display")).toBeDefined();
  });

  it("renders the relative date as text", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByText("Updated formatteddate ago")).toBeDefined();
  });

  it("renders the commits, changed files, additions, and deletions as text", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByText(`${examplePull1.commits} commits`)).toBeDefined();
    expect(
      screen.getByText(`${examplePull1.changed_files} files`),
    ).toBeDefined();
    expect(screen.getByText(`+${examplePull1.additions}`)).toBeDefined();
    expect(screen.getByText(`-${examplePull1.deletions}`)).toBeDefined();
  });
});
