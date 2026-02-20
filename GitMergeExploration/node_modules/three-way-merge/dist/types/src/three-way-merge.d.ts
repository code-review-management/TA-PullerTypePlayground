import MergeResult from './merge-result';
import { JoinFunction, ConflictFunction } from './collater';
export interface DiffOptions {
    splitFunction: (s: string) => string[];
    joinFunction: JoinFunction;
    conflictFunction: ConflictFunction;
}
export default function merge(left: string, base: string, right: string, options?: DiffOptions): MergeResult;
