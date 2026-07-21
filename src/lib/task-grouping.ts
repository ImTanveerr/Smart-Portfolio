import { addDaysToKey, fromDateKey } from "@/lib/date";
import type { TaskFormValues } from "@/lib/validations";

export const PRIORITY_DOT_CLASS: Record<TaskFormValues["priority"], string> = {
  HIGH: "bg-destructive",
  MEDIUM: "bg-amber-500",
  LOW: "bg-muted-foreground/50",
};

export type SmartTask = {
  id: string;
  title: string;
  notes: string | null;
  done: boolean;
  priority: TaskFormValues["priority"];
  dueDate: string | null; // "yyyy-mm-dd" or null
  startTime: string | null; // "HH:mm" or null
  endTime: string | null;
  recurrence: TaskFormValues["recurrence"];
  seriesId: string | null;
  tags: string[];
  updatedAt: string; // ISO, used to order the Completed group by recency
};

export type TaskGroup = { key: string; label: string; tasks: SmartTask[] };

const PRIORITY_RANK: Record<TaskFormValues["priority"], number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const byPriorityThenTitle = (a: SmartTask, b: SmartTask) =>
  PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.title.localeCompare(b.title);

// Time-scheduled tasks sort chronologically first (so a same-day bucket
// reads like an actual agenda); untimed tasks fall back to priority.
const byTimeThenPriority = (a: SmartTask, b: SmartTask) => {
  if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime) || byPriorityThenTitle(a, b);
  if (a.startTime) return -1;
  if (b.startTime) return 1;
  return byPriorityThenTitle(a, b);
};

// Buckets active tasks by urgency (overdue > due today > upcoming > no due
// date) and sorts within each bucket - by time then priority for the two
// "today-ish" buckets, so the single most important/next thing to do is
// always the first row. Completed tasks collapse into their own group at
// the bottom, most recently finished first.
export function groupAndSortTasks(tasks: SmartTask[], todayKey: string): TaskGroup[] {
  const active = tasks.filter((task) => !task.done);
  const done = tasks.filter((task) => task.done);

  const overdue = active.filter((task) => task.dueDate && task.dueDate < todayKey);
  const dueToday = active.filter((task) => task.dueDate === todayKey);
  const upcoming = active.filter((task) => task.dueDate && task.dueDate > todayKey);
  const noDueDate = active.filter((task) => !task.dueDate);

  overdue.sort(byTimeThenPriority);
  dueToday.sort(byTimeThenPriority);
  upcoming.sort(
    (a, b) =>
      (a.dueDate as string).localeCompare(b.dueDate as string) || byTimeThenPriority(a, b)
  );
  noDueDate.sort(byPriorityThenTitle);
  done.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const groups: TaskGroup[] = [];
  if (overdue.length) groups.push({ key: "overdue", label: "Overdue", tasks: overdue });
  if (dueToday.length) groups.push({ key: "today", label: "Due today", tasks: dueToday });
  if (upcoming.length) groups.push({ key: "upcoming", label: "Upcoming", tasks: upcoming });
  if (noDueDate.length) groups.push({ key: "no-date", label: "No due date", tasks: noDueDate });
  if (done.length) groups.push({ key: "done", label: "Completed", tasks: done });

  return groups;
}

// Drives the "Today's focus" progress bar. A task with no due date is the
// backlog - the plain stuff you're expected to just get through today, no
// scheduling needed - so it counts toward today's focus exactly like
// something explicitly overdue or due today.
export function computeProgress(tasks: SmartTask[], todayKey: string) {
  const focus = tasks.filter((task) => !task.dueDate || task.dueDate <= todayKey);
  return {
    label: "Today's focus",
    done: focus.filter((task) => task.done).length,
    total: focus.length,
  };
}

// Human-friendly due date label: "Today"/"Tomorrow"/"Yesterday" for the
// near term, "3d overdue" once it's clearly late, otherwise a short date.
export function formatDueLabel(dueDate: string, todayKey: string): string {
  if (dueDate === todayKey) return "Today";

  const diffDays = Math.round(
    (fromDateKey(dueDate).getTime() - fromDateKey(todayKey).getTime()) / 86_400_000
  );

  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;
  return fromDateKey(dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// --- Workload: heatmap shading + the "this day is already full" nudge ---

const PRIORITY_LOAD_WEIGHT: Record<TaskFormValues["priority"], number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export const OVERLOAD_THRESHOLD = 6;

export function computeDayLoad(tasks: SmartTask[], dateKey: string): number {
  return tasks
    .filter((task) => !task.done && task.dueDate === dateKey)
    .reduce((sum, task) => sum + PRIORITY_LOAD_WEIGHT[task.priority], 0);
}

// 0-4 heat level for shading a calendar cell, independent of the exact
// weight thresholds so the UI can just map level -> a fixed set of classes.
export function heatLevel(load: number): 0 | 1 | 2 | 3 | 4 {
  if (load <= 0) return 0;
  if (load < 3) return 1;
  if (load < 6) return 2;
  if (load < 9) return 3;
  return 4;
}

// Looks over the week following `fromKey` for a noticeably lighter day than
// the one being added to, so the quick-add flow can nudge toward spreading
// work out instead of piling everything on one day. Never blocks adding -
// purely an inline suggestion.
export function findLighterDay(
  tasks: SmartTask[],
  fromKey: string,
  withinDays = 6
): string | null {
  const fromLoad = computeDayLoad(tasks, fromKey);
  let bestKey: string | null = null;
  let bestLoad = fromLoad;

  for (let i = 1; i <= withinDays; i++) {
    const candidateKey = addDaysToKey(fromKey, i);
    const load = computeDayLoad(tasks, candidateKey);
    if (load < bestLoad) {
      bestLoad = load;
      bestKey = candidateKey;
    }
  }

  return bestKey;
}
