import Link from "next/link";
import { ArrowRight, Briefcase, Globe, Mail, Phone, Terminal, User, X } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileHero({ profile }: { profile: Profile | null }) {
  const greeting = profile?.name ? `Hi, I'm ${profile.name}` : "Hi, I'm a software engineer";
  const heading = profile?.title || "I build things and write about how they work.";
  const description =
    profile?.description ||
    "Take a look at what I've shipped, or read what I've learned along the way.";

  const contactLinks = [
    profile?.email && { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
    profile?.phone && { icon: Phone, href: `tel:${profile.phone}`, label: "Phone" },
    profile?.githubUrl && { icon: Terminal, href: profile.githubUrl, label: "GitHub" },
    profile?.linkedinUrl && { icon: Briefcase, href: profile.linkedinUrl, label: "LinkedIn" },
    profile?.twitterUrl && { icon: X, href: profile.twitterUrl, label: "X / Twitter" },
    profile?.websiteUrl && { icon: Globe, href: profile.websiteUrl, label: "Website" },
  ].filter(Boolean) as { icon: typeof Mail; href: string; label: string }[];

  return (
    <section className="relative -mx-6 overflow-hidden px-6 py-10 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -z-10 size-80 -translate-y-1/2 translate-x-1/4 rounded-full bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-3xl sm:size-[28rem]"
      />

      <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {greeting}
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground text-pretty">{description}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" nativeButton={false} render={<Link href="/projects" />}>
              View projects
              <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/blog" />}
            >
              Read the blog
            </Button>
          </div>

          {contactLinks.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {contactLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="icon"
                  nativeButton={false}
                  aria-label={link.label}
                  className="rounded-full border border-transparent hover:border-border"
                  render={
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    />
                  }
                >
                  <link.icon />
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="relative mx-auto shrink-0 animate-in fade-in zoom-in-95 duration-700">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/0 blur-2xl"
          />
          {profile?.avatarImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarImage}
              alt={profile.name ?? "Profile"}
              className={cn(
                "size-32 rounded-full object-cover sm:size-40",
                "ring-4 ring-background shadow-xl"
              )}
            />
          ) : (
            <div
              className={cn(
                "flex size-32 items-center justify-center rounded-full bg-muted sm:size-40",
                "ring-4 ring-background shadow-xl"
              )}
            >
              <User className="size-12 text-muted-foreground" strokeWidth={1.5} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
