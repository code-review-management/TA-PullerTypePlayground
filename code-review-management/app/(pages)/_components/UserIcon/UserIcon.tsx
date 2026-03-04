import Image from "next/image";
import styles from "./UserIcon.module.css";

/**
 * User icon image with given src, username for alt text, and size (width and height).
 * @param avatarUrl Image source URL, generally provided by API responses
 * @param username GitHub username of the user this icon is for, used to create alt text
 * @param size Used for height and width of the icon
 * @returns 
 */
export default function UserIcon({
  avatarUrl,
  username,
  size,
}: {
  avatarUrl: string;
  username: string;
  size: number;
}) {
  return (
    <div className={styles.userIcon} style={{ height: size, width: size }}>
      <Image
        className={styles.iconImage}
        src={avatarUrl}
        alt={`@${username}`}
        width={size}
        height={size}
      />
    </div>
  );
}
