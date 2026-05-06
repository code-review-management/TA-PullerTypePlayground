import { getExampleUser1, getExampleUser2 } from "@/mocks/tests/users";
import { buildReviewerList } from "../userlist-utils";
import { getExampleReview1, getExampleReview2 } from "@/mocks/tests/reviews";

describe("buildReviewerList", () => {
  const exampleUser1 = getExampleUser1();
  const exampleUser2 = getExampleUser2();
  const exampleReview1 = getExampleReview1();
  const exampleReview2 = getExampleReview2();

  it("returns an empty array when given no requested reviewers and no reviews", () => {
    expect(buildReviewerList([], [])).toEqual([]);
  });

  it("returns the requested reviewers as listedUsers when only given requested reviewers", () => {
    expect(buildReviewerList([exampleUser1, exampleUser2], [])).toEqual([
      { state: "REQUESTED", user: exampleUser1 },
      { state: "REQUESTED", user: exampleUser2 },
    ]);
  });

  it("returns reviewers from reviews as listedUsers when only given reviews", () => {
    expect(buildReviewerList([], [exampleReview1, exampleReview2])).toEqual([
      { state: "APPROVED", user: exampleUser1 },
      { state: "CHANGES_REQUESTED", user: exampleUser2 },
    ]);
  });
});
