import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function resolveTags(tagsInput: string | undefined) {
  const names = (tagsInput ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const tags = await Promise.all(
    names.map((name) =>
      prisma.tag.upsert({
        where: { slug: slugify(name) },
        update: {},
        create: { name, slug: slugify(name) },
      })
    )
  );

  return tags.map((tag) => ({ id: tag.id }));
}
