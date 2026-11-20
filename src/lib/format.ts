import { format, formatDistanceToNowStrict, isToday } from "date-fns";

export function timeAgo(iso: string) {
  const diff = Date.now() - Date.parse(iso);
  if (diff < 45_000) return "just now";
  return `${formatDistanceToNowStrict(new Date(iso))} ago`;
}

export function shortDate(iso: string) {
  const d = new Date(iso);
  return isToday(d) ? `Today, ${format(d, "h:mm a")}` : format(d, "d MMM, h:mm a");
}

export function longDate(iso: string) {
  return format(new Date(iso), "d MMM yyyy");
}

export function clockTime(iso: string) {
  return format(new Date(iso), "h:mm a");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
