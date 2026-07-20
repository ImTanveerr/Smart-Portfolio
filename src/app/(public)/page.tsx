import Link from "next/link";
import { Download, FileText, FolderGit2, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/profile";
import { ProjectCard } from "@/components/site/project-card";
import { PostCard } from "@/components/site/post-card";
import { EmptyState } from "@/components/site/empty-state";
import { ProfileHero } from "@/components/site/profile-hero";
import { MarkdownContent } from "@/components/site/markdown-content";
import { SkillsSection } from "@/components/site/skills-section";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { StaggerGroup, StaggerItem } from "@/components/site/stagger";
import { Button } from "@/components/ui/button";

// Otherwise Next.js prerenders this page statically at build time (no params/
// searchParams to signal dynamic rendering), so newly published content
// wouldn't show up here until the next deploy.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, skills] = await Promise.all([
    getProfile(),
    prisma.skill.findMany({ orderBy: { name: "asc" } }),
  ]);

  const [featuredProjects, latestPosts] = await Promise.all([
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: profile?.projectsCount ?? 3,
      include: { techStack: true },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: profile?.postsCount ?? 3,
      include: { tags: true },
    }),
  ]);

  return (
    <div className="space-y-24">
      <ProfileHero profile={profile} skills={skills.map((skill) => skill.name)} />

      {skills.length > 0 && (
        <section id="skills" className="scroll-mt-24 space-y-6">
          <Reveal>
            <SectionHeading eyebrow="Toolbox" title="Skills" />
          </Reveal>
          <SkillsSection skills={skills} />
        </section>
      )}

      <section id="projects" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Featured projects"
            action={
              <Link
                href="/projects"
                className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                View all
              </Link>
            }
          />
        </Reveal>
        {featuredProjects.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No featured projects yet"
            description="Mark a project as featured from the admin panel to have it show up here."
          />
        ) : (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>

      <section id="blog" className="scroll-mt-24 space-y-6">
        <Reveal>
          <SectionHeading
            eyebrow="Writing"
            title="Latest posts"
            action={
              <Link
                href="/blog"
                className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                View all
              </Link>
            }
          />
        </Reveal>
        {latestPosts.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No posts published yet"
            description="Publish a post from the admin panel to have it show up here."
          />
        ) : (
          <StaggerGroup className="space-y-6">
            {latestPosts.map((post) => (
              <StaggerItem key={post.id}>
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>

      <section id="about" className="scroll-mt-24 max-w-2xl space-y-6">
        <Reveal>
          <SectionHeading eyebrow="Get to know me" title="About" />
        </Reveal>
        <Reveal delay={0.05}>
          <MarkdownContent
            content={
              profile?.aboutContent ||
              "Add your bio from the admin panel (Profile section) to fill in this section."
            }
          />
        </Reveal>
        {profile?.resumeUrl && (
          <Reveal delay={0.1} className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href="/api/resume" target="_blank" rel="noopener noreferrer" />}
            >
              <FileText />
              View resume
            </Button>
            <Button nativeButton={false} render={<a href="/api/resume?download=1" />}>
              <Download />
              Download resume
            </Button>
          </Reveal>
        )}
      </section>
    </div>
  );
}
