"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Download, Mail } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { getSocialLinks } from "@/lib/social-links";

export function ProfileHero({
  profile,
  skills = [],
}: {
  profile: Profile | null;
  skills?: string[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const name = profile?.name || "there";
  const title = profile?.title || "Full-Stack Developer";
  const description =
    profile?.description ||
    "I craft fast, scalable, and user-friendly web applications with modern frameworks.";

  const contactLinks = getSocialLinks(profile);

  function scrollToNext() {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });
  }

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <section
      ref={sectionRef}
      className="relative -mt-12 ml-[calc(50%-50vw)] w-screen overflow-hidden bg-[#0a0a0a] text-white md:-mt-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-a),transparent)] opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center sm:px-8"
      >
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          Available for work
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 max-w-3xl text-4xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          Hi, I&apos;m {name} — a{" "}
          <span className="bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)] bg-clip-text text-transparent">
            {title}
          </span>{" "}
          building fast, modern web experiences.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-2xl text-lg text-white/60 text-pretty sm:text-xl"
        >
          {description}
        </motion.p>

        <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/projects" />}
            className="group bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)] text-white shadow-lg shadow-[var(--accent-a)]/25 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-[var(--accent-a)]/30"
          >
            View Projects
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Button>
          {profile?.resumeUrl ? (
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href="/api/resume?download=1" />}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Download />
              Download Resume
            </Button>
          ) : profile?.email ? (
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href={`mailto:${profile.email}`} />}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Mail />
              Get in Touch
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/blog" />}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Read the blog
            </Button>
          )}
        </motion.div>

        {contactLinks.length > 0 && (
          <motion.div variants={item} className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {contactLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="icon"
                nativeButton={false}
                aria-label={link.label}
                className="rounded-full border border-white/10 text-white/60 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white [&_svg]:size-4"
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

        {skills.length > 0 && (
          <motion.div
            variants={item}
            className="mt-14 w-full max-w-2xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          >
            <motion.div
              className="flex w-max items-center gap-10"
              animate={shouldReduceMotion ? undefined : { x: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              {[...skills, ...skills].map((skill, i) => (
                <span key={i} className="shrink-0 font-mono text-sm text-white/35">
                  {skill}
                </span>
              ))}
            </motion.div>
          </motion.div>
        )}

        <button
          type="button"
          onClick={scrollToNext}
          aria-label="Scroll to next section"
          className="group mt-16 hidden flex-col items-center gap-2 sm:flex"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 transition-colors group-hover:text-white">
            SCROLL
          </span>
          <span className="relative h-10 w-px overflow-hidden bg-white/15">
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
      </motion.div>
    </section>
  );
}
