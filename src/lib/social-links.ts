import { Briefcase, Globe, Mail, Phone, Terminal, X, type LucideIcon } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";

export type SocialLink = { icon: LucideIcon; href: string; label: string };

export function getSocialLinks(profile: Profile | null): SocialLink[] {
  return [
    profile?.email && { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
    profile?.phone && { icon: Phone, href: `tel:${profile.phone}`, label: "Phone" },
    profile?.githubUrl && { icon: Terminal, href: profile.githubUrl, label: "GitHub" },
    profile?.linkedinUrl && { icon: Briefcase, href: profile.linkedinUrl, label: "LinkedIn" },
    profile?.twitterUrl && { icon: X, href: profile.twitterUrl, label: "X / Twitter" },
    profile?.websiteUrl && { icon: Globe, href: profile.websiteUrl, label: "Website" },
  ].filter(Boolean) as SocialLink[];
}
