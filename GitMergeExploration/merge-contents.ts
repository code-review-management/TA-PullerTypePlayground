import * as Diff3 from 'node-diff3';                   // ESM import all
import { merge } from 'node-diff3';               // ESM import named

export const attemptFileMerge = (ancestor: string, target: string, feature: string): string | null => {
    const base = ancestor.split('\n')
    const theirs = target.split('\n')
    const ours = feature.split('\n')
    
    const mergeOutput = Diff3.merge(ours, base, theirs);
    const result = mergeOutput.result.join('\n');
    return result
}