import type { Metadata } from "next";
import { getProfile } from "@/lib/profile";
import { MarkdownContent } from "@/components/site/markdown-content";

export const metadata: Metadata = {
  title: "About",
  description: "About me.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <MarkdownContent
        content={
          profile?.aboutContent ||
          "Add your bio from the admin panel (Profile section) to fill in this page."
        }
      />
    </div>
  );
}
