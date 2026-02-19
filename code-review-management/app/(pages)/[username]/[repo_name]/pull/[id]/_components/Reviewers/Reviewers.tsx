import UserLister from "../UserLister/UserLister";

/**
 * Reviewers section of the PR view page.
 */
export default function Reviewers() {
  // TODO: Pass in props for listed users and to edit listed users.
  const listedUsers = [
    {
      username: "octodog",
      imageSrc: "/mock/octodog.png",
    },
  ];

  return <UserLister listType={"reviewers"} userList={listedUsers} />;
}
