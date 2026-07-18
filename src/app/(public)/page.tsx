import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/site/project-card";
import { PostCard } from "@/components/site/post-card";

export default async function HomePage() {
  const [featuredProjects, latestPosts] = await Promise.all([
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 3,
      include: { techStack: true },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { tags: true },
    }),
  ]);

  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Hi, I&apos;m a software engineer.</h1>
        <p className="max-w-xl text-black/70 dark:text-white/70">
          I build things and write about it here. Take a look at my{" "}
          <Link href="/projects" className="underline underline-offset-2">
            projects
          </Link>{" "}
          or read the{" "}
          <Link href="/blog" className="underline underline-offset-2">
            blog
          </Link>
          .
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured projects</h2>
          <Link href="/projects" className="text-sm underline underline-offset-2">
            View all
          </Link>
        </div>
        {featuredProjects.length === 0 ? (
          <p className="text-black/60 dark:text-white/60">
            No featured projects yet — check back soon.
          </p>
        ) : (
          <div className="space-y-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest posts</h2>
          <Link href="/blog" className="text-sm underline underline-offset-2">
            View all
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <p className="text-black/60 dark:text-white/60">No posts published yet.</p>
        ) : (
          <div className="space-y-8">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
