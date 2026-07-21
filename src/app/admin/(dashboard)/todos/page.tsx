import { prisma } from "@/lib/prisma";
import { TodoManager } from "@/components/admin/todo-manager";
import { AdminPageHeader } from "@/components/admin/page-header";
import { toDateKey } from "@/lib/date";
import { ensureRecurringOccurrences } from "@/lib/recurrence";

export default async function AdminTodosPage() {
  // Tops recurring series back up to the generation horizon before reading,
  // so a series that's run low always has its near-term occurrences ready.
  await ensureRecurringOccurrences();

  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "asc" } });

  const items = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    notes: task.notes,
    done: task.done,
    priority: task.priority,
    dueDate: task.dueDate ? toDateKey(task.dueDate) : null,
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
        title="Todo list"
        description='Smart-sorted by urgency. Try quick-add: "Team sync every monday 10am high priority #work".'
      />
      <TodoManager tasks={items} />
    </div>
  );
}
