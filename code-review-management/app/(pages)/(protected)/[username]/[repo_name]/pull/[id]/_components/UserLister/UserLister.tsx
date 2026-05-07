import Image from "next/image";
import styles from "./UserLister.module.css";
import UserIcon from "@/app/(pages)/_components/UserIcon/UserIcon";
import Subheader from "../Subheader/Subheader";
import { getListedUserIcon, listedUser } from "../../_utils/userlist-utils";

export type UserListType = "reviewers" | "assignees";

function UserListerStateIcon({ listedUser }: { listedUser: listedUser }) {
  const iconProps = getListedUserIcon(listedUser);
  if (!iconProps) return;

  const { src, size } = iconProps;

  return (
    <div className={styles.stateIconContainer}>
      <Image src={src} alt={src} width={size} height={size} />
    </div>
  );
}

/**
 * A row of the user list in the UserLister representing 1 user in the list.
 * @param username: Username of the listed user
 * @param imageSrc: String for the image source for the icon of the listed user.
 */
function UserListerRow({ listedUser }: { listedUser: listedUser }) {
  const { login, avatar_url } = listedUser.user;

  return (
    <div className={styles.userListerRow}>
      <div className={styles.userListerUser}>
        <UserIcon avatarUrl={avatar_url} username={login} size={25} />
        <h5 className={styles.username}>{login}</h5>
      </div>
      <UserListerStateIcon listedUser={listedUser} />
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
  userList: listedUser[];
}) {
  const headerDisplay = `${listType[0].toUpperCase()}${listType.slice(1)}`;

  return (
    <div className={styles.userLister}>
      <div className={styles.headerRow}>
        <Subheader>{headerDisplay}</Subheader>
        <Image
          className={styles.plusIcon}
          src="/icons/plus.svg"
          alt="Plus icon"
          height={12}
          width={12}
        />
      </div>
      <div className={styles.listedUsers}>
        {userList.map((listedUser) => (
          <UserListerRow listedUser={listedUser} key={listedUser.user.login} />
        ))}
      </div>
    </div>
  );
}
