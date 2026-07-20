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
    <article className="group space-y-2 border-b border-border py-2 pb-8 transition-colors">
      {post.publishedAt && (
        <time className="text-sm text-muted-foreground">
          {post.publishedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      )}
      <h2 className="text-xl font-semibold tracking-tight">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors group-hover:text-[var(--accent-a)] dark:group-hover:text-[var(--accent-b)]"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}
      <TagPills tags={post.tags} basePath="/blog" />
    </article>
  );
}
