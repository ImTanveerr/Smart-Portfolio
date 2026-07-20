import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/site/markdown-content";
import { TagPills } from "@/components/site/tag-pills";
import { Reveal } from "@/components/site/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
      publishedTime: post.publishedAt?.toISOString(),
      type: "article",
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { tags: true },
  });

  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All posts
      </Link>

      {post.coverImage && (
        <Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="aspect-video w-full rounded-xl border border-border object-cover"
          />
        </Reveal>
      )}

      <Reveal delay={0.05} className="space-y-3">
        {post.publishedAt && (
          <time className="text-sm text-muted-foreground">
            {post.publishedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      </Reveal>

      <TagPills tags={post.tags} basePath="/blog" />

      <MarkdownContent content={post.content} />
    </article>
  );
}
