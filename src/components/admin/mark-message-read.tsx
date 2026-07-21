"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markMessageRead } from "@/lib/actions/messages";

// Fires once when an unread message's detail page is opened - the usual
// "opening it is what marks it read" inbox behavior - without doing a write
// during a Server Component's render.
export function MarkMessageRead({ id, read }: { id: string; read: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (read) return;
    markMessageRead(id, true).then(() => router.refresh());
  }, [id, read, router]);

  return null;
}
