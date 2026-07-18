"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { postSchema, type PostFormValues } from "@/lib/validations";
import { slugify } from "@/lib/slugify";
import { createPost, updatePost } from "@/lib/actions/posts";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

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
    control,
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
  const coverImage = watch("coverImage");

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
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title", {
            onChange: (event) => {
              if (!slugTouched) {
                setValue("slug", slugify(event.target.value));
              }
            },
          })}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          className="font-mono"
          {...register("slug", {
            onChange: () => setSlugTouched(true),
          })}
        />
        {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={2} {...register("excerpt")} />
        {errors.excerpt && (
          <p className="text-sm text-destructive">{errors.excerpt.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Content (Markdown)</Label>
        <MarkdownEditor
          value={content}
          onChange={(value) => setValue("content", value, { shouldValidate: true })}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="coverImage">Cover image</Label>
        <ImageUploadField
          value={coverImage ?? ""}
          onChange={(value) => setValue("coverImage", value, { shouldValidate: true })}
          folder="posts"
        />
        {errors.coverImage && (
          <p className="text-sm text-destructive">{errors.coverImage.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" placeholder="TypeScript, Web Performance" {...register("tags")} />
      </div>

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <Switch
              id="published"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : postId ? "Save changes" : "Create post"}
      </Button>
    </form>
  );
}
