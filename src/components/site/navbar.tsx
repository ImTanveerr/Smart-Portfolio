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

export function Navbar() {
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
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/80 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-background/60"
          : "border-transparent bg-background/40 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)] bg-clip-text text-transparent">
            Portfolio
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
          <div className="ml-2 border-l border-border pl-2">
            <ThemeToggle />
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isHome && activeSection === link.id && "bg-muted text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
