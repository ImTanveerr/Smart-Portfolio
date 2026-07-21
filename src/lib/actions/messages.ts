"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { ActionResult } from "@/lib/actions/types";

function revalidateMessagePages() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function markMessageRead(id: string, read: boolean): Promise<ActionResult> {
  await requireAdmin();

  await prisma.contactMessage.update({ where: { id }, data: { read } });

  revalidateMessagePages();
  return { success: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();

  await prisma.contactMessage.delete({ where: { id } });

  revalidateMessagePages();
  return { success: true };
}
