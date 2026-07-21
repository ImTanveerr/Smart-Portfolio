"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { taskSchema, type TaskFormValues } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import { addDays, fromDateKey, toDateKey } from "@/lib/date";
import {
  addRecurrenceInterval,
  MAX_GENERATED_OCCURRENCES,
  RECURRENCE_HORIZON_DAYS,
} from "@/lib/recurrence";
import type { ActionResult } from "@/lib/actions/types";

function revalidateTaskPages() {
  revalidatePath("/admin/todos");
  revalidatePath("/admin/calendar");
}

export async function createTask(values: TaskFormValues): Promise<ActionResult> {
  await requireAdmin();

  const parsed = taskSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const base = {
    title: data.title,
    notes: data.notes || null,
    priority: data.priority,
    tags: data.tags,
    startTime: data.startTime || null,
    endTime: data.endTime || null,
  };

  if (data.recurrence !== "NONE" && data.dueDate) {
    // Materialize occurrences up front rather than computing them on the
    // fly - see src/lib/recurrence.ts for why, and how they're kept topped
    // up over time.
    const seriesId = randomUUID();
    const horizonKey = toDateKey(addDays(new Date(), RECURRENCE_HORIZON_DAYS));
    const rows: (typeof base & {
      recurrence: TaskFormValues["recurrence"];
      seriesId: string;
      dueDate: Date;
    })[] = [];

    let cursor = data.dueDate;
    while (cursor <= horizonKey && rows.length < MAX_GENERATED_OCCURRENCES) {
      rows.push({ ...base, recurrence: data.recurrence, seriesId, dueDate: fromDateKey(cursor) });
      cursor = addRecurrenceInterval(cursor, data.recurrence);
    }

    await prisma.task.createMany({ data: rows });
  } else {
    await prisma.task.create({
      data: { ...base, dueDate: data.dueDate ? fromDateKey(data.dueDate) : null },
    });
  }

  revalidateTaskPages();
  return { success: true };
}

export async function toggleTask(id: string, done: boolean): Promise<ActionResult> {
  await requireAdmin();

  await prisma.task.update({ where: { id }, data: { done } });

  revalidateTaskPages();
  return { success: true };
}

// A single flexible update used for everything that can change after a task
// exists: title, priority, notes, tags, due date (drag-and-drop
// rescheduling), and time - every field editable from the task row's
// expanded detail panel. Only the keys actually passed are touched.
export async function updateTask(
  id: string,
  values: Partial<
    Pick<TaskFormValues, "title" | "notes" | "priority" | "tags" | "dueDate" | "startTime" | "endTime">
  >
): Promise<ActionResult> {
  await requireAdmin();

  const title = values.title?.trim();

  await prisma.task.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(values.notes !== undefined && { notes: values.notes || null }),
      ...(values.priority !== undefined && { priority: values.priority }),
      ...(values.tags !== undefined && { tags: values.tags }),
      ...(values.dueDate !== undefined && {
        dueDate: values.dueDate ? fromDateKey(values.dueDate) : null,
      }),
      ...(values.startTime !== undefined && { startTime: values.startTime || null }),
      ...(values.endTime !== undefined && { endTime: values.endTime || null }),
    },
  });

  revalidateTaskPages();
  return { success: true };
}

export async function deleteTask(id: string): Promise<ActionResult> {
  await requireAdmin();

  await prisma.task.delete({ where: { id } });

  revalidateTaskPages();
  return { success: true };
}

// Deletes this and every future occurrence of a recurring series (past,
// already-completed occurrences are left alone as history).
export async function deleteTaskSeries(seriesId: string): Promise<ActionResult> {
  await requireAdmin();

  const todayKey = toDateKey(new Date());
  await prisma.task.deleteMany({
    where: { seriesId, dueDate: { gte: fromDateKey(todayKey) } },
  });

  revalidateTaskPages();
  return { success: true };
}
