import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
        <nav className="flex items-center gap-6">
          <Link href="/admin" className="font-semibold">
            Admin
          </Link>
          <Link href="/admin/projects" className="text-sm">
            Projects
          </Link>
          <Link href="/admin/posts" className="text-sm">
            Blog posts
          </Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-black/60 dark:text-white/60">
            {session.user?.email}
          </span>
          <SignOutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
