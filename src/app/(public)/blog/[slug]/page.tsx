import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/site/markdown-content";
import { TagPills } from "@/components/site/tag-pills";

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
    <article className="space-y-6">
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full rounded-lg border border-black/10 object-cover dark:border-white/10"
        />
      )}

      <div className="space-y-2">
        {post.publishedAt && (
          <time className="text-sm text-black/50 dark:text-white/50">
            {post.publishedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        <h1 className="text-3xl font-semibold">{post.title}</h1>
      </div>

      <TagPills tags={post.tags} basePath="/blog" />

      <MarkdownContent content={post.content} />
    </article>
  );
}
