"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { profileSchema, type ProfileFormValues } from "@/lib/validations";
import { updateProfile } from "@/lib/actions/profile";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      title: "",
      description: "",
      email: "",
      phone: "",
      avatarImage: "",
      githubUrl: "",
      linkedinUrl: "",
      twitterUrl: "",
      websiteUrl: "",
      ...defaultValues,
    },
  });

  const avatarImage = watch("avatarImage");

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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {success && <p className="text-sm text-green-600">Profile saved.</p>}

      <div className="space-y-1">
        <Label htmlFor="avatarImage">Profile image</Label>
        <ImageUploadField
          value={avatarImage ?? ""}
          onChange={(value) => setValue("avatarImage", value, { shouldValidate: true })}
          folder="profile"
        />
        {errors.avatarImage && (
          <p className="text-sm text-destructive">{errors.avatarImage.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
