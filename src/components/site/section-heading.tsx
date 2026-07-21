import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-4 gap-y-2", className)}>
      <div className="space-y-2">
        {eyebrow && (
          <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <span className="text-[var(--accent-a)]">{"//"}</span>
            {eyebrow.toLowerCase()}
          </p>
        )}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          <div className="h-1 w-10 rounded-full bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)]" />
        </div>
      </div>
      {action}
    </div>
  );
}
