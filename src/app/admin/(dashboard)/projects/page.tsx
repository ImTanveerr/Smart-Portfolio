import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteProject } from "@/lib/actions/projects";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/site/empty-state";
import { Card } from "@/components/ui/card";
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
      <AdminPageHeader
        title="Projects"
        description="Shown in the Projects section on the home page."
        actions={
          <Button nativeButton={false} render={<Link href="/admin/projects/new" />}>
            <Plus /> New project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Add your first project to feature it on the home page."
        />
      ) : (
        <Card className="overflow-hidden py-0">
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
        </Card>
      )}
    </div>
  );
}
