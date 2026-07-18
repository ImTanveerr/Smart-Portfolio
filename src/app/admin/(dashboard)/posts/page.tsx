import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions/posts";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { tags: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">No posts yet.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Tags</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Updated</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4 font-medium">{post.title}</td>
                <td className="py-2 pr-4 text-black/60 dark:text-white/60">
                  {post.tags.map((tag) => tag.name).join(", ") || "—"}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      post.published
                        ? "rounded bg-green-100 px-2 py-0.5 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "rounded bg-yellow-100 px-2 py-0.5 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                    }
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-2 pr-4 text-black/60 dark:text-white/60">
                  {post.updatedAt.toLocaleDateString()}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-sm underline underline-offset-2"
                    >
                      Edit
                    </Link>
                    <DeleteButton onDelete={deletePost.bind(null, post.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
