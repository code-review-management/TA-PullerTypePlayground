import Image from "next/image";
import styles from "./UserIcon.module.css";

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
    <div className={styles.userIcon} style={{height: size, width: size}}>
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
