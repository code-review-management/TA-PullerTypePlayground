export declare abstract class Outcome {
    hasConflicts: boolean;
    isResolved(): boolean;
    isConflicted(): boolean;
    abstract apply(fun: Function): Outcome;
}
export declare type ConflictedOpts = {
    left: string[];
    right: string[];
    base: string[];
};
export declare class Conflicted extends Outcome {
    left: string[];
    base: string[];
    right: string[];
    static create(opts: ConflictedOpts): Conflicted;
    constructor(left: string[], base: string[], right: string[]);
    apply(fun: Function): Conflicted;
}
export declare class Resolved extends Outcome {
    combiner: Function;
    result: string[];
    constructor(result: string[]);
    combine(other: Resolved): void;
    apply(fun: Function): Resolved;
}
