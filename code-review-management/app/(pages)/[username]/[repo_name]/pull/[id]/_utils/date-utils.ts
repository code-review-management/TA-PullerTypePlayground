/**
 * Formats a Date object into a string with the format [month(abbr)], [day], [year] at [time12]
 * Example:
 *  Thu Feb 19 2026 13:22:36 GMT-0800 (Pacific Standard Time) -> Feb 19, 2026 at 1:34 PM
 * @param date Date object
 * @returns Formatted string
 */
export function formatDate(date: Date) {
  const month = date.toLocaleString("default", { month: "short" });
  const timeString = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${month} ${date.getDay()}, ${date.getFullYear()} at ${timeString}`;
}
