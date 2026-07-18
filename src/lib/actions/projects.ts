"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, type ProjectFormValues } from "@/lib/validations";
import { slugify } from "@/lib/slugify";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

async function resolveTags(techStackInput: string | undefined) {
  const names = (techStackInput ?? "")
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

export type ActionResult = { error: string } | { success: true };

export async function createProject(values: ProjectFormValues): Promise<ActionResult> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { error: "A project with this slug already exists." };
  }

  const techStack = await resolveTags(data.techStack);

  await prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description,
      coverImage: data.coverImage || null,
      repoUrl: data.repoUrl || null,
      liveUrl: data.liveUrl || null,
      featured: data.featured,
      techStack: { connect: techStack },
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function updateProject(
  id: string,
  values: ProjectFormValues
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    return { error: "A project with this slug already exists." };
  }

  const techStack = await resolveTags(data.techStack);

  await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description,
      coverImage: data.coverImage || null,
      repoUrl: data.repoUrl || null,
      liveUrl: data.liveUrl || null,
      featured: data.featured,
      techStack: { set: techStack },
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();

  await prisma.project.delete({ where: { id } });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}
