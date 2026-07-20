"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { getSocialLinks } from "@/lib/social-links";
import { cn } from "@/lib/utils";

export function ProfileHero({ profile }: { profile: Profile | null }) {
  const shouldReduceMotion = useReducedMotion();
  const name = profile?.name || "Hi, I'm a software engineer";
  const title = profile?.title || "I build things and write about how they work.";
  const description =
    profile?.description ||
    "Take a look at what I've shipped, or read what I've learned along the way.";

  const contactLinks = getSocialLinks(profile);

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <section className="py-12 sm:py-20">
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-14">
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative shrink-0"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)] opacity-30 blur-2xl"
          />
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {profile?.avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarImage}
                alt={profile.name ?? "Profile"}
                className={cn(
                  "size-48 rounded-full object-cover sm:size-64",
                  "ring-1 ring-border ring-offset-4 ring-offset-background"
                )}
              />
            ) : (
              <div
                className={cn(
                  "flex size-48 items-center justify-center rounded-full bg-muted sm:size-64",
                  "ring-1 ring-border ring-offset-4 ring-offset-background"
                )}
              >
                <User className="size-16 text-muted-foreground" strokeWidth={1.5} />
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="max-w-xl space-y-5 text-center md:text-left"
        >
          <motion.div variants={item} className="space-y-1.5">
            <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              {name}
            </h1>
            <p className="text-xl font-medium text-muted-foreground text-balance">{title}</p>
          </motion.div>
          <motion.p variants={item} className="text-lg text-muted-foreground text-pretty">
            {description}
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start"
          >
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/projects" />}
              className="group bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)] text-white shadow-lg shadow-[var(--accent-a)]/25 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-[var(--accent-a)]/30"
            >
              View projects
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/blog" />}
            >
              Read the blog
            </Button>
          </motion.div>

          {contactLinks.length > 0 && (
            <motion.div
              variants={item}
              className="flex flex-wrap justify-center gap-1.5 pt-1 md:justify-start"
            >
              {contactLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="icon"
                  nativeButton={false}
                  aria-label={link.label}
                  className="rounded-full border border-transparent transition-transform hover:border-border hover:-translate-y-0.5"
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
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
