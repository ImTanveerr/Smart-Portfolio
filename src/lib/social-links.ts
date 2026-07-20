import { Globe, Mail, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { Profile } from "@/generated/prisma/client";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons/brand-icons";

// Accepts both lucide-react icons and the hand-drawn brand icons below -
// their prop types are structurally compatible even though only one is a
// real LucideIcon.
export type SocialIcon = ComponentType<SVGProps<SVGSVGElement>>;
export type SocialLink = { icon: SocialIcon; href: string; label: string };

// Shared by the hero and the footer so both stay in sync automatically
// whenever a link is added, renamed, or reordered here.
export function getSocialLinks(profile: Profile | null): SocialLink[] {
  return [
    profile?.email && { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
    profile?.phone && { icon: Phone, href: `tel:${profile.phone}`, label: "Phone" },
    profile?.githubUrl && { icon: GithubIcon, href: profile.githubUrl, label: "GitHub" },
    profile?.linkedinUrl && { icon: LinkedinIcon, href: profile.linkedinUrl, label: "LinkedIn" },
    profile?.twitterUrl && { icon: XIcon, href: profile.twitterUrl, label: "X / Twitter" },
    profile?.websiteUrl && { icon: Globe, href: profile.websiteUrl, label: "Website" },
  ].filter(Boolean) as SocialLink[];
}
