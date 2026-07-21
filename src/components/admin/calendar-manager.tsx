"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { taskSchema } from "@/lib/validations";
import { createTask, deleteTask, deleteTaskSeries, toggleTask, updateTask } from "@/lib/actions/tasks";
import { parseQuickAdd } from "@/lib/parse-quick-add";
import {
  computeDayLoad,
  findLighterDay,
  formatDueLabel,
  heatLevel,
  OVERLOAD_THRESHOLD,
  PRIORITY_DOT_CLASS,
  type SmartTask,
} from "@/lib/task-grouping";
import { findTimeConflicts, formatTimeLabel } from "@/lib/time";
import { addDaysToKey, fromDateKey, toDateKey } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskRow, type TaskUpdatePayload } from "@/components/admin/task-row";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HEAT_CLASS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "",
  1: "bg-[var(--accent-a)]/10",
  2: "bg-[var(--accent-a)]/20",
  3: "bg-[var(--accent-a)]/35",
  4: "bg-destructive/20",
};

// Builds a full 6-week (42 cell) grid for the month containing `monthCursor`,
// padded with the trailing days of the previous/next month so every week row
// is complete — the usual month-calendar layout.
function buildMonthGrid(monthCursor: Date): Date[] {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return date;
  });
}

function buildWeekKeys(dateKey: string): string[] {
  const startOffset = -fromDateKey(dateKey).getDay();
  return Array.from({ length: 7 }, (_, i) => addDaysToKey(dateKey, startOffset + i));
}

