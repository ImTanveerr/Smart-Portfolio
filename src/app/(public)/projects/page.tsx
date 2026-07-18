import type { Metadata } from "next";
import Link from "next/link";
import { FolderGit2, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/site/project-card";
import { EmptyState } from "@/components/site/empty-state";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Projects",
  description: "Software projects I've built.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  const projects = await prisma.project.findMany({
    where: tag ? { techStack: { some: { slug: tag } } } : undefined,
    orderBy: { order: "asc" },
    include: { techStack: true },
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Things I&apos;ve built.</p>
      </div>

      {tag && (
        <Link href="/projects" className="inline-block">
          <Badge variant="secondary" className="gap-1">
            {tag}
            <X className="size-3" />
          </Badge>
        </Link>
      )}

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title={tag ? `No projects tagged "${tag}"` : "No projects yet"}
          description={tag ? undefined : "Add one from the admin panel."}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
