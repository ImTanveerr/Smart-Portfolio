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
    <section className="py-12 sm:py-20">
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-14">
        <div className="shrink-0">
          {profile?.avatarImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarImage}
              alt={profile.name ?? "Profile"}
              className={cn(
                "size-36 rounded-full object-cover sm:size-44",
                "ring-1 ring-border"
              )}
            />
          ) : (
            <div
              className={cn(
                "flex size-36 items-center justify-center rounded-full bg-muted sm:size-44",
                "ring-1 ring-border"
              )}
            >
              <User className="size-12 text-muted-foreground" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="max-w-xl space-y-6 text-center md:text-left">
          <p className="text-sm font-medium text-muted-foreground">{greeting}</p>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {heading}
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">{description}</p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
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
            <div className="flex flex-wrap justify-center gap-1.5 pt-1 md:justify-start">
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
      </div>
    </section>
  );
}
