import { User } from "@/types/github.types";
import UserLister from "../UserLister/UserLister";

/**
 * Assignees section of the PR view page.
 */
export default function Assignees({assignees}: {assignees:User[]}) {
  // TODO: Pass in props for listed users and to edit listed users.
  const listedUsers = [
    {
      username: "octocat",
      imageSrc: "/mock/octocat.png",
    },
  ];

  return <UserLister listType={"assignees"} userList={assignees} />;
}
