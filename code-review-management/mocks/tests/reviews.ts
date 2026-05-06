import { Review, User } from "@/types/github.types";
import { getExampleUser1, getExampleUser2 } from "./users";

export function getExampleReview1(): Review {
  return {
    id: 1,
    user: getExampleUser1(),
    body: "",
    html_url: "",
    state: "APPROVED",
    author_association: "COLLABORATOR",
  };
}

export function getExampleReview2(): Review {
  return {
    id: 1,
    user: getExampleUser2(),
    body: "",
    html_url: "",
    state: "CHANGES_REQUESTED",
    author_association: "COLLABORATOR",
  };
}

export function createExampleReview(
  user: User,
  id: number,
  state:
    | "APPROVED"
    | "CHANGES_REQUESTED"
    | "COMMENTED"
    | "DISMISSED" = "APPROVED",
): Review {
  return {
    id,
    user,
    body: "",
    html_url: "",
    state,
    author_association: "COLLABORATOR",
  };
}
