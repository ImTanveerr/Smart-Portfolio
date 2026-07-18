import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [projectCount, postCount, publishedCount, profile] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    getProfile(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/projects">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Projects</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{projectCount}</CardContent>
          </Card>
        </Link>
        <Link href="/admin/posts">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Blog posts</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{postCount}</CardContent>
          </Card>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{publishedCount}</CardContent>
        </Card>
        <Link href="/admin/profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {profile?.name ? "Complete" : "Set up"}
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
