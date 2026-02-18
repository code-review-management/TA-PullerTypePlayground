import UserLister from "../UserLister/UserLister";

export default function Reviewers() {
    const listedUsers = [
        {
            username: "octodog",
            imageSrc: "/mock/octodog.png",
        },
    ];
    
    return(
        <UserLister listType={"reviewers"} userList={listedUsers}/>
    );
}
