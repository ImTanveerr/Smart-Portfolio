import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  summary: z.string().min(1, "Summary is required").max(300),
  description: z.string().min(1, "Description is required"),
  coverImage: z.url("Must be a valid URL").optional().or(z.literal("")),
  repoUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
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
  coverImage: z.url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
  tags: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;

export const profileSchema = z.object({
  name: z.string().max(100).optional().or(z.literal("")),
  title: z.string().max(150).optional().or(z.literal("")),
  description: z.string().max(1000).optional().or(z.literal("")),
  aboutContent: z.string().max(10000).optional().or(z.literal("")),
  email: z.email("Must be a valid email").optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  avatarImage: z.url("Must be a valid URL").optional().or(z.literal("")),
  avatarImage2: z.url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  linkedinUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  twitterUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  websiteUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  resumeUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  projectsCount: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "Must be at least 1")
    .max(12, "Must be 12 or fewer"),
  postsCount: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "Must be at least 1")
    .max(12, "Must be 12 or fewer"),
});

// z.coerce.number() (used by projectsCount/postsCount) accepts a string as
// input but produces a number as output, so the form's "before validation"
// and "after validation" shapes differ. ProfileForm's useForm<Input, _,
// Values> needs both: Input for what the <input> fields hold, Values for
// what onSubmit receives.
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ProfileFormInput = z.input<typeof profileSchema>;

export const SKILL_CATEGORIES = ["FRONTEND", "BACKEND", "DEVOPS", "OTHER"] as const;

export const SKILL_CATEGORY_LABELS: Record<(typeof SKILL_CATEGORIES)[number], string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DEVOPS: "DevOps",
  OTHER: "Other",
};

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  category: z.enum(SKILL_CATEGORIES),
});

export type SkillFormValues = z.infer<typeof skillSchema>;

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export const TASK_PRIORITY_LABELS: Record<(typeof TASK_PRIORITIES)[number], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const TASK_RECURRENCES = ["NONE", "DAILY", "WEEKLY", "MONTHLY"] as const;

export const TASK_RECURRENCE_LABELS: Record<(typeof TASK_RECURRENCES)[number], string> = {
  NONE: "Doesn't repeat",
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const timeField = z
  .string()
  .regex(TIME_RE, "Use 24h HH:mm")
  .optional()
  .or(z.literal(""));

// `dueDate` is a plain "yyyy-mm-dd" string (what an <input type="date">
// holds, and what the quick-add parser produces). Left empty, the task has
// no deadline; set, it also appears on the admin calendar for that day. See
// src/lib/date.ts for the day-key helpers. `startTime`/`endTime` are plain
// "HH:mm" 24h strings - see src/lib/time.ts.
export const taskSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200),
    notes: z.string().max(2000).optional().or(z.literal("")),
    dueDate: z.string().optional().or(z.literal("")),
    priority: z.enum(TASK_PRIORITIES),
    tags: z.array(z.string().min(1).max(30)).max(10),
    startTime: timeField,
    endTime: timeField,
    recurrence: z.enum(TASK_RECURRENCES),
  })
  .refine((data) => data.recurrence === "NONE" || Boolean(data.dueDate), {
    message: "A repeating task needs a due date to start from",
    path: ["dueDate"],
  })
  .refine((data) => Boolean(data.startTime) || !data.endTime, {
    message: "Add a start time first",
    path: ["startTime"],
  })
  .refine((data) => !data.startTime || !data.endTime || data.endTime > data.startTime, {
    message: "End time must be after the start time",
    path: ["endTime"],
  });

export type TaskFormValues = z.infer<typeof taskSchema>;

export const PROJECT_TYPES = ["Website", "Web app", "Mobile app", "Other"] as const;
export const BUDGET_RANGES = ["< $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000+", "Not sure yet"] as const;

// Submitted from the public /contact page by anonymous visitors - the only
// form on the site that isn't behind admin auth. `website` is a honeypot: a
// field hidden from real visitors via CSS that only a bot's form-filler
// would populate, checked (and silently rejected) in the server action.
export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Must be a valid email"),
  projectType: z.string().max(50).optional().or(z.literal("")),
  budget: z.string().max(50).optional().or(z.literal("")),
  message: z.string().min(1, "Tell me a bit about your project").max(5000),
  // Deliberately permissive (no max(0)/empty-only constraint): a filled-in
  // value needs to pass validation and reach the action's own check, which
  // silently drops it - if this field rejected it here instead, the bot
  // would see a validation error and learn something's checking it.
  website: z.string().max(200).optional().or(z.literal("")),
});

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;
