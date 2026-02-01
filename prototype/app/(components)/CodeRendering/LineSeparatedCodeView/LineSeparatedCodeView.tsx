import styles from "./LineSeparatedCodeView.module.css"
import { HiOutlinePlusSmall } from "react-icons/hi2";

type codeLine = {
    value: string,
    isRemoved: boolean,
    isAdded: boolean,
}

function CodeViewLine({ line, lineNum, commentable } : {
    line: codeLine,
    lineNum: number,
    commentable: boolean,
}) {
    return(
        <div className={`${styles.codeViewLine} ${line.isAdded && styles.lineAdded} ${line.isRemoved && styles.lineRemoved}`} >
            <div className={styles.lineText}>{ line.value }</div>
            <div className={styles.commentButtonWrapper}>
                { commentable && <button
                    className={styles.commentButton}
                    onClick={() => {
                        console.log("clicked", lineNum);
                    }}
                >
                    <HiOutlinePlusSmall />
                </button> }
            </div>
        </div>
    );
}

export default function LineSeparatedCodeView({ message, commentable } : {
    message: codeLine[],
    commentable: boolean,
}) {
    // console.log(message);

    return(
        <div className={styles.codeView}>
            { message.map((line: codeLine, idx: number) => 
                <CodeViewLine line={line} lineNum={idx + 1} commentable={commentable} key={idx}/>
            ) }
        </div>
    );
}