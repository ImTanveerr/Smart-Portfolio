"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, ChevronDown, User } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { getSocialLinks } from "@/lib/social-links";
import { cn } from "@/lib/utils";

type HeroStats = { projects: number; posts: number; skills: number };

function StatCounter({ value }: { value: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: shouldReduceMotion ? 0 : 0.9,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, shouldReduceMotion]);

  return <span>{display}</span>;
}

export function ProfileHero({
  profile,
  stats,
}: {
  profile: Profile | null;
  stats?: HeroStats;
}) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const name = profile?.name || "Hi, I'm a software engineer";
  const title = profile?.title || "I build things and write about how they work.";
  const description =
    profile?.description ||
    "Take a look at what I've shipped, or read what I've learned along the way.";

  const contactLinks = getSocialLinks(profile);
  const statItems = [
    stats && { label: "Projects", value: stats.projects },
    stats && { label: "Articles", value: stats.posts },
    stats && { label: "Skills", value: stats.skills },
  ].filter((s): s is { label: string; value: number } => Boolean(s) && s!.value > 0);

  // Cursor spotlight — tracked via motion values so the glow follows the
  // pointer without triggering a React re-render on every mouse move.
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(480px circle at ${spotX}px ${spotY}px, color-mix(in oklch, var(--accent-a), transparent 88%), transparent 70%)`;

  // Avatar tilt — same approach, springed for a smooth 3D follow.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 20,
  });

  function handleSectionMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  }

  function handleAvatarMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleAvatarMouseLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

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
    <section
      ref={sectionRef}
      onMouseMove={shouldReduceMotion ? undefined : handleSectionMouseMove}
      className="relative py-12 sm:py-20"
    >
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: spotlightBackground }}
        />
      )}

      <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-14">
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          onMouseMove={handleAvatarMouseMove}
          onMouseLeave={handleAvatarMouseLeave}
          className="relative shrink-0 [perspective:800px]"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)] opacity-30 blur-2xl"
          />
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ rotateX, rotateY }}
            className={cn(
              "relative size-48 overflow-hidden rounded-full sm:size-64",
              "ring-1 ring-border ring-offset-4 ring-offset-background"
            )}
          >
            {profile?.avatarImage ? (
              <Image
                src={profile.avatarImage}
                alt={profile.name ?? "Profile"}
                fill
                priority
                sizes="(min-width: 640px) 16rem, 12rem"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted">
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
          <div className="space-y-3">
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
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)]" />
              {title}
            </motion.span>
          </div>
          <motion.p variants={item} className="text-lg text-muted-foreground text-pretty">
            {description}
          </motion.p>

          {statItems.length > 0 && (
            <motion.div
              variants={item}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 md:justify-start"
            >
              {statItems.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-1.5">
                  <span className="text-xl font-semibold tabular-nums">
                    <StatCounter value={stat.value} />
                    {stat.value >= 10 ? "+" : ""}
                  </span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          )}

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

      <button
        type="button"
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        className="mx-auto mt-10 hidden size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground sm:flex"
      >
        <ChevronDown className="size-4 motion-safe:animate-bounce" />
      </button>
    </section>
  );
}
