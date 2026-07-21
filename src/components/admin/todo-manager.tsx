"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, ChevronRight, Inbox, Repeat } from "lucide-react";
import { taskSchema, TASK_PRIORITY_LABELS, TASK_RECURRENCE_LABELS } from "@/lib/validations";
import { createTask, deleteTask, deleteTaskSeries, toggleTask, updateTask } from "@/lib/actions/tasks";
import { parseQuickAdd } from "@/lib/parse-quick-add";
import {
  groupAndSortTasks,
  computeProgress,
  formatDueLabel,
  PRIORITY_DOT_CLASS,
  type SmartTask,
} from "@/lib/task-grouping";
import { formatTimeLabel } from "@/lib/time";
import { toDateKey } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskRow, type TaskUpdatePayload } from "@/components/admin/task-row";

type UpdatePayload = TaskUpdatePayload;

export function TodoManager({ tasks }: { tasks: SmartTask[] }) {
  const router = useRouter();
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const [quickAdd, setQuickAdd] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [timeOpen, setTimeOpen] = useState(false);
  const [startTimeDraft, setStartTimeDraft] = useState("");
  const [endTimeDraft, setEndTimeDraft] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const preview = useMemo(() => (quickAdd.trim() ? parseQuickAdd(quickAdd) : null), [quickAdd]);
  const groups = useMemo(() => groupAndSortTasks(tasks, todayKey), [tasks, todayKey]);
  const progress = useMemo(() => computeProgress(tasks, todayKey), [tasks, todayKey]);

  // The todo list is one dataset split two ways: tasks with no due date are
  // your plain backlog (left); tasks with a due date are exactly what the
  // calendar page shows, grouped the same way (overdue/today/upcoming) on
  // the right - so this page reads as "backlog" + "what my calendar says is
  // coming up," not two unrelated lists.
  const backlogGroup = groups.find((group) => group.key === "no-date");
  const scheduledGroups = groups.filter(
    (group) => group.key === "overdue" || group.key === "today" || group.key === "upcoming"
  );
  const completedGroup = groups.find((group) => group.key === "done");

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!quickAdd.trim()) return;

    const parsed = parseQuickAdd(quickAdd);
    const validated = taskSchema.safeParse({
      ...parsed,
      notes: notesDraft,
      // Explicit time picker wins over whatever quick-add text parsed, if set.
      startTime: startTimeDraft || parsed.startTime,
      endTime: startTimeDraft ? endTimeDraft : parsed.endTime,
    });
    if (!validated.success) {
      setError(validated.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    startTransition(async () => {
      const result = await createTask(validated.data);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setQuickAdd("");
      setNotesDraft("");
      setNotesOpen(false);
      setStartTimeDraft("");
      setEndTimeDraft("");
      setTimeOpen(false);
      router.refresh();
    });
  }

  function handleToggle(id: string, done: boolean) {
    startTransition(async () => {
      await toggleTask(id, done);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTask(id);
      router.refresh();
    });
  }

  function handleDeleteSeries(seriesId: string) {
    startTransition(async () => {
      await deleteTaskSeries(seriesId);
      router.refresh();
    });
  }

  function handleUpdate(id: string, values: UpdatePayload) {
    startTransition(async () => {
      await updateTask(id, values);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {progress.total > 0 && (
        <Card size="sm">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{progress.label}</span>
              <span className="font-medium">
                {progress.done}/{progress.total}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)] transition-all"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card size="sm">
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-2">
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <label htmlFor="quick-add" className="text-sm font-medium">
                  Add a task
                </label>
                <Input
                  id="quick-add"
                  placeholder='Try "Team sync every monday 10am high priority #work"'
                  value={quickAdd}
                  onChange={(event) => setQuickAdd(event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={() => setTimeOpen((value) => !value)}>
                {timeOpen ? "Hide time" : "+ Time"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setNotesOpen((value) => !value)}>
                {notesOpen ? "Hide notes" : "+ Notes"}
              </Button>
              <Button type="submit" disabled={isPending || !quickAdd.trim()}>
                Add
              </Button>
            </div>

            {timeOpen && (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  aria-label="Start time"
                  value={startTimeDraft}
                  onChange={(event) => setStartTimeDraft(event.target.value)}
                  className="h-8 w-28"
                />
                <span className="text-sm text-muted-foreground">–</span>
                <Input
                  type="time"
                  aria-label="End time"
                  value={endTimeDraft}
                  disabled={!startTimeDraft}
                  onChange={(event) => setEndTimeDraft(event.target.value)}
                  className="h-8 w-28"
                />
              </div>
            )}

            {preview &&
              (preview.dueDate ||
                preview.priority !== "MEDIUM" ||
                preview.tags.length > 0 ||
                preview.recurrence !== "NONE") && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Parsed:</span>
                  {preview.dueDate && (
                    <Badge variant="outline">{formatDueLabel(preview.dueDate, todayKey)}</Badge>
                  )}
                  {preview.startTime && (
                    <Badge variant="outline">
                      {formatTimeLabel(preview.startTime)}
                      {preview.endTime && `–${formatTimeLabel(preview.endTime)}`}
                    </Badge>
                  )}
                  {preview.recurrence !== "NONE" && (
                    <Badge variant="outline" className="gap-1">
                      <Repeat className="size-3" />
                      {TASK_RECURRENCE_LABELS[preview.recurrence]}
                    </Badge>
                  )}
                  {preview.priority !== "MEDIUM" && (
                    <Badge variant="outline" className="gap-1">
                      <span
                        className={cn("size-1.5 rounded-full", PRIORITY_DOT_CLASS[preview.priority])}
                      />
                      {TASK_PRIORITY_LABELS[preview.priority]}
                    </Badge>
                  )}
                  {preview.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

            {notesOpen && (
              <Textarea
                rows={2}
                placeholder="Add details for this task..."
                value={notesDraft}
                onChange={(event) => setNotesDraft(event.target.value)}
              />
            )}
          </form>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="size-4 text-muted-foreground" />
              Backlog
            </CardTitle>
            <CardDescription>No due date set - treated as due today.</CardDescription>
            <CardAction>
              <Badge variant="secondary">{backlogGroup?.tasks.length ?? 0}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            {backlogGroup ? (
              backlogGroup.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  todayKey={todayKey}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onDeleteSeries={handleDeleteSeries}
                  onUpdate={handleUpdate}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nothing in your backlog.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" />
              From your calendar
            </CardTitle>
            <CardDescription>Everything with a due date, most urgent first.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing on your calendar.</p>
            ) : (
              scheduledGroups.map((group) => (
                <div key={group.key} className="space-y-2">
                  <h3
                    className={cn(
                      "text-xs font-medium",
                      group.key === "overdue" ? "text-destructive" : "text-muted-foreground"
                    )}
                  >
                    {group.label} ({group.tasks.length})
                  </h3>
                  <div className="space-y-2">
                    {group.tasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        todayKey={todayKey}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onDeleteSeries={handleDeleteSeries}
                        onUpdate={handleUpdate}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {completedGroup && (
        <div>
          <button
            type="button"
            onClick={() => setShowCompleted((value) => !value)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            {showCompleted ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            Completed ({completedGroup.tasks.length})
          </button>
          {showCompleted && (
            <div className="mt-2 space-y-2">
              {completedGroup.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  todayKey={todayKey}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onDeleteSeries={handleDeleteSeries}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
