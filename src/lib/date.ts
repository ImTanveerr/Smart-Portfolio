// Shared "yyyy-mm-dd" day-key helpers used by the todo/calendar feature.
// Everything works in local time (not UTC) so a day boundary matches what a
// person actually means by "today" instead of shifting around midnight UTC.

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function addDaysToKey(key: string, days: number): string {
  return toDateKey(addDays(fromDateKey(key), days));
}
