import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <article className="group -mx-4 space-y-2 rounded-xl border-b border-border px-4 py-6 transition-colors last:border-b-0 hover:bg-muted/40">
      {post.publishedAt && (
        <time className="text-sm text-muted-foreground">
          {post.publishedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      )}
      <h2 className="flex items-center gap-1.5 text-xl font-semibold tracking-tight">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors group-hover:text-[var(--accent-a)] dark:group-hover:text-[var(--accent-b)]"
        >
          {post.title}
        </Link>
        <ArrowUpRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </h2>
      {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}
      <TagPills tags={post.tags} basePath="/blog" />
    </article>
  );
}
