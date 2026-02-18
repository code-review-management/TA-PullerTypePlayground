import { type ConflictBlock } from "./conflictBlock"

const START_MARKER = "<<<<<<<";
const DIVIDER_MARKER = "=======";
const END_MARKER = ">>>>>>>";

/**
 * Parses a string representing a file to obtain merge conflict blocks.
 * Uses generated markers to determine the start, divider, and end of each conflict.
 * Returns: mapping of line number (start of each block) to its ConflictBlock object.
 */
export default function getConflictBlocks(value: string): Map<number, ConflictBlock> {
    const conflictBlocks= new Map<number, ConflictBlock>();

    let currentStart = -1
    let currentDivider = -1

    const lines = value.split('\n');

    for (let idx = 0; idx < lines.length; idx ++) {
        const lineNum = idx + 1;
        const line = lines[idx];
        if (line.startsWith(START_MARKER)) {
            currentStart = lineNum;
        } else if (line.startsWith(DIVIDER_MARKER)) {
            currentDivider = lineNum;
        } else if (line.startsWith(END_MARKER)) {
            if (!conflictBlocks.has(currentStart) && currentStart !== -1 && currentDivider > currentStart) {
                const block: ConflictBlock = {
                    start: currentStart,
                    divider: currentDivider,
                    end: lineNum,
                };
                conflictBlocks.set(currentStart, block);
            }
        }
    }

    return conflictBlocks;
}
