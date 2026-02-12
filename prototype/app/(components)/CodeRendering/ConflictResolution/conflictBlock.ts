/**
 * Type to represent a conflict block.
 * start: The first line of the conflict block which includes the current marker.
 * divider: The middle of the conflict block dividing the current and incoming changes.
 * end: The last line of the conflict block which includes the incoming marker.
 */
export type ConflictBlock = {
  start: number;
  divider: number;
  end: number;
};
