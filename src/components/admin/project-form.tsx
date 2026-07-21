"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { projectSchema, type ProjectFormValues } from "@/lib/validations";
import { slugify } from "@/lib/slugify";
import { createProject, updateProject } from "@/lib/actions/projects";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    control,
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
  const coverImage = watch("coverImage");

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" rows={2} {...register("summary")} />
            {errors.summary && (
              <p className="text-sm text-destructive">{errors.summary.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownEditor
            value={description}
            onChange={(value) => setValue("description", value, { shouldValidate: true })}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Media &amp; links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="coverImage">Cover image</Label>
            <ImageUploadField
              value={coverImage ?? ""}
              onChange={(value) => setValue("coverImage", value, { shouldValidate: true })}
              folder="projects"
            />
            {errors.coverImage && (
              <p className="text-sm text-destructive">{errors.coverImage.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="repoUrl">Repo URL</Label>
              <Input id="repoUrl" {...register("repoUrl")} />
              {errors.repoUrl && (
                <p className="text-sm text-destructive">{errors.repoUrl.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input id="liveUrl" {...register("liveUrl")} />
              {errors.liveUrl && (
                <p className="text-sm text-destructive">{errors.liveUrl.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tech &amp; visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="techStack">Tech stack (comma-separated)</Label>
            <Input
              id="techStack"
              placeholder="Next.js, TypeScript, Prisma"
              {...register("techStack")}
            />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="featured">Featured on home page</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : projectId ? "Save changes" : "Create project"}
        </Button>
        <Button type="button" variant="ghost" nativeButton={false} render={<Link href="/admin/projects" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
