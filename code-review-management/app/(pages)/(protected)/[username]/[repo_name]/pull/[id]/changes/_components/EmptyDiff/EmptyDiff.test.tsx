import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { createDiff, createFileMetaItem } from "@/mocks/tests/filetree";
import EmptyDiff from "./EmptyDiff";

describe("EmptyDiff", () => {
  it("renders correct message if file is binary", () => {
    render(<EmptyDiff diff={createDiff({ isBinary: true })} />);
    expect(screen.getByText("Binary file not shown.")).toBeInTheDocument();
  });

  it("renders correct message if file is renamed without changes", () => {
    render(
      <EmptyDiff
        diff={createDiff({})}
        fileMeta={createFileMetaItem({ status: "renamed", changes: 0 })}
      />,
    );
    expect(
      screen.getByText("File renamed without changes."),
    ).toBeInTheDocument();
  });

  it("renders correct message if file is neither binary nor renamed without changes", () => {
    render(<EmptyDiff diff={createDiff({})} />);
    expect(screen.getByText("File contents not shown.")).toBeInTheDocument();
  });

  it("renders correct message if file is binary and renamed without changes", () => {
    render(
      <EmptyDiff
        diff={createDiff({ isBinary: true })}
        fileMeta={createFileMetaItem({ status: "renamed", changes: 0 })}
      />,
    );
    expect(
      screen.getByText("Binary file not shown. File renamed without changes."),
    ).toBeInTheDocument();
  });
});
