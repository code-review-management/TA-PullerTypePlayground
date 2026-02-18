import Image from "next/image";
import styles from "./UserLister.module.css"

export type UserListType = "reviewers" | "assignees";

function UserListerRow({ username, imageSrc } : {
    username: string,
    imageSrc: string,
}) {
    return(
        <div className={styles.userListerRow}>
            <Image src={imageSrc} alt={`@${username}`} width={25} height={25} />
            <h5 className={styles.username}>{username}</h5>
        </div>
    );
}

export default function UserLister({ listType, userList }: {
    listType: UserListType,
    userList: { username: string, imageSrc: string }[],
}) {
    const headerDisplay = `${listType[0].toUpperCase()}${listType.slice(1)}`;
    

    return(
        <div className={styles.userLister}>
            <div className={styles.headerRow}>
                <h4>{headerDisplay}</h4>
                <Image className={styles.plusIcon} src="/icons/plus.svg" alt="Plus icon" height={12} width={12} />
            </div>
            <div className={styles.listedUsers}>
                {userList.map((user, idx) => 
                    <UserListerRow username={user.username} imageSrc={user.imageSrc} key={idx}/>
                )}
            </div>
        </div>
    );
}
