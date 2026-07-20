"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { getSocialLinks } from "@/lib/social-links";

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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <section className="relative -mt-12 ml-[calc(50%-50vw)] w-screen overflow-hidden md:-mt-16">
      <div className="grid md:grid-cols-2">
        <div className="flex min-h-[22rem] items-center justify-center py-12 sm:min-h-[26rem] md:min-h-[34rem] lg:min-h-[40rem]">
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)] opacity-30 blur-2xl"
            />
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="size-56 sm:size-72 lg:size-80"
            >
              {profile?.avatarImage ? (
                <Image
                  src={profile.avatarImage}
                  alt={profile.name ?? "Profile"}
                  width={320}
                  height={320}
                  priority
                  className="size-56 rounded-full object-cover ring-1 ring-border ring-offset-4 ring-offset-background sm:size-72 lg:size-80"
                />
              ) : (
                <div className="flex size-56 items-center justify-center rounded-full bg-muted ring-1 ring-border ring-offset-4 ring-offset-background sm:size-72 lg:size-80">
                  <User className="size-20 text-muted-foreground" strokeWidth={1.5} />
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="flex flex-col justify-center gap-5 bg-background px-6 py-12 sm:px-10 md:min-h-[34rem] lg:min-h-[40rem] lg:px-16"
        >
          <motion.h1
            variants={item}
            className="text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {name}
          </motion.h1>

          <motion.span
            variants={item}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-sm font-medium text-muted-foreground"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)]" />
            {title}
          </motion.span>

          <motion.p variants={item} className="max-w-md text-lg text-muted-foreground text-pretty">
            {description}
          </motion.p>

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
      </div>
    </section>
  );
}
