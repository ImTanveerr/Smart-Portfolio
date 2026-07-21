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
          className="rounded-full bg-muted px-3 py-1 font-mono text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
