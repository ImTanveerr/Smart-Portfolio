"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useActiveSection } from "@/hooks/use-active-section";

const links = [
  { href: "/#skills", label: "Skills", id: "skills" },
  { href: "/#projects", label: "Projects", id: "projects" },
  { href: "/#blog", label: "Blog", id: "blog" },
  { href: "/#about", label: "About", id: "about" },
];

const sectionIds = links.map((link) => link.id);

function getInitials(name?: string | null) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Navbar({ name, email }: { name?: string | null; email?: string | null }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeSection = useActiveSection(isHome ? sectionIds : []);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "relative mx-auto flex max-w-3xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-300 sm:px-4",
          scrolled
            ? "border-border bg-background/85 shadow-md shadow-black/5 backdrop-blur-md"
            : "border-border/50 bg-background/60 backdrop-blur-sm"
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)] text-xs font-semibold text-white">
            {getInitials(name)}
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            {name || "Portfolio"}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {links.map((link) => {
            const isActive = isHome && activeSection === link.id;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground"
                )}
              >
                {isActive && (
                  // Same layoutId across renders = framer-motion animates
                  // the pill sliding from the old active link to this one,
                  // instead of it just popping into place.
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-muted"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
          <div className="ml-1 flex items-center gap-2 border-l border-border pl-2">
            <ThemeToggle />
            {email && (
              <Button
                size="sm"
                nativeButton={false}
                render={<a href={`mailto:${email}`} />}
                className="rounded-full bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)] text-white hover:opacity-90"
              >
                Let&apos;s Talk
              </Button>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto mt-2 max-w-3xl overflow-hidden rounded-2xl border border-border bg-background/95 shadow-lg backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 p-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isHome && activeSection === link.id && "bg-muted text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {email && (
                <Button
                  size="sm"
                  nativeButton={false}
                  onClick={() => setMobileOpen(false)}
                  render={<a href={`mailto:${email}`} />}
                  className="mt-1 rounded-full bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)] text-white hover:opacity-90"
                >
                  Let&apos;s Talk
                </Button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
