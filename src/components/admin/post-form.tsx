"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { postSchema, type PostFormValues } from "@/lib/validations";
import { slugify } from "@/lib/slugify";
import { createPost, updatePost } from "@/lib/actions/posts";
import { MarkdownEditor } from "@/components/admin/markdown-editor";

export function PostForm({
  postId,
  defaultValues,
}: {
  postId?: string;
  defaultValues?: Partial<PostFormValues>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
      tags: "",
      ...defaultValues,
    },
  });

  const content = watch("content");

  async function onSubmit(values: PostFormValues) {
    setServerError(null);
    const result = postId ? await updatePost(postId, values) : await createPost(values);

    if ("error" in result) {
      setServerError(result.error);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          {...register("title", {
            onChange: (event) => {
              if (!slugTouched) {
                setValue("slug", slugify(event.target.value));
              }
            },
          })}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 dark:border-white/15"
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="slug" className="text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          {...register("slug", {
            onChange: () => setSlugTouched(true),
          })}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 font-mono text-sm dark:border-white/15"
        />
        {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="excerpt" className="text-sm font-medium">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          rows={2}
          {...register("excerpt")}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 dark:border-white/15"
        />
        {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Content (Markdown)</label>
        <MarkdownEditor
          value={content}
          onChange={(value) => setValue("content", value, { shouldValidate: true })}
        />
        {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="coverImage" className="text-sm font-medium">
          Cover image URL
        </label>
        <input
          id="coverImage"
          {...register("coverImage")}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 dark:border-white/15"
        />
        {errors.coverImage && (
          <p className="text-sm text-red-600">{errors.coverImage.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          placeholder="TypeScript, Web Performance"
          {...register("tags")}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </div>

      <div className="flex items-center gap-2">
        <input id="published" type="checkbox" {...register("published")} />
        <label htmlFor="published" className="text-sm font-medium">
          Published
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {isSubmitting ? "Saving..." : postId ? "Save changes" : "Create post"}
      </button>
    </form>
  );
}
