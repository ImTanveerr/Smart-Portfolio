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
    // `<main>` is centered with a max-width, so a plain child can't stretch
    // past it. `margin-left: calc(50% - 50vw)` plus `width: 100vw` shifts
    // this element back to the true viewport edges regardless of the
    // parent's own width - the standard "full-bleed from a centered
    // container" trick - so the tint spans edge to edge as a section divider
    // while the content inside is re-centered to the normal page width.
    <div className={cn("ml-[calc(50%-50vw)] w-screen", tinted && "bg-muted/30")}>
      <div className={cn("mx-auto max-w-5xl px-6 py-16 sm:py-20", className)}>{children}</div>
    </div>
  );
}
