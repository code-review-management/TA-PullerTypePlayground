import { Outcome } from './outcomes';
export default class MergeResult {
    results: Outcome[];
    joinFunction: Function;
    conflict: boolean;
    conflictHandler: Function | undefined;
    constructor(results: Outcome[], joinFunction: Function, options?: {
        conflictHandler?: Function | undefined;
        conflict?: boolean | undefined;
    });
    isSuccess(): boolean;
    isConflict(): boolean;
    joinedResults(): any;
}
