import { User } from "@/types/github.types";
import UserLister from "../UserLister/UserLister";

/**
 * Reviewers section of the PR view page.
 */
export default function Reviewers({ reviewers }: { reviewers: User[] }) {
  return <UserLister listType={"reviewers"} userList={reviewers} />;
}
