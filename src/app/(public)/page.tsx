import Link from "next/link";
import { ArrowRight, FolderGit2, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/site/project-card";
import { PostCard } from "@/components/site/post-card";
import { EmptyState } from "@/components/site/empty-state";
import { Button } from "@/components/ui/button";

// Otherwise Next.js prerenders this page statically at build time (no params/
// searchParams to signal dynamic rendering), so newly published content
// wouldn't show up here until the next deploy.
export const dynamic = "force-dynamic";

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
    <div className="space-y-20">
      <section className="max-w-2xl space-y-5 py-4">
        <p className="text-sm font-medium text-muted-foreground">
          Hi, I&apos;m a software engineer 👋
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          I build things and write about how they work.
        </h1>
        <p className="text-lg text-muted-foreground">
          Take a look at what I&apos;ve shipped, or read what I&apos;ve learned along the way.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button render={<Link href="/projects" />}>
            View projects
            <ArrowRight />
          </Button>
          <Button variant="outline" render={<Link href="/blog" />}>
            Read the blog
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Featured projects</h2>
          <Link
            href="/projects"
            className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            View all
          </Link>
        </div>
        {featuredProjects.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No featured projects yet"
            description="Mark a project as featured from the admin panel to have it show up here."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Latest posts</h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            View all
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No posts published yet"
            description="Publish a post from the admin panel to have it show up here."
          />
        ) : (
          <div className="space-y-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
