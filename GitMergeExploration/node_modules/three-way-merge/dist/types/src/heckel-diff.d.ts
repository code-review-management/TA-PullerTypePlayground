export default class HeckelDiff {
    left: string[];
    right: string[];
    static executeDiff(oldTextArray: string[], newTextArray: string[]): {
        oldText: (string | TextNode)[];
        newText: (string | TextNode)[];
    };
    static diff(left: string[], right: string[]): ChangeRange[];
    constructor(left: string[], right: string[]);
    performDiff(): ChangeRange[];
    getDifferences(changeData: ChangeData, uniquePositions: UniquePositions): ChangeData;
    findNextChange(leftStartPos?: number, rightStartPos?: number): number[];
    findPrevChange(leftLo: number, rightLo: number, leftHi: number, rightHi: number): number[];
    mismatchOffset(lArr: string[], rArr: string[]): number;
    identifyUniquePositions(): Array<UniquePositions>;
    findUnique(array: string[]): Map<string, number>;
    appendChangeRange(changesRanges: ChangeRange[], leftLo: number, leftHi: number, rightLo: number, rightHi: number): ChangeRange[];
}
export declare type UniquePositions = [number, number];
export declare class TextNode {
    text: string;
    low: number;
    constructor(text: string, low: number);
}
export declare enum Action {
    change = "change",
    add = "add",
    remove = "remove",
}
export declare class ChangeRange {
    action: Action;
    leftLo: number;
    leftHi: number;
    rightLo: number;
    rightHi: number;
    constructor(action: Action, leftLo: number, leftHi: number, rightLo: number, rightHi: number);
}
export declare class ChangeData {
    leftChangePos: number;
    rightChangePos: number;
    changeRanges: ChangeRange[];
    constructor(leftChangePos: number, rightChangePos: number, changeRanges: ChangeRange[]);
}
