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
 * @param abbreviated Whether or not to use the abbreviated form: "2h", "33m", "<1m", "2d", "2y"
 */
export function formatRelativeDate(date: Date, abbreviated: boolean = false) {
  const times: { milliseconds: number; text: string; abbr: string }[] = [
    { milliseconds: 60000, text: "minute", abbr: "m" },
    { milliseconds: 3600000, text: "hour", abbr: "h" },
    { milliseconds: 86400000, text: "day", abbr: "d" },
    { milliseconds: 604800000, text: "week", abbr: "w" },
    { milliseconds: 2628000000, text: "month", abbr: "mo" },
    { milliseconds: 31556952000, text: "year", abbr: "y" },
  ];

  const currTime = new Date().getTime();
  const timeDifference = currTime - date.getTime();
  for (const timeUnits of times.reverse()) {
    const { milliseconds, text, abbr } = timeUnits;
    if (timeDifference >= milliseconds) {
      const num_units = Math.round(timeDifference / milliseconds);
      const isPlural = num_units != 1;
      if (abbreviated) {
        return `${num_units}${abbr}`;
      }
      return `${num_units} ${text}${isPlural ? "s" : ""}`;
    }
  }

  return abbreviated ? "<1m" : "less than 1 minute";
}
