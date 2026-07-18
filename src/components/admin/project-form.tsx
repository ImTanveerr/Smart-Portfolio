"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { projectSchema, type ProjectFormValues } from "@/lib/validations";
import { slugify } from "@/lib/slugify";
import { createProject, updateProject } from "@/lib/actions/projects";
import { MarkdownEditor } from "@/components/admin/markdown-editor";

export function ProjectForm({
  projectId,
  defaultValues,
}: {
  projectId?: string;
  defaultValues?: Partial<ProjectFormValues>;
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
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      coverImage: "",
      repoUrl: "",
      liveUrl: "",
      featured: false,
      techStack: "",
      ...defaultValues,
    },
  });

  const description = watch("description");

  async function onSubmit(values: ProjectFormValues) {
    setServerError(null);
    const result = projectId
      ? await updateProject(projectId, values)
      : await createProject(values);

    if ("error" in result) {
      setServerError(result.error);
      return;
    }

    router.push("/admin/projects");
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
        <label htmlFor="summary" className="text-sm font-medium">
          Summary
        </label>
        <textarea
          id="summary"
          rows={2}
          {...register("summary")}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 dark:border-white/15"
        />
        {errors.summary && <p className="text-sm text-red-600">{errors.summary.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Description (Markdown)</label>
        <MarkdownEditor
          value={description}
          onChange={(value) => setValue("description", value, { shouldValidate: true })}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="repoUrl" className="text-sm font-medium">
            Repo URL
          </label>
          <input
            id="repoUrl"
            {...register("repoUrl")}
            className="w-full rounded border border-black/15 bg-transparent px-3 py-2 dark:border-white/15"
          />
          {errors.repoUrl && <p className="text-sm text-red-600">{errors.repoUrl.message}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="liveUrl" className="text-sm font-medium">
            Live URL
          </label>
          <input
            id="liveUrl"
            {...register("liveUrl")}
            className="w-full rounded border border-black/15 bg-transparent px-3 py-2 dark:border-white/15"
          />
          {errors.liveUrl && <p className="text-sm text-red-600">{errors.liveUrl.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="techStack" className="text-sm font-medium">
          Tech stack (comma-separated)
        </label>
        <input
          id="techStack"
          placeholder="Next.js, TypeScript, Prisma"
          {...register("techStack")}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 dark:border-white/15"
        />
      </div>

      <div className="flex items-center gap-2">
        <input id="featured" type="checkbox" {...register("featured")} />
        <label htmlFor="featured" className="text-sm font-medium">
          Featured on home page
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {isSubmitting ? "Saving..." : projectId ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}
