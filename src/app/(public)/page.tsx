import Link from "next/link";
import { FolderGit2, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/profile";
import { ProjectCard } from "@/components/site/project-card";
import { PostCard } from "@/components/site/post-card";
import { EmptyState } from "@/components/site/empty-state";
import { ProfileHero } from "@/components/site/profile-hero";

// Otherwise Next.js prerenders this page statically at build time (no params/
// searchParams to signal dynamic rendering), so newly published content
// wouldn't show up here until the next deploy.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProjects, latestPosts, profile] = await Promise.all([
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
    getProfile(),
  ]);

  return (
    <div className="space-y-20">
      <ProfileHero profile={profile} />

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
