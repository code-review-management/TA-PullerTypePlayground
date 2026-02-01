import LineSeparatedCodeView from "../LineSeparatedCodeView/LineSeparatedCodeView";
import styles from "./DiffView.module.css"
import { diffLines } from 'diff';

type codeLine = {
    value: string,
    isRemoved: boolean,
    isAdded: boolean,
}

export default function DiffView({ message1, message2 } : {
    message1: string,
    message2: string,
}) {
    const diff = diffLines(message1, message2);

    const leftLines: codeLine[] = [];
    const rightLines: codeLine[] = [];

    console.log(diff);

    for (let i = 0; i < diff.length; i++) {
        const part = diff[i];

        // helper to split lines cleanly
        // prevent double newline
        const splitLines = (value: string) => {
            const lines = value.split("\n");
            if (lines[lines.length - 1] === "") lines.pop();
            return lines;
        };

        // replacement (remove and add subsequently)
        if (part.removed && diff[i + 1]?.added) {
            const removedLines = splitLines(part.value);
            const addedLines = splitLines(diff[i + 1].value);

            const maxLen = Math.max(removedLines.length, addedLines.length);

            for (let j = 0; j < maxLen; j++) {
                if (removedLines[j]) {
                    leftLines.push()
                }
                if (removedLines[j]) {
                    leftLines.push({
                        value: removedLines[j],
                        isRemoved: true,
                        isAdded: false,
                    });
                    rightLines.push({
                        value: addedLines[j],
                        isRemoved: false,
                        isAdded: true,
                    });
                } else {
                    leftLines.push({value: "", isRemoved: false, isAdded: false});
                    rightLines.push({value: "", isRemoved: false, isAdded: false});
                }
            }

            i++; // skip added block after consumption
            continue;
        }

        // added only
        if (part.added) {
            const lines = splitLines(part.value);
            for (const line of lines) {
                leftLines.push({value: "", isRemoved: false, isAdded: false});
                rightLines.push({
                    value: line,
                    isRemoved: false,
                    isAdded: true,
                });
            }
            continue;
        }

        // removed only
        if (part.removed) {
            const lines = splitLines(part.value);
            for (const line of lines) {
                leftLines.push({
                    value: line,
                    isRemoved: true,
                    isAdded: false,
                });
                rightLines.push({value: "", isRemoved: false, isAdded: false});
            }
            continue;
        }

        // unchanged
        const lines = splitLines(part.value);
        for (const line of lines) {
            leftLines.push({
                value: line,
                isRemoved: false,
                isAdded: false,
            });
            rightLines.push({
                value: line,
                isRemoved: false,
                isAdded: false,
            });
        }
    }

    return (
        <div className={styles.diffView}>
            <LineSeparatedCodeView message={leftLines} commentable={false} />
            <LineSeparatedCodeView message={rightLines} commentable={true} />
        </div>
    );
}