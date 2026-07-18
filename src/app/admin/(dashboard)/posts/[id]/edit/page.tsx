import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <PostForm
        postId={post.id}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          published: post.published,
          tags: post.tags.map((tag) => tag.name).join(", "),
        }}
      />
    </div>
  );
}
