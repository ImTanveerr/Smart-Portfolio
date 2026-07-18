import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About me.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <p className="text-lg text-muted-foreground">
        {/* TODO: replace with your real bio, skills, and social/contact links. */}
        Software engineer building things and writing about it. Replace this placeholder
        paragraph in <code className="rounded bg-muted px-1.5 py-0.5 text-sm">src/app/(public)/about/page.tsx</code> with
        your real bio.
      </p>
    </div>
  );
}
