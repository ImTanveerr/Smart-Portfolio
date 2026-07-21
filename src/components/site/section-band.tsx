import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionBand({
  tinted,
  last,
  children,
  className,
}: {
  tinted?: boolean;
  // When this is the last section on the page, cancels <main>'s own bottom
  // padding - the same trick the hero uses to cancel <main>'s top padding
  // (see profile-hero.tsx) - so this section's own py-16/20 doesn't stack
  // with <main>'s padding into a double gap before the footer.
  last?: boolean;
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
    <div
      className={cn(
        "relative ml-[calc(50%-50vw)] w-screen overflow-hidden",
        tinted && "bg-muted/30",
        last && "-mb-12 md:-mb-16"
      )}
    >
      {/* Same accent-glow language as the hero, but a different composition
          on purpose - one soft corner blob instead of two centered ones -
          so sections read as related to the hero without just repeating it.
          Corner and color alternate with `tinted`, which already alternates
          section by section, so adjacent sections don't glow identically. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={cn(
            "absolute size-[26rem] rounded-full blur-3xl",
            tinted
              ? "top-[-12%] right-[-10%] bg-[radial-gradient(closest-side,var(--accent-b),transparent)] opacity-[0.14] dark:opacity-[0.2]"
              : "bottom-[-16%] left-[-10%] bg-[radial-gradient(closest-side,var(--accent-a),transparent)] opacity-[0.12] dark:opacity-[0.18]"
          )}
        />
      </div>
      <div className={cn("relative mx-auto max-w-5xl px-6 py-16 sm:py-20", className)}>
        {children}
      </div>
    </div>
  );
}
