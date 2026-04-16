import { render, screen } from "@testing-library/react";
import PullBodyHeader from "./PullBodyHeader";
import { getExamplePull1 } from "@/types/github.defaults";

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
  it("renders the pull title", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByText(examplePull1.base?.repo.name || "")).toBeDefined();
  });

  it("renders the pull number", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByText(`#${examplePull1.number}`)).toBeDefined();
  });

  it("renders the state chip", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByTestId("state-chip")).toBeDefined();
  });

  it("renders the branch display", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByTestId("branch-display")).toBeDefined();
  });

  it("renders the relative date", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByText("Updated formatteddate ago")).toBeDefined();
  });

  it("renders the commits, changed files, additions, and deletions", () => {
    render(<PullBodyHeader pullData={examplePull1} />);
    expect(screen.getByText(`${examplePull1.commits} commits`)).toBeDefined();
    expect(
      screen.getByText(`${examplePull1.changed_files} files`),
    ).toBeDefined();
    expect(screen.getByText(`+${examplePull1.additions}`)).toBeDefined();
    expect(screen.getByText(`-${examplePull1.deletions}`)).toBeDefined();
  });
});
