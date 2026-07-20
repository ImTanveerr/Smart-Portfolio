"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
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
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const nameWord: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16 sm:py-24">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-0 -z-10 -mr-6 hidden font-mono text-[16rem] leading-none font-bold text-foreground/[0.035] select-none sm:block lg:text-[22rem]"
      >
        {"</>"}
      </span>

      <div className="flex flex-col-reverse items-start gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="max-w-2xl space-y-6 text-left"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-1 font-mono text-sm text-[var(--accent-a)] dark:text-[var(--accent-b)]"
          >
            <span className="text-muted-foreground">{"<"}</span>
            {title}
            <span className="text-muted-foreground">{"/>"}</span>
          </motion.span>

          <motion.h1
            variants={nameContainer}
            className="flex flex-wrap gap-x-4 gap-y-1 text-6xl leading-[1.05] font-bold tracking-tight sm:text-7xl lg:text-8xl"
          >
            {name.split(" ").map((word, i) => (
              <motion.span key={i} variants={nameWord} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-xl text-lg text-muted-foreground text-pretty sm:text-xl"
          >
            {description}
          </motion.p>

          {(profile?.email || profile?.phone) && (
            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm text-muted-foreground"
            >
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="transition-colors hover:text-foreground">
                  {profile.email}
                </a>
              )}
              {profile?.email && profile?.phone && (
                <span className="text-border">/</span>
              )}
              {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="transition-colors hover:text-foreground">
                  {profile.phone}
                </a>
              )}
            </motion.div>
          )}

          <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/projects" />}
              className="group bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)] text-white shadow-lg shadow-[var(--accent-a)]/25 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-[var(--accent-a)]/30"
            >
              View projects
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/blog" />}>
              Read the blog
            </Button>
          </motion.div>

          {contactLinks.length > 0 && (
            <motion.div variants={item} className="flex flex-wrap items-center gap-2 pt-1">
              {contactLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="icon-lg"
                  nativeButton={false}
                  aria-label={link.label}
                  className="size-10 rounded-full border border-border/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-[var(--accent-a)]/40 hover:bg-muted hover:text-foreground hover:shadow-md hover:shadow-[var(--accent-a)]/10 [&_svg]:size-4"
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

        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative w-64 shrink-0 self-center sm:w-80 lg:w-96 lg:self-auto"
        >
          <span
            aria-hidden
            className="absolute -top-3 -left-3 z-10 font-mono text-3xl text-[var(--accent-a)] select-none"
          >
            {"{"}
          </span>
          <span
            aria-hidden
            className="absolute -right-3 -bottom-3 z-10 font-mono text-3xl text-[var(--accent-b)] select-none"
          >
            {"}"}
          </span>
          <div
            aria-hidden
            className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-3xl bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)] opacity-20 blur-xl"
          />
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className={cn(
              "relative aspect-[4/5] overflow-hidden rounded-3xl",
              "ring-1 ring-border"
            )}
          >
            {profile?.avatarImage ? (
              <Image
                src={profile.avatarImage}
                alt={profile.name ?? "Profile"}
                fill
                priority
                sizes="(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 16rem"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted">
                <User className="size-20 text-muted-foreground" strokeWidth={1.5} />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        className="group mt-16 hidden flex-col items-start gap-2 sm:flex"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-foreground">
          SCROLL
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-border">
          {!shouldReduceMotion && (
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[var(--accent-a)] to-[var(--accent-b)]"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </span>
      </button>
    </section>
  );
}
