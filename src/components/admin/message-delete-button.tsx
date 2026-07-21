"use client";

import { useRouter } from "next/navigation";
import { deleteMessage } from "@/lib/actions/messages";
import { DeleteButton } from "@/components/admin/delete-button";
import type { ActionResult } from "@/lib/actions/types";

// Wraps the generic DeleteButton with a redirect back to the list once
// deletion succeeds - plain DeleteButton only refreshes in place, which
// would leave this page open on a message that no longer exists.
export function MessageDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete(): Promise<ActionResult> {
    const result = await deleteMessage(id);
    if (!("error" in result)) {
      router.push("/admin/messages");
    }
    return result;
  }

  return <DeleteButton onDelete={handleDelete} itemLabel="message" />;
}
