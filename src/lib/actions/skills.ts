"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { skillSchema, type SkillFormValues } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import type { ActionResult } from "@/lib/actions/types";

export async function createSkill(values: SkillFormValues): Promise<ActionResult> {
  await requireAdmin();

  const parsed = skillSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const existing = await prisma.skill.findUnique({ where: { name: data.name } });
  if (existing) {
    return { error: "A skill with this name already exists." };
  }

  await prisma.skill.create({ data });

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true };
}

export async function updateSkillCategory(
  id: string,
  category: SkillFormValues["category"]
): Promise<ActionResult> {
  await requireAdmin();

  await prisma.skill.update({ where: { id }, data: { category } });

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requireAdmin();

  await prisma.skill.delete({ where: { id } });

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true };
}
