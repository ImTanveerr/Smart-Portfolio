"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Images, LayoutGrid, NotebookText, Share2, UserRound } from "lucide-react";
import { profileSchema, type ProfileFormInput, type ProfileFormValues } from "@/lib/validations";
import { updateProfile } from "@/lib/actions/profile";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { ResumeUploadField } from "@/components/admin/resume-upload-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileForm({ defaultValues }: { defaultValues?: Partial<ProfileFormValues> }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      title: "",
      description: "",
      aboutContent: "",
      email: "",
      phone: "",
      avatarImage: "",
      avatarImage2: "",
      githubUrl: "",
      linkedinUrl: "",
      twitterUrl: "",
      websiteUrl: "",
      resumeUrl: "",
      projectsCount: 3,
      postsCount: 3,
      ...defaultValues,
    },
  });

  const avatarImage = watch("avatarImage");
  const avatarImage2 = watch("avatarImage2");
  const aboutContent = watch("aboutContent");
  const resumeUrl = watch("resumeUrl");

  async function onSubmit(values: ProfileFormValues) {
    setServerError(null);
    setSuccess(false);
    const result = await updateProfile(values);

    if ("error" in result) {
      setServerError(result.error);
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {success && (
        <p className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-500">
          <CheckCircle2 className="size-4" /> Profile saved.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Images className="size-4 text-muted-foreground" />
            Photos
          </CardTitle>
          <CardDescription>
            Used in the hero. If both are set, the hero cycles between them every few seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="avatarImage">Profile image 1</Label>
              <ImageUploadField
                value={avatarImage ?? ""}
                onChange={(value) => setValue("avatarImage", value, { shouldValidate: true })}
                folder="profile"
              />
              {errors.avatarImage && (
                <p className="text-sm text-destructive">{errors.avatarImage.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="avatarImage2">Profile image 2 (optional)</Label>
              <ImageUploadField
                value={avatarImage2 ?? ""}
                onChange={(value) => setValue("avatarImage2", value, { shouldValidate: true })}
                folder="profile"
              />
              {errors.avatarImage2 && (
                <p className="text-sm text-destructive">{errors.avatarImage2.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserRound className="size-4 text-muted-foreground" />
            Basic info
          </CardTitle>
          <CardDescription>Shown in the hero section on the home page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Software Engineer" {...register("title")} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <NotebookText className="size-4 text-muted-foreground" />
            About
          </CardTitle>
          <CardDescription>Shown on the home page and the About page.</CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownEditor
            value={aboutContent ?? ""}
            onChange={(value) => setValue("aboutContent", value, { shouldValidate: true })}
          />
          {errors.aboutContent && (
            <p className="mt-1 text-sm text-destructive">{errors.aboutContent.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4 text-muted-foreground" />
            Resume
          </CardTitle>
          <CardDescription>Shown as a download link under the About section.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeUploadField
            value={resumeUrl ?? ""}
            onChange={(value) => setValue("resumeUrl", value, { shouldValidate: true })}
          />
          {errors.resumeUrl && (
            <p className="mt-1 text-sm text-destructive">{errors.resumeUrl.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Share2 className="size-4 text-muted-foreground" />
            Contact &amp; social
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input id="githubUrl" {...register("githubUrl")} />
              {errors.githubUrl && (
                <p className="text-sm text-destructive">{errors.githubUrl.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" {...register("linkedinUrl")} />
              {errors.linkedinUrl && (
                <p className="text-sm text-destructive">{errors.linkedinUrl.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="twitterUrl">X / Twitter URL</Label>
              <Input id="twitterUrl" {...register("twitterUrl")} />
              {errors.twitterUrl && (
                <p className="text-sm text-destructive">{errors.twitterUrl.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input id="websiteUrl" {...register("websiteUrl")} />
              {errors.websiteUrl && (
                <p className="text-sm text-destructive">{errors.websiteUrl.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LayoutGrid className="size-4 text-muted-foreground" />
            Landing page display
          </CardTitle>
          <CardDescription>How many items to show on the home page.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="projectsCount">Featured projects to show</Label>
              <Input
                id="projectsCount"
                type="number"
                min={1}
                max={12}
                {...register("projectsCount")}
              />
              {errors.projectsCount && (
                <p className="text-sm text-destructive">{errors.projectsCount.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="postsCount">Latest posts to show</Label>
              <Input id="postsCount" type="number" min={1} max={12} {...register("postsCount")} />
              {errors.postsCount && (
                <p className="text-sm text-destructive">{errors.postsCount.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancels out <main>'s padding so the bar spans the full viewport
          width and stays reachable without scrolling back up on mobile. */}
      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
