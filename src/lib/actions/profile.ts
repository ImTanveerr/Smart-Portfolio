"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { profileSchema, type ProfileFormValues } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import { PROFILE_ID } from "@/lib/profile";
import type { ActionResult } from "@/lib/actions/types";

export async function updateProfile(values: ProfileFormValues): Promise<ActionResult> {
  await requireAdmin();

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const fields = {
    name: data.name || null,
    title: data.title || null,
    description: data.description || null,
    aboutContent: data.aboutContent || null,
    email: data.email || null,
    phone: data.phone || null,
    avatarImage: data.avatarImage || null,
    githubUrl: data.githubUrl || null,
    linkedinUrl: data.linkedinUrl || null,
    twitterUrl: data.twitterUrl || null,
    websiteUrl: data.websiteUrl || null,
    resumeUrl: data.resumeUrl || null,
    projectsCount: data.projectsCount,
    postsCount: data.postsCount,
  };

  await prisma.profile.upsert({
    where: { id: PROFILE_ID },
    update: fields,
    create: { id: PROFILE_ID, ...fields },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/");
  revalidatePath("/about");
  return { success: true };
}
