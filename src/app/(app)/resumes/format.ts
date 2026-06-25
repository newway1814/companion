/** Formats a resume timestamp as e.g. "Oct 24, 2023". */
export function formatResumeDate(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
