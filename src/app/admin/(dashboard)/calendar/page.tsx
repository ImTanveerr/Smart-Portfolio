import { prisma } from "@/lib/prisma";
import { CalendarManager } from "@/components/admin/calendar-manager";
import { AdminPageHeader } from "@/components/admin/page-header";
import { toDateKey } from "@/lib/date";
import { ensureRecurringOccurrences } from "@/lib/recurrence";

export default async function AdminCalendarPage() {
  // Tops recurring series back up to the generation horizon before reading,
  // so a series that's run low always has its near-term occurrences ready.
  await ensureRecurringOccurrences();

  const tasks = await prisma.task.findMany({
    where: { dueDate: { not: null } },
    orderBy: { dueDate: "asc" },
  });

  // Dates are formatted to "yyyy-mm-dd" here on the server so the client
  // component only ever deals with plain strings, not Date objects that
  // could shift a day depending on the browser's timezone.
  const calendarTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    notes: task.notes,
    done: task.done,
    priority: task.priority,
    dueDate: toDateKey(task.dueDate as Date),
    startTime: task.startTime,
    endTime: task.endTime,
    recurrence: task.recurrence,
    seriesId: task.seriesId,
    tags: task.tags,
    updatedAt: task.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Calendar"
        description="Any todo with a due date shows up here automatically. Drag a task onto another day to reschedule it."
      />
      <CalendarManager tasks={calendarTasks} />
    </div>
  );
}
