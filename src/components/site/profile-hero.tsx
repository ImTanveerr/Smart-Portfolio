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
    visible: { transition: { staggerChildren: 0.07 } },
  };
  const nameWord: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-20">
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
            className={cn(
              "relative size-56 overflow-hidden rounded-full sm:size-72",
              "ring-1 ring-border ring-offset-4 ring-offset-background"
            )}
          >
            {profile?.avatarImage ? (
              <Image
                src={profile.avatarImage}
                alt={profile.name ?? "Profile"}
                fill
                priority
                sizes="(min-width: 640px) 18rem, 14rem"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted">
                <User className="size-20 text-muted-foreground" strokeWidth={1.5} />
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
          <div className="space-y-3">
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
              className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-5xl font-semibold tracking-tight sm:text-6xl md:justify-start"
            >
              {name.split(" ").map((word, i) => (
                <motion.span key={i} variants={nameWord} className="inline-block">
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </div>
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
              className="flex flex-wrap justify-center gap-2 pt-1 md:justify-start"
            >
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
      </div>

      <button
        type="button"
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        className="group mx-auto mt-12 hidden flex-col items-center gap-2 sm:flex"
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
