"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { postSchema, type PostFormValues } from "@/lib/validations";
import { resolveTags } from "@/lib/tags";
import { requireAdmin } from "@/lib/require-admin";
import type { ActionResult } from "@/lib/actions/types";

export async function createPost(values: PostFormValues): Promise<ActionResult> {
  await requireAdmin();

  const parsed = postSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { error: "A post with this slug already exists." };
  }

  const tags = await resolveTags(data.tags);

  await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
      tags: { connect: tags },
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  return { success: true };
}

export async function updatePost(id: string, values: PostFormValues): Promise<ActionResult> {
  await requireAdmin();

  const parsed = postSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    return { error: "A post with this slug already exists." };
  }

  const current = await prisma.post.findUnique({ where: { id } });
  if (!current) {
    return { error: "Post not found." };
  }

  const tags = await resolveTags(data.tags);

  await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      published: data.published,
      publishedAt: data.published && !current.publishedAt ? new Date() : current.publishedAt,
      tags: { set: tags },
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  return { success: true };
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin();

  await prisma.post.delete({ where: { id } });

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  return { success: true };
}
