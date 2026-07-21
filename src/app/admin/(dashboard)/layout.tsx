import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "./sign-out-button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const unreadMessageCount = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
        <div className="flex h-14 flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Link href="/admin" className="flex shrink-0 items-center gap-2 font-semibold">
              <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-a)] to-[var(--accent-b)] text-xs text-white">
                A
              </span>
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <AdminNav unreadMessageCount={unreadMessageCount} />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground md:inline">{session.user?.email}</span>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
