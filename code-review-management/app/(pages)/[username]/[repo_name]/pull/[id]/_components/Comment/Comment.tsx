import Image from "next/image";
import styles from "./Comment.module.css"

export default function Comment({ username, createdAt, description } : {
    username: string,
    createdAt: string,
    description: string,
}) {
    return (
        <div className={styles.comment}>
            <div className={styles.tempUserIcon}>
                <Image src="/mock/octocat.png" alt="@octocat" fill />
            </div> {/** TODO: Replace with user icon component */}
            <div className={styles.commentContent}>
                <div className={styles.usernameAndDate}>
                    <h5 className={styles.username}>{username}</h5>
                    <p className={styles.date}>
                        {createdAt}
                    </p>
                </div>
                <div className={styles.description} dangerouslySetInnerHTML={{__html: description}} />
            </div>
        </div>
    );
}
