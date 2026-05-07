import { Review, User } from "@/types/github.types";
import ReviewApprove from "@/public/icons/userList/review_approve.svg";
import ReviewRequestChanges from "@/public/icons/userList/review_request_changes.svg";
import ReviewComment from "@/public/icons/userList/review_comment.svg";
import ReviewWaiting from "@/public/icons/userList/review_waiting.svg";

type listedUserState =
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "COMMENTED"
  | "DISMISSED"
  | "REQUESTED"
  | "ASSIGNED";

export type listedUser = {
  state: listedUserState;
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

function getUserIconTooltipText(user: listedUser) {
  const state = user.state;
  const username = user.user.login;
  return (() => {
    switch (state) {
      case "APPROVED":
        return `${username} approved these changes`;
      case "CHANGES_REQUESTED":
        return `${username} requested changes`;
      case "COMMENTED":
        return `${username} left review comments`;
      case "DISMISSED":
        return `${username} previously left a review`;
      case "REQUESTED":
        return `Awaiting requested review from ${username}`;
      default:
        return "";
    }
  })();
}

type listedUserStateIcon = { src: string; size: number; tooltip?: string };

const LISTED_USER_STATE_ICONS: Record<
  listedUserState,
  listedUserStateIcon | null
> = {
  APPROVED: { src: ReviewApprove, size: 18 },
  CHANGES_REQUESTED: { src: ReviewRequestChanges, size: 18 },
  COMMENTED: { src: ReviewComment, size: 18 },
  DISMISSED: { src: ReviewComment, size: 18 },
  REQUESTED: { src: ReviewWaiting, size: 8 },
  ASSIGNED: null,
};

export function getListedUserIcon(user: listedUser) {
  const tooltip = getUserIconTooltipText(user);
  return { ...LISTED_USER_STATE_ICONS[user.state], tooltip };
}
