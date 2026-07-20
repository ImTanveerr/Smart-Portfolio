"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ChevronDown, User } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { getSocialLinks } from "@/lib/social-links";
import { cn } from "@/lib/utils";

export function ProfileHero({ profile }: { profile: Profile | null }) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const name = profile?.name || "Hi, I'm a software engineer";
  const title = profile?.title || "I build things and write about how they work.";
  const description =
    profile?.description ||
    "Take a look at what I've shipped, or read what I've learned along the way.";

  const contactLinks = getSocialLinks(profile);

  function scrollToNext() {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });
  }

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
  };
  const nameContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };
  const nameWord: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <section ref={sectionRef} className="py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative mx-auto max-w-4xl"
      >
        <div
          aria-hidden
          className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-[var(--accent-a)]/50 via-transparent to-[var(--accent-b)]/50 opacity-70 blur-sm"
        />
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/70 px-6 py-10 shadow-xl shadow-black/5 backdrop-blur-xl sm:px-12 sm:py-14 dark:shadow-black/20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-[var(--accent-a)] opacity-10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-[var(--accent-b)] opacity-10 blur-3xl"
          />

          <div className="relative flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:gap-12 md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative shrink-0"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                  "relative size-36 overflow-hidden rounded-full sm:size-44",
                  "ring-1 ring-border ring-offset-4 ring-offset-card"
                )}
              >
                {profile?.avatarImage ? (
                  <Image
                    src={profile.avatarImage}
                    alt={profile.name ?? "Profile"}
                    fill
                    priority
                    sizes="(min-width: 640px) 11rem, 9rem"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-muted">
                    <User className="size-14 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={container}
              className="max-w-xl space-y-4"
            >
              <div className="space-y-2.5">
                <motion.h1
                  variants={nameContainer}
                  className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-4xl font-semibold tracking-tight sm:text-5xl md:justify-start"
                >
                  {name.split(" ").map((word, i) => (
                    <motion.span key={i} variants={nameWord} className="inline-block">
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>
                <motion.span
                  variants={item}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)]" />
                  {title}
                </motion.span>
              </div>
              <motion.p variants={item} className="text-base text-muted-foreground text-pretty">
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
        </div>
      </motion.div>

      <button
        type="button"
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        className="mx-auto mt-8 hidden size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground sm:flex"
      >
        <ChevronDown className="size-4 motion-safe:animate-bounce" />
      </button>
    </section>
  );
}
