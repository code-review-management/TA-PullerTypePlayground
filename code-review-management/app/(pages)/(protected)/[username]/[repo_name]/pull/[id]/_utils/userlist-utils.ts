import { Review, User } from "@/types/github.types";

export type listedUser = {
  state:
    | "APPROVED"
    | "CHANGES_REQUESTED"
    | "COMMENTED"
    | "DISMISSED"
    | "REQUESTED"
    | "ASSIGNED";
  user: User;
};

function sortUserList(userList: listedUser[]) {
  return userList.sort((userA, userB) => {
    if (userA.state === "REQUESTED" && userB.state !== "REQUESTED") return -1;
    if (userB.state === "REQUESTED" && userA.state !== "REQUESTED") return 1;

    return userA.user.login.localeCompare(userB.user.login);
  });
}

export function buildReviewerList(
  requested_reviewers: User[],
  reviews: Review[],
): listedUser[] {
  const reviewerIdMapping = new Map<number, listedUser>();

  reviews.forEach((review) => {
    if (!review.user) return;
    reviewerIdMapping.set(review.user.id, {
      state: review.state,
      user: review.user,
    });
  });

  requested_reviewers.forEach((reviewer) => {
    if (!reviewer) return;
    reviewerIdMapping.set(reviewer.id, { state: "REQUESTED", user: reviewer });
  });

  return sortUserList(Array.from(reviewerIdMapping.values()));
}

export function buildAssigneeList(assignees: User[]): listedUser[] {
  return sortUserList(
    assignees.flatMap((assignee) => ({
      state: "ASSIGNED",
      user: assignee,
    })),
  );
}
