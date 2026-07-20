import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionBand({
  tinted,
  children,
  className,
}: {
  tinted?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("ml-[calc(50%-50vw)] w-screen", tinted && "bg-muted/30")}>
      <div className={cn("mx-auto max-w-5xl px-6 py-16 sm:py-20", className)}>{children}</div>
    </div>
  );
}
