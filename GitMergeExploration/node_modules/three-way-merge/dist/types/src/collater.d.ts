import { Outcome } from './outcomes';
import MergeResult from './merge-result';
export declare type JoinFunction = (a: string[]) => string;
export declare type ConflictFunction = (a: Outcome[]) => any;
export default class Collater {
    static collateMerge(mergeResult: Outcome[], joinFunction: JoinFunction, conflictHandler: ConflictFunction): MergeResult;
    static combineNonConflicts(results: Outcome[]): Outcome[];
}
