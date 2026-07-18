import Link from "next/link";
import { ArrowRight, Briefcase, Globe, Mail, Phone, Terminal, User, X } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";

export function ProfileHero({ profile }: { profile: Profile | null }) {
  const greeting = profile?.name ? `Hi, I'm ${profile.name} 👋` : "Hi, I'm a software engineer 👋";
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
    <section className="max-w-2xl space-y-5 py-4">
      <div className="flex items-center gap-4">
        {profile?.avatarImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarImage}
            alt={profile.name ?? "Profile"}
            className="size-16 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <User className="size-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
        )}
        <p className="text-sm font-medium text-muted-foreground">{greeting}</p>
      </div>

      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{heading}</h1>
      <p className="text-lg text-muted-foreground">{description}</p>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button nativeButton={false} render={<Link href="/projects" />}>
          View projects
          <ArrowRight />
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/blog" />}>
          Read the blog
        </Button>
      </div>

      {contactLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {contactLinks.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              size="icon"
              nativeButton={false}
              aria-label={link.label}
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
    </section>
  );
}
