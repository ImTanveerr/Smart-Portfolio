import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { techStack: true },
  });

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit project</h1>
      <ProjectForm
        projectId={project.id}
        defaultValues={{
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          description: project.description,
          coverImage: project.coverImage ?? "",
          repoUrl: project.repoUrl ?? "",
          liveUrl: project.liveUrl ?? "",
          featured: project.featured,
          techStack: project.techStack.map((tag) => tag.name).join(", "),
        }}
      />
    </div>
  );
}
