import styles from "./page.module.css"
import ConflictResolution from "@/app/(components)/CodeRendering/ConflictResolution/ConflictResolution";

export default function Page() {
    return (
        <div className={styles.page}>
            <h1>Conflict Resolution</h1>
            <ConflictResolution/>
        </div>
    );
}