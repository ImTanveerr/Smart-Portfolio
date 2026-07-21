import { prisma } from "@/lib/prisma";
import { addDays, addDaysToKey, fromDateKey, toDateKey } from "@/lib/date";
import type { TaskRecurrence } from "@/generated/prisma/client";

// How far ahead recurring tasks get materialized as real rows, and a safety
// cap on how many get generated in one pass (relevant for DAILY series,
// which would otherwise generate one row per day).
export const RECURRENCE_HORIZON_DAYS = 30;
export const MAX_GENERATED_OCCURRENCES = 60;

export function addRecurrenceInterval(dateKey: string, recurrence: TaskRecurrence): string {
  if (recurrence === "DAILY") return addDaysToKey(dateKey, 1);
  if (recurrence === "WEEKLY") return addDaysToKey(dateKey, 7);
  if (recurrence === "MONTHLY") {
    const date = fromDateKey(dateKey);
    date.setMonth(date.getMonth() + 1);
    return toDateKey(date);
  }
  return dateKey;
}

// Recurring tasks are materialized as individual Task rows (see the Prisma
// schema comment) rather than computed on the fly, generated only up to
// RECURRENCE_HORIZON_DAYS ahead. There's no background job to keep extending
// them over time, so instead this tops each series back up to the horizon
// whenever an admin page loads - cheap when a series is already caught up
// (the common case, since it's a no-op query per series), self-healing
// otherwise.
export async function ensureRecurringOccurrences(): Promise<void> {
  const horizonKey = toDateKey(addDays(new Date(), RECURRENCE_HORIZON_DAYS));

  const series = await prisma.task.groupBy({
    by: ["seriesId"],
    where: { seriesId: { not: null } },
    _max: { dueDate: true },
  });

  for (const entry of series) {
    if (!entry.seriesId || !entry._max.dueDate) continue;

    const maxKey = toDateKey(entry._max.dueDate);
    if (maxKey >= horizonKey) continue;

    const template = await prisma.task.findFirst({
      where: { seriesId: entry.seriesId },
      orderBy: { dueDate: "desc" },
    });
    if (!template || template.recurrence === "NONE") continue;

    const rows: {
      title: string;
      notes: string | null;
      priority: typeof template.priority;
      tags: string[];
      startTime: string | null;
      endTime: string | null;
      recurrence: TaskRecurrence;
      seriesId: string;
      dueDate: Date;
    }[] = [];

    let cursor = addRecurrenceInterval(maxKey, template.recurrence);
    while (cursor <= horizonKey && rows.length < MAX_GENERATED_OCCURRENCES) {
      rows.push({
        title: template.title,
        notes: template.notes,
        priority: template.priority,
        tags: template.tags,
        startTime: template.startTime,
        endTime: template.endTime,
        recurrence: template.recurrence,
        seriesId: entry.seriesId,
        dueDate: fromDateKey(cursor),
      });
      cursor = addRecurrenceInterval(cursor, template.recurrence);
    }

    if (rows.length > 0) {
      await prisma.task.createMany({ data: rows });
    }
  }
}
