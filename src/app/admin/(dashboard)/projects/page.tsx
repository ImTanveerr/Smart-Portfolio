import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProject } from "@/lib/actions/projects";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: { techStack: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">No projects yet.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Tech</th>
              <th className="py-2 pr-4">Featured</th>
              <th className="py-2 pr-4">Updated</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4 font-medium">{project.title}</td>
                <td className="py-2 pr-4 text-black/60 dark:text-white/60">
                  {project.techStack.map((tag) => tag.name).join(", ") || "—"}
                </td>
                <td className="py-2 pr-4">{project.featured ? "Yes" : "No"}</td>
                <td className="py-2 pr-4 text-black/60 dark:text-white/60">
                  {project.updatedAt.toLocaleDateString()}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="text-sm underline underline-offset-2"
                    >
                      Edit
                    </Link>
                    <DeleteButton onDelete={deleteProject.bind(null, project.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
