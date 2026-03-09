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

  return `${month} ${date.getDate()}, ${date.getFullYear()} at ${timeString}`;
}

/**
 * Formats a Date object into a string indicating how long ago [date] was.
 * Examples: "2 hours ago", "33 minutes ago", "less than a minute ago", "2 days ago", "2 years ago"
 * @param date
 */
export function formatRelativeDate(date: Date) {
  const times: { milliseconds: number; text: string }[] = [
    { milliseconds: 60000, text: "minute" },
    { milliseconds: 3600000, text: "hour" },
    { milliseconds: 86400000, text: "day" },
    { milliseconds: 604800000, text: "week" },
    { milliseconds: 2628000000, text: "month" },
    { milliseconds: 31556952000, text: "year" },
  ];

  const currTime = new Date().getTime();
  const timeDifference = currTime - date.getTime();
  for (const timePair of times.reverse()) {
    const { milliseconds, text } = timePair;
    if (timeDifference >= milliseconds) {
      const num_units = Math.round(timeDifference / milliseconds);
      const isPlural = num_units != 1;
      return `${num_units} ${text}${isPlural ? "s" : ""}`;
    }
  }

  return "less than 1 minute"
}
