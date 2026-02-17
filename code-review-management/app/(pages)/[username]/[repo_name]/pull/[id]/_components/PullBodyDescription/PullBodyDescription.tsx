import Comment from "../Comment/Comment";
import styles from "./PullBodyDescription.module.css"

export default function PullBodyDescription({ username, createdAt, description }: {
    username: string,
    createdAt: string,
    description: string,
}) {
    return(
        <div className={styles.pullBodyDescription}>
            <h4 className={styles.sectionTitle}>Description</h4>
            <Comment username={username} createdAt={createdAt} description={description} />
        </div>
    );
}
