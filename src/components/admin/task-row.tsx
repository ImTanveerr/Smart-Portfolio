"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Repeat, X } from "lucide-react";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_RECURRENCE_LABELS,
} from "@/lib/validations";
import { updateTask } from "@/lib/actions/tasks";
import { formatDueLabel, PRIORITY_DOT_CLASS, type SmartTask } from "@/lib/task-grouping";
import { formatTimeLabel } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TaskUpdatePayload = Parameters<typeof updateTask>[1];

// The single editable task row used by both the todo list and the calendar
// day panel - one place to fix so editing behaves identically everywhere a
// task shows up. `showDueDate` hides the due-date badge/field on the
// calendar (the selected day already says which day this is); `conflict`
// flags a time overlap the calendar detected; `draggable`/`onDragStart`
// wire up the calendar's drag-to-reschedule.
export function TaskRow({
  task,
  todayKey,
  showDueDate = true,
  conflict = false,
  draggable = false,
  onDragStart,
  onToggle,
  onDelete,
  onDeleteSeries,
  onUpdate,
}: {
  task: SmartTask;
  todayKey: string;
  showDueDate?: boolean;
  conflict?: boolean;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent) => void;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  onDeleteSeries: (seriesId: string) => void;
  onUpdate: (id: string, values: TaskUpdatePayload) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [notesDraft, setNotesDraft] = useState(task.notes ?? "");
  const [tagInput, setTagInput] = useState("");
  const [startTimeDraft, setStartTimeDraft] = useState(task.startTime ?? "");
  const [endTimeDraft, setEndTimeDraft] = useState(task.endTime ?? "");
  const [dueDateDraft, setDueDateDraft] = useState(task.dueDate ?? "");

  const overdue = task.dueDate !== null && task.dueDate < todayKey && !task.done;

  function commitTitle() {
    const trimmed = titleDraft.trim();
    if (!trimmed) {
      setTitleDraft(task.title);
      return;
    }
    if (trimmed !== task.title) onUpdate(task.id, { title: trimmed });
  }

  function commitStartTime(value: string) {
    setStartTimeDraft(value);
    if (value === (task.startTime ?? "")) return;
    if (value === "") {
      setEndTimeDraft("");
      onUpdate(task.id, { startTime: "", endTime: "" });
    } else {
      onUpdate(task.id, { startTime: value });
    }
  }

  function commitEndTime(value: string) {
    setEndTimeDraft(value);
    if (value !== (task.endTime ?? "")) onUpdate(task.id, { endTime: value });
  }

  function commitDueDate(value: string) {
    setDueDateDraft(value);
    if (value !== (task.dueDate ?? "")) onUpdate(task.id, { dueDate: value });
  }

  function handleAddTag() {
    const tag = tagInput.trim().toLowerCase();
    setTagInput("");
    if (!tag || task.tags.includes(tag)) return;
    onUpdate(task.id, { tags: [...task.tags, tag] });
  }

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={cn(
        "rounded-lg border border-border",
        overdue && "border-destructive/40",
        conflict && "border-amber-500/50"
      )}
    >
      <div className="group flex items-center gap-3 px-3 py-2.5">
        <Checkbox
          checked={task.done}
          onCheckedChange={(checked) => onToggle(task.id, checked === true)}
        />
        <span className={cn("size-2 shrink-0 rounded-full", PRIORITY_DOT_CLASS[task.priority])} />
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex flex-1 flex-wrap items-center gap-1.5 text-left"
        >
          <span className={task.done ? "text-muted-foreground line-through" : ""}>
            {task.title}
          </span>
          {task.recurrence !== "NONE" && (
            <Repeat className="size-3.5 text-muted-foreground" aria-label="Repeating task" />
          )}
          {task.startTime && (
            <Badge variant={conflict ? "destructive" : "outline"}>
              {formatTimeLabel(task.startTime)}
              {task.endTime && `–${formatTimeLabel(task.endTime)}`}
            </Badge>
          )}
          {showDueDate && task.dueDate && (
            <Badge variant={overdue ? "destructive" : "outline"}>
              {formatDueLabel(task.dueDate, todayKey)}
            </Badge>
          )}
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={expanded ? "Collapse details" : "Expand details"}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? <ChevronDown /> : <ChevronRight />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="opacity-0 group-hover:opacity-100"
          aria-label={`Delete ${task.title}`}
          onClick={() => onDelete(task.id)}
        >
          <X />
        </Button>
      </div>

      {expanded && (
        <div className="space-y-3 border-t border-border px-3 py-3">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Title</span>
            <Input
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={commitTitle}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Priority</span>
              <Select
                value={task.priority}
                onValueChange={(value) =>
                  onUpdate(task.id, { priority: value as SmartTask["priority"] })
                }
              >
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {TASK_PRIORITY_LABELS[priority]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Due</span>
              <Input
                type="date"
                value={dueDateDraft}
                onChange={(event) => commitDueDate(event.target.value)}
                className="h-7 w-36"
              />
              {dueDateDraft && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:underline"
                  onClick={() => commitDueDate("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Time</span>
            <Input
              type="time"
              value={startTimeDraft}
              onChange={(event) => commitStartTime(event.target.value)}
              className="h-7 w-28"
            />
            <span className="text-sm text-muted-foreground">–</span>
            <Input
              type="time"
              value={endTimeDraft}
              disabled={!startTimeDraft}
              onChange={(event) => commitEndTime(event.target.value)}
              className="h-7 w-28"
            />
            {startTimeDraft && (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:underline"
                onClick={() => commitStartTime("")}
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Notes</span>
            <Textarea
              rows={2}
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
              onBlur={() => {
                if (notesDraft !== (task.notes ?? "")) {
                  onUpdate(task.id, { notes: notesDraft });
                }
              }}
              placeholder="Add details..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                #{tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => onUpdate(task.id, { tags: task.tags.filter((t) => t !== tag) })}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            <Input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddTag();
                }
              }}
              onBlur={handleAddTag}
              placeholder="add tag"
              className="h-6 w-24 px-2 text-xs"
            />
          </div>

          {task.recurrence !== "NONE" && task.seriesId && (
            <div className="flex items-center gap-2 border-t border-border pt-2 text-xs text-muted-foreground">
              <Repeat className="size-3.5" />
              <span>Repeats {TASK_RECURRENCE_LABELS[task.recurrence].toLowerCase()}</span>
              <button
                type="button"
                className="ml-auto text-destructive hover:underline"
                onClick={() => onDeleteSeries(task.seriesId as string)}
              >
                Delete this and future occurrences
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
