import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/site/project-card";

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
      <h1 className="text-2xl font-semibold">Projects</h1>
      {tag && (
        <p className="text-sm text-black/60 dark:text-white/60">
          Filtered by tag: <span className="font-medium">{tag}</span>
        </p>
      )}
      {projects.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">No projects to show.</p>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
