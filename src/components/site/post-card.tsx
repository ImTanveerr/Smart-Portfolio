import Link from "next/link";
import { TagPills } from "@/components/site/tag-pills";

type PostCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  tags: { name: string; slug: string }[];
};

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="space-y-2 border-b border-black/10 pb-8 dark:border-white/10">
      {post.publishedAt && (
        <time className="text-sm text-black/50 dark:text-white/50">
          {post.publishedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      )}
      <h2 className="text-xl font-semibold">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      {post.excerpt && <p className="text-black/70 dark:text-white/70">{post.excerpt}</p>}
      <TagPills tags={post.tags} basePath="/blog" />
    </article>
  );
}
