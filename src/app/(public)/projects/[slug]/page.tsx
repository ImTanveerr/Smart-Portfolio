import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Code, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/site/markdown-content";
import { TagPills } from "@/components/site/tag-pills";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { techStack: true },
  });

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>

      {project.coverImage && (
        <Reveal className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="(min-width: 768px) 42rem, 100vw"
            className="object-cover"
          />
        </Reveal>
      )}

      <Reveal delay={0.05} className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="text-lg text-muted-foreground">{project.summary}</p>
      </Reveal>

      <TagPills tags={project.techStack} basePath="/projects" />

      {(project.repoUrl || project.liveUrl) && (
        <div className="flex flex-wrap gap-3">
          {project.repoUrl && (
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href={project.repoUrl} target="_blank" rel="noopener noreferrer" />}
            >
              <Code />
              Source code
            </Button>
          )}
          {project.liveUrl && (
            <Button
              nativeButton={false}
              render={<a href={project.liveUrl} target="_blank" rel="noopener noreferrer" />}
              className="bg-gradient-to-r from-[var(--accent-a)] to-[var(--accent-b)] text-white hover:opacity-90"
            >
              <ExternalLink />
              Live site
            </Button>
          )}
        </div>
      )}

      <MarkdownContent content={project.description} />
    </article>
  );
}
