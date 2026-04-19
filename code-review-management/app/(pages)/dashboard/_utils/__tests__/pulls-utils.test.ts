import { PullRequest } from "@/types/github.types";
import { sortPullsByUpdated } from "../pulls-utils";
import { getDefaultPull } from "@/mocks/tests/pulls";

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

  it("returns an array with a single pull request when given an array with a single pull request", () => {
    const pulls = [createPull(DATE1)];
    expect(sortPullsByUpdated(pulls)).toEqual([createPull(DATE1)]);
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
