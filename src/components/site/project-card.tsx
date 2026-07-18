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
    <article className="space-y-3 border-b border-black/10 pb-8 dark:border-white/10">
      {project.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full rounded-lg border border-black/10 object-cover dark:border-white/10"
        />
      )}
      <h2 className="text-xl font-semibold">
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h2>
      <p className="text-black/70 dark:text-white/70">{project.summary}</p>
      <TagPills tags={project.techStack} basePath="/projects" />
    </article>
  );
}
