import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  summary: z.string().min(1, "Summary is required").max(300),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  repoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean(),
  techStack: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
  tags: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;
