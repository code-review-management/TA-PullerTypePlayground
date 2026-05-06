import { createExampleUser } from "@/mocks/tests/users";
import { buildAssigneeList, buildReviewerList } from "../userlist-utils";
import { createExampleReview } from "@/mocks/tests/reviews";

describe("buildReviewerList", () => {
  const user_abc = createExampleUser("abc", 1);
  const user_def = createExampleUser("def", 2);
  const user_ghi = createExampleUser("ghi", 3);

  const review_abc = createExampleReview(user_abc, 1);
  const review_def = createExampleReview(user_def, 2);
  const review_ghi = createExampleReview(user_ghi, 3);

  it("returns an empty array when given no requested reviewers and no reviews", () => {
    expect(buildReviewerList([], [])).toEqual([]);
  });

  it("returns a requested reviewer as a listedUser when only given one requested reviewer", () => {
    expect(buildReviewerList([user_abc], [])).toEqual([
      { state: "REQUESTED", user: user_abc },
    ]);
  });

  it("returns the requested reviewers as listedUsers, ordered by username, when only given requested reviewers", () => {
    expect(buildReviewerList([user_def, user_abc, user_ghi], [])).toEqual([
      { state: "REQUESTED", user: user_abc },
      { state: "REQUESTED", user: user_def },
      { state: "REQUESTED", user: user_ghi },
    ]);
  });

  it("returns reviewers from reviews as listedUsers, ordered by username, when only given reviews", () => {
    expect(buildReviewerList([], [review_def, review_abc, review_ghi])).toEqual(
      [
        { state: "APPROVED", user: user_abc },
        { state: "APPROVED", user: user_def },
        { state: "APPROVED", user: user_ghi },
      ],
    );
  });

  it("returns a reviewer from the review list only once, using its last given state", () => {
    expect(
      buildReviewerList([], [review_abc, review_def, review_abc, review_abc]),
    ).toEqual([
      { state: "APPROVED", user: user_abc },
      { state: "APPROVED", user: user_def },
    ]);
  });

  it("returns a reviewer with state REQUESTED for a user that is in a requested review and previously reviewed", () => {
    expect(
      buildReviewerList([user_abc], [review_abc, review_def, review_abc]),
    ).toEqual([
      { state: "REQUESTED", user: user_abc },
      { state: "APPROVED", user: user_def },
    ]);
  });

  it("returns REQUESTED users, sorted by username, before users of other states", () => {
    expect(
      buildReviewerList([user_def], [review_ghi, review_def, review_abc]),
    ).toEqual([
      { state: "REQUESTED", user: user_def },
      { state: "APPROVED", user: user_abc },
      { state: "APPROVED", user: user_ghi },
    ]);
  });
});

describe("buildAssigneeList", () => {
  const user_abc = createExampleUser("abc", 1);
  const user_def = createExampleUser("def", 2);
  const user_ghi = createExampleUser("ghi", 3);

  it("returns an empty array when given no assignees", () => {
    expect(buildAssigneeList([])).toEqual([]);
  });

  it("returns the assignees as listedUsers, sorted", () => {
    expect(buildAssigneeList([user_def, user_abc, user_ghi])).toEqual([
      { state: "ASSIGNED", user: user_abc },
      { state: "ASSIGNED", user: user_def },
      { state: "ASSIGNED", user: user_ghi },
    ]);
  });
});
