import Link from "next/link";
import { FolderGit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  coverImage: string | null;
  techStack: { name: string; slug: string }[];
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <Card className="h-full gap-0 py-0 transition-shadow hover:shadow-md">
        <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-muted">
          {project.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImage}
              alt={project.title}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <FolderGit2 className="size-8 text-muted-foreground" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <CardContent className="space-y-2 py-4">
          <h2 className="font-semibold tracking-tight group-hover:underline group-hover:underline-offset-2">
            {project.title}
          </h2>
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.map((tag) => (
                <Badge key={tag.slug} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
