"use client";

import { useState } from "react";
import CodeView from "../CodeView/CodeView";
import styles from "./DiffView.module.css"
import { diffLines } from 'diff';

export type CodeLine = {
    value: string;
    isRemoved: boolean;
    isAdded: boolean;
};

type Comment = {
    value: string;
    lineNum: number;
    inProgress: boolean;
}

function LineComment({ comment, setComments, comments } : {
    comment: Comment,
    setComments: (comments: Comment[]) => void,
    comments: Comment[],
}) {
    const [commentText, setCommentText] = useState("");

    return(
        <div className={styles.comment}>
            { !comment.inProgress && <p>Line {comment.lineNum}</p> }
            { comment.inProgress ? 
                <textarea
                    value={commentText}
                    onChange={(e) => {
                        setCommentText(e.target.value);
                    }}
                />
                : 
                <p>{comment.value}</p>
            }
            { comment.inProgress &&
                <button 
                    className={styles.commentButton}
                    onClick={() => {
                        const newComments = [...comments];
                        newComments[newComments.length - 1].inProgress = false;
                        newComments[newComments.length - 1].value = commentText;
                        setComments(newComments);
                    }}
                >Finish</button>
            }
        </div>
    );
}

export default function DiffView({ message1, message2 } : {
    message1: string,
    message2: string,
}) {
    const [comments, setComments] = useState<Comment[]>([]);

    function makeNewComment(lineNum: number) {
        const newComments: Comment[] = [...comments, {value: "", lineNum, inProgress: true}];
        console.log(newComments);
        setComments(newComments);
    }

    const diff = diffLines(message1, message2);

    const leftLines: CodeLine[] = [];
    const rightLines: CodeLine[] = [];

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
        <div className={styles.wrapper}>
            <div className={styles.diffView}>
                <div className={styles.codeViewWrapper}>
                    <CodeView lines={leftLines} />
                </div>
                <div className={styles.codeViewWrapper}>
                    <CodeView lines={rightLines} commentCallback={makeNewComment} />
                </div>
            </div>
            <div className={styles.commentColumn}>
                <div className={styles.commentView}>
                    { comments.map((comment: Comment, idx: number) => 
                        <LineComment 
                            comment={comment} 
                            comments={comments}
                            setComments={setComments}
                            key={idx}
                        />
                    ) }
                </div>
            </div>
        </div>
    );
}