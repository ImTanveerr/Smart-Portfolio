import { notFound } from "next/navigation";
import { Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { MessageDeleteButton } from "@/components/admin/message-delete-button";
import { MarkMessageRead } from "@/components/admin/mark-message-read";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });

  if (!message) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <MarkMessageRead id={message.id} read={message.read} />
      <AdminPageHeader
        title={message.name}
        description={message.createdAt.toLocaleString()}
        actions={<MessageDeleteButton id={message.id} />}
      />

      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{message.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Project type</p>
              <p>{message.projectType || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Budget</p>
              <p>{message.budget || "—"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Message</p>
            <p className="whitespace-pre-wrap">{message.message}</p>
          </div>
        </CardContent>
      </Card>

      <Button nativeButton={false} render={<a href={`mailto:${message.email}`} />}>
        <Mail /> Reply by email
      </Button>
    </div>
  );
}
