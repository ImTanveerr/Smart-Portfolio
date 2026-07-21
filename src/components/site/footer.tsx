import { ArrowUp } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { getSocialLinks } from "@/lib/social-links";
import { Reveal } from "@/components/site/reveal";

export function Footer({ profile }: { profile: Profile | null }) {
  const socialLinks = getSocialLinks(profile);

  return (
    <footer className="relative border-t border-border">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-a)]/50 to-transparent" />
      <Reveal className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="space-y-1.5">
            <p className="text-lg font-semibold tracking-tight">
              <span className="bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)] bg-clip-text text-transparent">
                {profile?.name || "Portfolio"}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} &middot; Built with Next.js
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={link.label}
                className="flex size-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-[var(--accent-a)]/40 hover:bg-muted hover:text-foreground hover:shadow-md hover:shadow-[var(--accent-a)]/10"
              >
                <link.icon className="size-4" />
              </a>
            ))}
            <a
              href="#top"
              aria-label="Back to top"
              className="ml-1 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)] text-white shadow-md shadow-[var(--accent-a)]/20 transition-transform hover:-translate-y-0.5"
            >
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
