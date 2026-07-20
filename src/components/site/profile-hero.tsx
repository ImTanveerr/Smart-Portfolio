"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { getSocialLinks } from "@/lib/social-links";

function useCyclingImage(images: string[], intervalMs = 3000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return images[index];
}

export function ProfileHero({ profile }: { profile: Profile | null }) {
  const shouldReduceMotion = useReducedMotion();
  const name = profile?.name || "Hi, I'm a software engineer";
  const title = profile?.title || "I build things and write about how they work.";
  const description =
    profile?.description ||
    "Take a look at what I've shipped, or read what I've learned along the way.";

  const contactLinks = getSocialLinks(profile);

  const images = [profile?.avatarImage, profile?.avatarImage2].filter(
    (src): src is string => Boolean(src)
  );
  const activeImage = useCyclingImage(images);

  const container: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.21, 0.47, 0.32, 0.98],
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <section className="relative -mt-12 ml-[calc(50%-50vw)] w-screen overflow-hidden md:-mt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/4 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-a),transparent)] opacity-25 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 size-[36rem] translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-b),transparent)] opacity-25 blur-3xl" />
      </div>

      <div className="grid md:grid-cols-2">
        <div className="flex min-h-[22rem] items-center justify-center py-12 sm:min-h-[26rem] md:min-h-[34rem] md:justify-end md:pr-6 lg:min-h-[40rem] lg:pr-10">
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative size-56 overflow-hidden rounded-full ring-1 ring-border ring-offset-4 ring-offset-background [perspective:1200px] sm:size-72 lg:size-80"
            >
              {activeImage ? (
                <AnimatePresence mode="sync">
                  <motion.div
                    key={activeImage}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <Image
                      src={activeImage}
                      alt={profile?.name ?? "Profile"}
                      fill
                      priority
                      sizes="(min-width: 1024px) 20rem, (min-width: 640px) 18rem, 14rem"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex size-full items-center justify-center bg-muted">
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
          className="flex flex-col justify-center gap-5 px-6 py-12 sm:px-8 md:min-h-[34rem] md:pl-6 lg:min-h-[40rem] lg:pl-10"
        >
          <motion.h1
            variants={item}
            className="text-[36px] leading-tight font-bold tracking-tight text-balance sm:text-[48px] lg:text-[60px]"
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
