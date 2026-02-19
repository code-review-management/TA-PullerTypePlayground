import Image from "next/image";
import styles from "./UserLister.module.css";

export type UserListType = "reviewers" | "assignees";

/**
 * A row of the user list in the UserLister representing 1 user in the list.
 * @param username: Username of the listed user
 * @param imageSrc: String for the image source for the icon of the listed user.
 */
function UserListerRow({
  username,
  imageSrc,
}: {
  username: string;
  imageSrc: string;
}) {
  return (
    <div className={styles.userListerRow}>
      <Image src={imageSrc} alt={`@${username}`} width={25} height={25} />
      <h5 className={styles.username}>{username}</h5>
    </div>
  );
}

/**
 * A section of the PR view page where users can be dynamically added and the current list is displayed.
 * Used for the reviewers and assignees section of the PR view page.
 * @param listType: reviewers or assignees
 * @param userList: A list of users. Currently a user is defined as type { username: string; imageSrc: string; }
 * TODO: Add "add" functionality
 * TODO: Use correct type for userList
 */
export default function UserLister({
  listType,
  userList,
}: {
  listType: UserListType;
  userList: { username: string; imageSrc: string }[];
}) {
  const headerDisplay = `${listType[0].toUpperCase()}${listType.slice(1)}`;

  return (
    <div className={styles.userLister}>
      <div className={styles.headerRow}>
        <h4>{headerDisplay}</h4>
        <Image
          className={styles.plusIcon}
          src="/icons/plus.svg"
          alt="Plus icon"
          height={12}
          width={12}
        />
      </div>
      <div className={styles.listedUsers}>
        {userList.map((user, idx) => (
          <UserListerRow
            username={user.username}
            imageSrc={user.imageSrc}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
}
