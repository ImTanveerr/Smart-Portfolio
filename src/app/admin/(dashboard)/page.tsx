import Link from "next/link";
import {
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Mail,
  Newspaper,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/profile";
import { toDateKey } from "@/lib/date";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const todayKey = toDateKey(new Date());
  const todayEnd = new Date(todayKey);
  todayEnd.setHours(23, 59, 59, 999);

  const [projectCount, postCount, publishedCount, skillCount, focusTaskCount, unreadCount, profile] =
    await Promise.all([
      prisma.project.count(),
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.skill.count(),
      // Same "today's focus" definition as the todo list: no due date (the
      // backlog) or due today or earlier, and not done yet.
      prisma.task.count({
        where: { done: false, OR: [{ dueDate: null }, { dueDate: { lte: todayEnd } }] },
      }),
      prisma.contactMessage.count({ where: { read: false } }),
      getProfile(),
    ]);

  const stats = [
    { href: "/admin/messages", label: "New messages", value: unreadCount, icon: Mail },
    { href: "/admin/projects", label: "Projects", value: projectCount, icon: FolderKanban },
    { href: "/admin/posts", label: "Blog posts", value: postCount, icon: Newspaper },
    { href: "/admin/posts", label: "Published", value: publishedCount, icon: CheckCircle2 },
    { href: "/admin/todos", label: "Tasks due today", value: focusTaskCount, icon: ListTodo },
    { href: "/admin/skills", label: "Skills", value: skillCount, icon: Sparkles },
    {
      href: "/admin/profile",
      label: "Profile",
      value: profile?.name ? "Complete" : "Set up",
      icon: UserRound,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your site content and tasks."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
                <CardAction>
                  <stat.icon className="size-4 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">{stat.value}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" nativeButton={false} render={<Link href="/admin/projects/new" />}>
            <Plus /> New project
          </Button>
          <Button size="sm" nativeButton={false} render={<Link href="/admin/posts/new" />}>
            <Plus /> New post
          </Button>
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            render={<Link href="/admin/todos" />}
          >
            <Plus /> Add task
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
