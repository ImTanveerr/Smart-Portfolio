import Link from "next/link";
import { Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/site/empty-state";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Messages"
        description="Project inquiries submitted through the /contact page."
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages yet"
          description="Submissions from your contact form will show up here."
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>From</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id} className={cn(!message.read && "font-medium")}>
                  <TableCell>
                    {!message.read && (
                      <span className="block size-2 rounded-full bg-[var(--accent-a)]" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/messages/${message.id}`} className="hover:underline">
                      {message.name}
                    </Link>
                    <div className="text-sm font-normal text-muted-foreground">
                      {message.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {message.projectType || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{message.budget || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {message.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
