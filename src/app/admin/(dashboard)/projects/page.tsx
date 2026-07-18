import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProject } from "@/lib/actions/projects";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: { techStack: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button nativeButton={false} render={<Link href="/admin/projects/new" />}>
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Tech</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {project.techStack.map((tag) => tag.name).join(", ") || "—"}
                </TableCell>
                <TableCell>
                  {project.featured ? <Badge>Featured</Badge> : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {project.updatedAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/admin/projects/${project.id}/edit`} />}
                    >
                      Edit
                    </Button>
                    <DeleteButton
                      onDelete={deleteProject.bind(null, project.id)}
                      itemLabel="project"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
