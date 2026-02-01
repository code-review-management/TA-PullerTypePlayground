import styles from "./CodeView.module.css";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { CodeLine } from "../DiffView/DiffView";

export default function CodeView({
    lines,
    commentable,
}: {
    lines: CodeLine[];
    commentable: boolean;
}) {
    return (
        <div className={styles.codeView}>
            <pre className={styles.codeBlock}>
                <code>
                    {lines.map((line, idx) => (
                        <span
                            key={idx}
                            className={`${styles.line} ${
                                line.isAdded ? styles.lineAdded : ""
                            } ${
                                line.isRemoved ? styles.lineRemoved : ""
                            }`}
                        >
                            {line.value}
                            {"\n"}
                        </span>
                    ))}
                </code>
            </pre>

            {commentable && (
                <div className={styles.commentColumn}>
                    {lines.map((_, idx) => (
                        <div
                            className={styles.commentButtonWrapper}
                            key={idx}
                        >
                            <button
                                className={styles.commentButton}
                                onClick={() => console.log("clicked", idx + 1)}
                            >
                                <HiOutlinePlusSmall />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
