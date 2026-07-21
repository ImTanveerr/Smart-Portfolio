"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Newspaper,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/posts", label: "Posts", icon: Newspaper },
  { href: "/admin/todos", label: "Todo", icon: ListTodo },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {links.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              isActive && "text-foreground"
            )}
          >
            {isActive && (
              // Same trick as the public navbar's active pill: a shared
              // layoutId makes framer-motion animate it sliding between
              // links instead of popping into place.
              <motion.span
                layoutId="admin-nav-active-pill"
                className="absolute inset-0 rounded-full bg-muted"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <link.icon className="relative size-4" />
            <span className="relative hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
