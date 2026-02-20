import { ChangeRange, Action } from './heckel-diff';
export declare class Diff2Command {
    code: Action;
    baseLo: number;
    baseHi: number;
    sideLo: number;
    sideHi: number;
    static fromChangeRange(changeRange: ChangeRange): Diff2Command;
    constructor(code: Action, baseLo: number, baseHi: number, sideLo: number, sideHi: number);
}
export default class Diff3 {
    left: string[];
    base: string[];
    right: string[];
    static executeDiff(left: string[], base: string[], right: string[]): Difference[];
    constructor(left: string[], base: string[], right: string[]);
    getDifferences(): Difference[];
    collapseDifferences(diffsQueue: DiffDoubleQueue, differences?: Difference[]): Difference[];
    buildResultQueue(diffsQueue: DiffDoubleQueue, prevBaseHi: number, resultQueue: DiffDoubleQueue): DiffDoubleQueue;
    queueIsFinished(queue: Diff2Command[], prevBaseHi: number): boolean;
    determineDifference(diffDiffsQueue: DiffDoubleQueue, initSide: Side, finalSide: Side): Difference;
    diffableEndpoints(commands: Diff2Command[], baseLo: number, baseHi: number): number[];
    decideAction(diffDiffsQueue: DiffDoubleQueue, leftSubset: string[], rightSubset: string[]): ChangeType;
}
export declare class Difference {
    changeType: ChangeType;
    leftLo: number;
    leftHi: number;
    rightLo: number;
    rightHi: number;
    baseLo: number;
    baseHi: number;
    constructor(changeType: ChangeType, leftLo: number, leftHi: number, rightLo: number, rightHi: number, baseLo: number, baseHi: number);
}
export declare enum ChangeType {
    chooseRight = "choose_right",
    chooseLeft = "choose_left",
    possibleConflict = "possible_conflict",
    noConflictFound = "no_conflict_found",
}
export declare enum Side {
    left = "left",
    right = "right",
}
export declare class DiffDoubleQueue {
    currentSide: Side;
    diffs: {
        [index: string]: Diff2Command[];
    };
    constructor(left?: Diff2Command[], right?: Diff2Command[]);
    dequeue(side?: Side): Diff2Command | undefined;
    peek(side?: Side): Diff2Command[];
    isFinished(): boolean;
    enqueue(side: Side | undefined, val: Diff2Command): number;
    get(side?: Side): Diff2Command[];
    isEmpty(side?: Side): boolean;
    switchSides(side?: Side): Side;
    chooseSide(): Side;
}
