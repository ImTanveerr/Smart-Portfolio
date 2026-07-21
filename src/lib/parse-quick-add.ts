import * as chrono from "chrono-node";
import { toDateKey } from "@/lib/date";
import type { TaskFormValues } from "@/lib/validations";

export type QuickAddResult = Pick<
  TaskFormValues,
  "title" | "dueDate" | "priority" | "tags" | "startTime" | "endTime" | "recurrence"
>;

const HIGH_PRIORITY_RE = /\b(high priority|urgent|asap|important)\b/i;
const LOW_PRIORITY_RE = /\b(low priority|someday|whenever)\b/i;
const TAG_RE = /(^|\s)#([a-z0-9_-]+)/gi;
const RECURRENCE_RE =
  /\bevery\s+(day|week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// Turns one line of free text into structured task fields: a due date and
// time (via chrono-node), a priority and recurrence (keyword match), and
// hashtags as tags - stripping each matched fragment out of the text left
// behind so the saved title reads naturally instead of keeping raw phrases
// like "tomorrow 3pm #work every week" in it.
export function parseQuickAdd(input: string): QuickAddResult {
  let text = input;
  let priority: TaskFormValues["priority"] = "MEDIUM";
  let recurrence: TaskFormValues["recurrence"] = "NONE";

  if (HIGH_PRIORITY_RE.test(text)) {
    priority = "HIGH";
    text = text.replace(HIGH_PRIORITY_RE, " ");
  } else if (LOW_PRIORITY_RE.test(text)) {
    priority = "LOW";
    text = text.replace(LOW_PRIORITY_RE, " ");
  }

  const recurrenceMatch = text.match(RECURRENCE_RE);
  if (recurrenceMatch) {
    const unit = recurrenceMatch[1].toLowerCase();
    if (unit === "day") {
      recurrence = "DAILY";
      text = text.replace(RECURRENCE_RE, " ");
    } else if (unit === "week") {
      recurrence = "WEEKLY";
      text = text.replace(RECURRENCE_RE, " ");
    } else if (unit === "month") {
      recurrence = "MONTHLY";
      text = text.replace(RECURRENCE_RE, " ");
    } else {
      // "every monday" -> WEEKLY, but keep the weekday word itself so
      // chrono below still resolves the actual starting date from it.
      recurrence = "WEEKLY";
      text = text.replace(RECURRENCE_RE, unit);
    }
  }

  const tags: string[] = [];
  text = text.replace(TAG_RE, (_match, lead: string, tag: string) => {
    tags.push(tag.toLowerCase());
    return lead;
  });

  let dueDate = "";
  let startTime = "";
  let endTime = "";
  const [result] = chrono.parse(text, new Date(), { forwardDate: true });
  if (result) {
    dueDate = toDateKey(result.start.date());
    if (result.start.isCertain("hour")) {
      startTime = `${pad2(result.start.get("hour")!)}:${pad2(result.start.get("minute") ?? 0)}`;
    }
    if (result.end?.isCertain("hour")) {
      endTime = `${pad2(result.end.get("hour")!)}:${pad2(result.end.get("minute") ?? 0)}`;
    }

    let start = result.index;
    const end = result.index + result.text.length;
    // Swallow a connector word right before the date phrase too ("finish
    // report by friday" -> "finish report"), so the saved title doesn't end
    // with a dangling preposition once the date itself is stripped out.
    const connector = text.slice(0, start).match(/\b(by|on|at|for|due)\s*$/i);
    if (connector) start -= connector[0].length;

    text = text.slice(0, start) + text.slice(end);
  }

  const title = text.replace(/\s{2,}/g, " ").trim() || input.trim();

  // A repeating task always needs a starting due date; "every day"/"every
  // month" imply starting today when no explicit date was mentioned.
  if (recurrence !== "NONE" && !dueDate) {
    dueDate = toDateKey(new Date());
  }

  return { title, dueDate, priority, tags, startTime, endTime, recurrence };
}
