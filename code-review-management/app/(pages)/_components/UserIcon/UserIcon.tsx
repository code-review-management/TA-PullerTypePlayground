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
  showTooltip,
}: {
  avatarUrl: string;
  username: string;
  size: number;
  showTooltip?: boolean;
}) {
  return (
    <a href={`https://github.com/${username}`}>
      <div
        className={styles.userIcon}
        style={{ height: size, width: size }}
        {...(showTooltip && {
          "data-tooltip-id": "user-icon-tooltip",
          "data-tooltip-content": username,
          "data-tooltip-delay-show": 100,
        })}
      >
        <Image
          className={styles.iconImage}
          src={avatarUrl}
          alt={`@${username}`}
          width={size}
          height={size}
        />
      </div>
    </a>
  );
}
