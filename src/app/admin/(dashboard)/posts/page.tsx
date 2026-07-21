import Link from "next/link";
import { Newspaper, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions/posts";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/site/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { tags: true },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog posts"
        description="Shown in the Blog section on the home page."
        actions={
          <Button nativeButton={false} render={<Link href="/admin/posts/new" />}>
            <Plus /> New post
          </Button>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts yet"
          description="Write your first post to fill out the blog."
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.tags.map((tag) => tag.name).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.updatedAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/posts/${post.id}/edit`} />}
                      >
                        Edit
                      </Button>
                      <DeleteButton
                        onDelete={deletePost.bind(null, post.id)}
                        itemLabel="post"
                      />
                    </div>
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
