"use client";

import { useEffect, useState } from "react";

// Scroll-spy for the navbar: reports which section id is currently under a
// horizontal band near the top of the viewport, so the nav can highlight the
// matching link as the user scrolls the single-page home layout.
export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      // Shrinks the observed area to a band starting 20% down from the top
      // and ending 70% down, so a section counts as "active" once it's near
      // the top of the screen rather than merely anywhere on screen.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
