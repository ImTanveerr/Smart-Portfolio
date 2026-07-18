import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Code, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/site/markdown-content";
import { TagPills } from "@/components/site/tag-pills";
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
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>

      {project.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImage}
          alt={project.title}
          className="aspect-video w-full rounded-xl border border-border object-cover"
        />
      )}

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="text-lg text-muted-foreground">{project.summary}</p>
      </div>

      <TagPills tags={project.techStack} basePath="/projects" />

      {(project.repoUrl || project.liveUrl) && (
        <div className="flex flex-wrap gap-3">
          {project.repoUrl && (
            <Button variant="outline" render={<a href={project.repoUrl} />}>
              <Code />
              Source code
            </Button>
          )}
          {project.liveUrl && (
            <Button render={<a href={project.liveUrl} />}>
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
