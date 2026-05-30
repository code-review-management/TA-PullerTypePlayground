import styles from "./CodeView.module.css";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { CodeLine } from "../DiffView/DiffView";

export default function CodeView({
    lines,
    commentCallback,
}: {
    lines: CodeLine[];
    commentCallback?: (lineNum: number) => void;
}) {
    return (
        <div className={styles.codeView}>
            <pre className={styles.codeBlock}>
                <code>
                    {lines.map((line) => (
                        <span>
                            {line.value}
                        </span>
                    ))}
                </code>
            </pre>

            {commentCallback && (
                <div className={styles.commentColumn}>
                    {lines.map((_, idx) => (
                        <div
                            className={styles.commentButtonWrapper}
                            key={idx}
                        >
                            <button
                                className={styles.commentButton}
                                onClick={() => {commentCallback(idx + 1)}}
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
