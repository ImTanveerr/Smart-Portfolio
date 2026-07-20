import { ArrowUp } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { getSocialLinks } from "@/lib/social-links";

export function Footer({ profile }: { profile: Profile | null }) {
  const socialLinks = getSocialLinks(profile);

  return (
    <footer className="relative border-t border-border">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-a)]/40 to-transparent" />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {profile?.name || "Portfolio"}. Built with Next.js.
        </p>
        <div className="flex items-center gap-1">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <link.icon className="size-4" />
            </a>
          ))}
          <a
            href="#top"
            aria-label="Back to top"
            className="ml-2 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
