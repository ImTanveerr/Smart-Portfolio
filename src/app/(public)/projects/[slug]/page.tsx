import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/site/markdown-content";
import { TagPills } from "@/components/site/tag-pills";

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
    <article className="space-y-6">
      {project.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full rounded-lg border border-border object-cover"
        />
      )}

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{project.title}</h1>
        <p className="text-muted-foreground">{project.summary}</p>
      </div>

      <TagPills tags={project.techStack} basePath="/projects" />

      <div className="flex gap-4 text-sm">
        {project.repoUrl && (
          <a href={project.repoUrl} className="underline underline-offset-2">
            Source code
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} className="underline underline-offset-2">
            Live site
          </a>
        )}
      </div>

      <MarkdownContent content={project.description} />
    </article>
  );
}
