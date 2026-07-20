import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/site/post-card";
import { EmptyState } from "@/components/site/empty-state";
import { Reveal } from "@/components/site/reveal";
import { StaggerGroup, StaggerItem } from "@/components/site/stagger";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on software engineering topics.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(tag ? { tags: { some: { slug: tag } } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
  });

  return (
    <div className="max-w-2xl space-y-8">
      <Reveal className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="text-lg text-muted-foreground">Writing on software engineering topics.</p>
      </Reveal>

      {tag && (
        <Link href="/blog" className="inline-block">
          <Badge variant="secondary" className="gap-1">
            {tag}
            <X className="size-3" />
          </Badge>
        </Link>
      )}

      {posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={tag ? `No posts tagged "${tag}"` : "No posts published yet"}
          description={tag ? undefined : "Publish one from the admin panel."}
        />
      ) : (
        <StaggerGroup className="space-y-6">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <PostCard post={post} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
