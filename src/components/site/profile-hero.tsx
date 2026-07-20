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

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <section className="relative -mt-12 ml-[calc(50%-50vw)] w-screen overflow-hidden md:-mt-16">
      <div className="relative h-[30rem] w-full sm:h-[34rem] lg:h-[42rem]">
        {profile?.avatarImage ? (
          <Image
            src={profile.avatarImage}
            alt={profile.name ?? "Profile"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted">
            <User className="size-24 text-muted-foreground" strokeWidth={1} />
          </div>
        )}

        <div className="absolute inset-0">
          <div className="relative mx-auto h-full max-w-5xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="absolute top-6 left-6 max-w-xs rounded-2xl border border-border bg-background/80 px-5 py-4 shadow-lg backdrop-blur-md sm:top-8 sm:left-8"
            >
              <h1 className="text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
                {name}
              </h1>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: 0.1 }}
              className="absolute right-6 bottom-6 max-w-xs space-y-3 rounded-2xl border border-border bg-background/80 px-5 py-4 text-right shadow-lg backdrop-blur-md sm:right-8 sm:bottom-8 sm:max-w-sm"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 shrink-0 rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)]" />
                {title}
              </span>

              <p className="text-sm text-muted-foreground text-pretty">{description}</p>

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <Button
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/projects" />}
                  className="group bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)] text-white shadow-md shadow-[var(--accent-a)]/25 transition-all hover:opacity-90"
                >
                  View projects
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button size="sm" variant="outline" nativeButton={false} render={<Link href="/blog" />}>
                  Read the blog
                </Button>
              </div>

              {contactLinks.length > 0 && (
                <div className="flex flex-wrap justify-end gap-1.5 pt-1">
                  {contactLinks.map((link) => (
                    <Button
                      key={link.label}
                      variant="ghost"
                      size="icon-sm"
                      nativeButton={false}
                      aria-label={link.label}
                      className="rounded-full border border-transparent transition-transform hover:border-border hover:-translate-y-0.5 [&_svg]:size-3.5"
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
