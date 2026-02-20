import { Outcome } from './outcomes';
export default function (leftLabel: string, baseLabel: string, rightLabel: string, joinFunction: Function): (results: Outcome[]) => string;
