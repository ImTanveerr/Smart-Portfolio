import Link from "next/link";

export function TagPills({
  tags,
  basePath,
}: {
  tags: { name: string; slug: string }[];
  basePath: "/projects" | "/blog";
}) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`${basePath}?tag=${tag.slug}`}
          className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
