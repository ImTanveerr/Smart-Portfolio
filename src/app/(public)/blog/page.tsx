import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/site/post-card";

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
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Blog</h1>
      {tag && (
        <p className="text-sm text-black/60 dark:text-white/60">
          Filtered by tag: <span className="font-medium">{tag}</span>
        </p>
      )}
      {posts.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">No posts published yet.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
