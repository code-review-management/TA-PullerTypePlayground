import { User } from "@/types/github.types";
import UserLister from "../UserLister/UserLister";

/**
 * Assignees section of the PR view page.
 */
export default function Assignees({ assignees }: { assignees: User[] }) {
  return <UserLister listType={"assignees"} userList={assignees} />;
}
