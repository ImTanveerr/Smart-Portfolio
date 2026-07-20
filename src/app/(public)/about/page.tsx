import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { getProfile } from "@/lib/profile";
import { MarkdownContent } from "@/components/site/markdown-content";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "About me.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="max-w-2xl space-y-6">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      </Reveal>
      <Reveal delay={0.05}>
        <MarkdownContent
          content={
            profile?.aboutContent ||
            "Add your bio from the admin panel (Profile section) to fill in this page."
          }
        />
      </Reveal>
      {profile?.resumeUrl && (
        <Reveal delay={0.1} className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href="/api/resume" target="_blank" rel="noopener noreferrer" />}
          >
            <FileText />
            View resume
          </Button>
          <Button nativeButton={false} render={<a href="/api/resume?download=1" />}>
            <Download />
            Download resume
          </Button>
        </Reveal>
      )}
    </div>
  );
}
