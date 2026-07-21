"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema, type ContactMessageFormValues } from "@/lib/validations";
import type { ActionResult } from "@/lib/actions/types";

// The one public-facing mutation on the site - anyone can call this from the
// /contact form, so there's no requireAdmin() here. `website` is a honeypot
// field hidden from real visitors (see the form component); a bot that fills
// it gets a fake success instead of a validation error, so it doesn't learn
// to work around the check.
export async function submitContactMessage(values: ContactMessageFormValues): Promise<ActionResult> {
  const parsed = contactMessageSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      projectType: parsed.data.projectType || null,
      budget: parsed.data.budget || null,
      message: parsed.data.message,
    },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}