export function CalendarManager({ tasks }: { tasks: SmartTask[] }) {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);

  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [monthCursor, setMonthCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [quickAdd, setQuickAdd] = useState("");
  const [timeOpen, setTimeOpen] = useState(false);
  const [startTimeDraft, setStartTimeDraft] = useState("");
  const [endTimeDraft, setEndTimeDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const tasksByDate = useMemo(() => {
    const map = new Map<string, SmartTask[]>();
    for (const task of tasks) {
      if (!task.dueDate) continue;
      const list = map.get(task.dueDate) ?? [];
      list.push(task);
      map.set(task.dueDate, list);
    }
    return map;
  }, [tasks]);

  const grid = useMemo(() => buildMonthGrid(monthCursor), [monthCursor]);
  const weekKeys = useMemo(() => buildWeekKeys(selectedKey), [selectedKey]);
  const selectedTasks = useMemo(() => tasksByDate.get(selectedKey) ?? [], [tasksByDate, selectedKey]);
  const scheduledTasks = useMemo(
    () =>
      selectedTasks
        .filter((task) => task.startTime)
        .sort((a, b) => (a.startTime as string).localeCompare(b.startTime as string)),
    [selectedTasks]
  );
  const allDayTasks = selectedTasks.filter((task) => !task.startTime);
  const conflicts = useMemo(() => findTimeConflicts(selectedTasks), [selectedTasks]);

  const addPreview = useMemo(() => (quickAdd.trim() ? parseQuickAdd(quickAdd) : null), [quickAdd]);
  const targetDateKey = addPreview?.dueDate || selectedKey;
  const targetLoad = useMemo(() => computeDayLoad(tasks, targetDateKey), [tasks, targetDateKey]);
  const lighterDayKey = useMemo(
    () => (quickAdd.trim() && targetLoad >= OVERLOAD_THRESHOLD ? findLighterDay(tasks, targetDateKey) : null),
    [tasks, targetDateKey, targetLoad, quickAdd]
  );

  function selectDate(dateKey: string) {
    setSelectedKey(dateKey);
    const date = fromDateKey(dateKey);
    setMonthCursor(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  function goToToday() {
    selectDate(todayKey);
  }

  function goBack() {
    if (viewMode === "month") {
      setMonthCursor((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
    } else {
      selectDate(addDaysToKey(selectedKey, -7));
    }
  }

  function goForward() {
    if (viewMode === "month") {
      setMonthCursor((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
    } else {
      selectDate(addDaysToKey(selectedKey, 7));
    }
  }

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!quickAdd.trim()) return;

    const parsed = parseQuickAdd(quickAdd);
    const validated = taskSchema.safeParse({
      ...parsed,
      dueDate: parsed.dueDate || selectedKey,
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

  function handleUpdate(id: string, values: TaskUpdatePayload) {
    startTransition(async () => {
      await updateTask(id, values);
      router.refresh();
    });
  }

  function handleReschedule(id: string, dateKey: string) {
    startTransition(async () => {
      await updateTask(id, { dueDate: dateKey });
      router.refresh();
    });
  }

  function dragHandlers(dateKey: string) {
    return {
      onDragOver: (event: React.DragEvent) => {
        event.preventDefault();
        setDragOverKey(dateKey);
      },
      onDragLeave: () => setDragOverKey((current) => (current === dateKey ? null : current)),
      onDrop: (event: React.DragEvent) => {
        event.preventDefault();
        const id = event.dataTransfer.getData("text/plain");
        setDragOverKey(null);
        if (id) handleReschedule(id, dateKey);
      },
    };
  }

  const selectedLabel = fromDateKey(selectedKey).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const headerLabel =
    viewMode === "month"
      ? monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })
      : `${fromDateKey(weekKeys[0]).toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${fromDateKey(weekKeys[6]).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-medium">{headerLabel}</h2>
          <div className="flex items-center gap-1">
            <div className="flex items-center rounded-lg border border-border p-0.5 text-sm">
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={cn("rounded-md px-2 py-1", viewMode === "month" && "bg-muted font-medium")}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className={cn("rounded-md px-2 py-1", viewMode === "week" && "bg-muted font-medium")}
              >
                Week
              </button>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Previous" onClick={goBack}>
              <ChevronLeft />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Next" onClick={goForward}>
              <ChevronRight />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="py-1">
              {label}
            </div>
          ))}
        </div>

        {viewMode === "month" ? (
          <div className="grid grid-cols-7 gap-1">
            {grid.map((date) => {
              const dateKey = toDateKey(date);
              const dayTasks = tasksByDate.get(dateKey) ?? [];
              const doneCount = dayTasks.filter((task) => task.done).length;
              const isCurrentMonth = date.getMonth() === monthCursor.getMonth();
              const isToday = dateKey === todayKey;
              const isSelected = dateKey === selectedKey;
              const load = computeDayLoad(tasks, dateKey);

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => selectDate(dateKey)}
                  {...dragHandlers(dateKey)}
                  className={cn(
                    "flex h-16 flex-col items-center gap-1 rounded-lg border border-transparent px-1 py-1.5 text-sm transition-colors hover:bg-muted",
                    HEAT_CLASS[heatLevel(load)],
                    !isCurrentMonth && "text-muted-foreground/40",
                    isSelected && "border-primary",
                    isToday && !isSelected && "border-border",
                    dragOverKey === dateKey && "ring-2 ring-primary"
                  )}
                >
                  <span
                    className={
                      isToday
                        ? "flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
                        : ""
                    }
                  >
                    {date.getDate()}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="rounded-full bg-background/60 px-1.5 text-[10px] text-muted-foreground">
                      {doneCount}/{dayTasks.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {weekKeys.map((dateKey) => {
              const date = fromDateKey(dateKey);
              const dayTasks = (tasksByDate.get(dateKey) ?? [])
                .slice()
                .sort((a, b) => (a.startTime ?? "99:99").localeCompare(b.startTime ?? "99:99"));
              const isToday = dateKey === todayKey;
              const isSelected = dateKey === selectedKey;

              return (
                <div
                  key={dateKey}
                  {...dragHandlers(dateKey)}
                  className={cn(
                    "flex min-h-40 flex-col gap-1 rounded-lg border border-transparent p-1.5",
                    isSelected && "border-primary",
                    dragOverKey === dateKey && "ring-2 ring-primary"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => selectDate(dateKey)}
                    className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground"
                  >
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full",
                        isToday && "bg-primary text-primary-foreground"
                      )}
                    >
                      {date.getDate()}
                    </span>
                  </button>
                  <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)}
                        className="flex items-center gap-1 rounded px-1 py-0.5 text-xs hover:bg-muted"
                      >
                        <Checkbox
                          className="size-3.5"
                          checked={task.done}
                          onCheckedChange={(checked) => handleToggle(task.id, checked === true)}
                        />
                        <span className={cn("size-1.5 shrink-0 rounded-full", PRIORITY_DOT_CLASS[task.priority])} />
                        <span className={cn("truncate", task.done && "text-muted-foreground line-through")}>
                          {task.startTime && `${formatTimeLabel(task.startTime)} `}
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-medium">{selectedLabel}</h2>
          <p className="text-sm text-muted-foreground">
            {selectedTasks.length === 0
              ? "Nothing scheduled."
              : `${selectedTasks.filter((task) => task.done).length} of ${selectedTasks.length} done`}
          </p>
        </div>

        <form onSubmit={handleAdd} className="space-y-2">
          <div className="flex items-end gap-2">
            <Input
              aria-label="Add a task"
              placeholder='Try "Standup 9am high priority"'
              value={quickAdd}
              onChange={(event) => setQuickAdd(event.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setTimeOpen((value) => !value)}
            >
              {timeOpen ? "Hide time" : "+ Time"}
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
          {lighterDayKey && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {formatDueLabel(targetDateKey, todayKey)} already has a lot scheduled —{" "}
              <button
                type="button"
                className="underline"
                onClick={() => selectDate(lighterDayKey)}
              >
                {formatDueLabel(lighterDayKey, todayKey)} looks lighter
              </button>
              .
            </p>
          )}
        </form>
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="space-y-3">
          {scheduledTasks.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-muted-foreground">Scheduled</h3>
              {scheduledTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  todayKey={todayKey}
                  showDueDate={false}
                  conflict={conflicts.has(task.id)}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onDeleteSeries={handleDeleteSeries}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}

          {allDayTasks.length > 0 && (
            <div className="space-y-1.5">
              {scheduledTasks.length > 0 && (
                <h3 className="text-xs font-medium text-muted-foreground">All day</h3>
              )}
              {allDayTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  todayKey={todayKey}
                  showDueDate={false}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onDeleteSeries={handleDeleteSeries}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
