import { PullRequest } from "@/types/github.types";
import { sortPullsByUpdated } from "../pulls-utils";
import { getDefaultPull } from "@/mocks/tests/pulls";

// Example date strings from least to most recent
const DATE1 = "2026-04-17T00:00:00Z";
const DATE2 = "2026-04-18T00:00:00Z";
const DATE3 = "2026-04-19T00:00:00Z";
const DATE4 = "2026-04-19T00:00:01Z";

function createPull(updated_at: string): PullRequest {
  return {
    ...getDefaultPull(),
    updated_at,
  };
}

describe("sortPullsByUpdated", () => {
  it("returns an empty array when given no pull requests", () => {
    expect(sortPullsByUpdated([])).toEqual([]);
  });

  it("preserves the array when it only has one item", () => {
    const pulls = [createPull(DATE1)];
    expect(sortPullsByUpdated(pulls)).toEqual([createPull(DATE1)]);
  });

  it("preserves order when arrays are already sorted by update time", () => {
    const pulls = [
      createPull(DATE4),
      createPull(DATE3),
      createPull(DATE2),
      createPull(DATE1),
    ];
    expect(sortPullsByUpdated(pulls)).toEqual([
      createPull(DATE4),
      createPull(DATE3),
      createPull(DATE2),
      createPull(DATE1),
    ]);
  });

  it("sorts an unsorted array of pull requests", () => {
    const pulls = [
      createPull(DATE3),
      createPull(DATE2),
      createPull(DATE4),
      createPull(DATE1),
    ];
    expect(sortPullsByUpdated(pulls)).toEqual([
      createPull(DATE4),
      createPull(DATE3),
      createPull(DATE2),
      createPull(DATE1),
    ]);
  });
});
