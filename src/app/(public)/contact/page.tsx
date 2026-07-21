import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project — get in touch about freelance work.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <Reveal>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Start a project</h1>
          <p className="text-lg text-muted-foreground">
            Tell me a bit about what you&apos;re building and I&apos;ll get back to you within a
            day or two.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <ContactForm />
      </Reveal>
    </div>
  );
}
