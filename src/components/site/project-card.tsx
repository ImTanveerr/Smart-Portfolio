import Link from "next/link";
import { TagPills } from "@/components/site/tag-pills";

type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  coverImage: string | null;
  techStack: { name: string; slug: string }[];
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article className="space-y-3 border-b border-border pb-8">
      {project.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full rounded-lg border border-border object-cover"
        />
      )}
      <h2 className="text-xl font-semibold">
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h2>
      <p className="text-muted-foreground">{project.summary}</p>
      <TagPills tags={project.techStack} basePath="/projects" />
    </article>
  );
}
