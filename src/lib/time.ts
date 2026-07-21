// "HH:mm" time-of-day helpers for the calendar's day agenda and overlap
// detection. Kept separate from date.ts (calendar days) since these work on
// a time-of-day string, not a Date.

const DEFAULT_DURATION_MINUTES = 30;

export function formatTimeLabel(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${hour12}${period}` : `${hour12}:${String(minute).padStart(2, "0")}${period}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [hour, minute] = time.split(":").map(Number);
  const total = (hour * 60 + minute + minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

// A task with only a start time still occupies a slot for conflict-checking
// purposes - it's just assumed to run the default duration.
export function effectiveEndTime(startTime: string, endTime: string | null): string {
  return endTime ?? addMinutesToTime(startTime, DEFAULT_DURATION_MINUTES);
}

// Returns the ids of every time-scheduled task that overlaps another one on
// the same day, so the agenda can flag double-bookings. O(n^2) is fine here
// since a single day's task list is always small.
export function findTimeConflicts(
  tasks: { id: string; startTime: string | null; endTime: string | null }[]
): Set<string> {
  const scheduled = tasks.filter(
    (task): task is typeof task & { startTime: string } => task.startTime !== null
  );
  const conflicts = new Set<string>();

  for (let i = 0; i < scheduled.length; i++) {
    const aEnd = effectiveEndTime(scheduled[i].startTime, scheduled[i].endTime);
    for (let j = i + 1; j < scheduled.length; j++) {
      const bEnd = effectiveEndTime(scheduled[j].startTime, scheduled[j].endTime);
      if (scheduled[i].startTime < bEnd && scheduled[j].startTime < aEnd) {
        conflicts.add(scheduled[i].id);
        conflicts.add(scheduled[j].id);
      }
    }
  }

  return conflicts;
}
