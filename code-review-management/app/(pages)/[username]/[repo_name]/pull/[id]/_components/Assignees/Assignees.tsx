import UserLister from "../UserLister/UserLister";

export default function Assignees() {
    const listedUsers = [
        {
            username: "octocat",
            imageSrc: "/mock/octocat.png",
        },
    ];

    return(
        <UserLister listType={"assignees"} userList={listedUsers}/>
    );
}
