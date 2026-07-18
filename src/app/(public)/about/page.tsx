import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About me.",
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">About</h1>
      <p className="text-muted-foreground">
        {/* TODO: replace with your real bio, skills, and social/contact links. */}
        Software engineer building things and writing about it. Replace this placeholder
        paragraph in <code>src/app/(public)/about/page.tsx</code> with your real bio.
      </p>
    </div>
  );
}
