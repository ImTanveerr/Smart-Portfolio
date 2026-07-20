import Link from "next/link";
import Image from "next/image";
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
      <Card className="h-full gap-0 py-0 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[var(--accent-a)]/30">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-muted">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <FolderGit2 className="size-8 text-muted-foreground" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <CardContent className="space-y-2 py-4">
          <h2 className="font-semibold tracking-tight group-hover:text-[var(--accent-a)] dark:group-hover:text-[var(--accent-b)]">
            {project.title}
          </h2>
          <p className="line-clamp-2 text-base text-muted-foreground">{project.summary}</p>
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
