# Smart Portfolio — Project Plan

A personal portfolio site for a software engineer, featuring a projects showcase, a tech blog,
and an admin-only panel to manage both — built with Next.js (App Router) + TypeScript.

> Edit this file freely. Once you're happy with it, tell me to proceed and I'll execute it phase by phase.

> **Working style:** built and reviewed one phase at a time — each phase is implemented, then paused for you to check before the next one starts.

> **Next.js 16 note:** the scaffolded app uses Next.js 16, which has real breaking changes vs. older tutorials/docs: `middleware.ts` is renamed to `proxy.ts` (exported function is `proxy`, not `middleware`), `params`/`searchParams` are async everywhere (`await params`), and Turbopack is the default bundler. This plan already accounts for those.

---

## 1. Goals

- Public-facing site to showcase software projects (with overview, tech stack, links).
- A blog to write about tech topics.
- A private admin area (login-gated) to create/edit/delete/publish both projects and blog posts —
  no code changes or redeploys needed to publish content.
- Clean, fast, SEO-friendly, responsive, works well as a professional portfolio to share with employers/recruiters.

---

## 2. Tech Stack

| Concern            | Choice                                             | Why |
|---------------------|-----------------------------------------------------|-----|
| Framework           | Next.js 14+ (App Router), TypeScript                | Requested; SSR/SSG for SEO, Server Actions for CRUD without hand-rolled API layer |
| Database            | PostgreSQL, hosted on Supabase                       | Relational data (posts/projects/tags) fits SQL well; free hosted tier; pairs cleanly with Vercel |
| ORM                 | Prisma                                               | End-to-end type safety with TypeScript, easy migrations |
| Auth                | NextAuth v4 (`next-auth`), Credentials provider      | v5/Auth.js is still beta on npm as of build time; v4 is stable, mature, and fully supports the App Router |
| Styling             | Tailwind CSS + shadcn/ui                             | Fast, accessible components for admin CRUD screens (tables, forms, dialogs) and public site |
| Content editor      | `@uiw/react-md-editor` (Markdown + live preview)     | Content stored as Markdown text; simple, great for code snippets in blog posts |
| Content rendering    | `react-markdown` + `remark-gfm` + syntax highlighting | Render stored Markdown on the public site |
| Forms/validation    | `react-hook-form` + `zod`                            | Shared validation schema between client forms and server actions |
| Deployment          | Vercel (app) + Supabase (DB)                         | Standard, zero-config Next.js hosting; free tiers for a personal site |

---

## 3. Data Model (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  name      String?
  createdAt DateTime @default(now())
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String?
  content     String    // Markdown (Postgres String already maps to `text`, no @db.Text needed)
  coverImage  String?
  published   Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  tags        Tag[]     @relation("PostTags")
}

model Project {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  summary     String
  description String    // Markdown
  coverImage  String?
  repoUrl     String?
  liveUrl     String?
  featured    Boolean   @default(false)
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  techStack   Tag[]     @relation("ProjectTech")
}

model Tag {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  posts    Post[]    @relation("PostTags")
  projects Project[] @relation("ProjectTech")
}
```

`Tag` is shared between posts (topics) and projects (tech stack) to keep the model simple.

---

## 4. Routes / Pages

**Public**
- `/` — home: hero/intro, featured projects, latest posts
- `/projects` — grid of all projects, filterable by tag
- `/projects/[slug]` — project detail (overview, tech stack, links, screenshots)
- `/blog` — list of published posts, filterable by tag, paginated
- `/blog/[slug]` — post detail (rendered Markdown)
- `/about` — bio/skills/contact links

**Admin** (all guarded except `/admin/login`)
- `/admin/login` — credentials login form
- `/admin` — dashboard (counts, quick links, recently edited items)
- `/admin/posts` — table of all posts (published/draft), search
- `/admin/posts/new`, `/admin/posts/[id]/edit`
- `/admin/projects` — table of all projects
- `/admin/projects/new`, `/admin/projects/[id]/edit`
- `/admin/tags` — simple list/create/delete for tags

---

## 5. Auth Flow

- Single admin account, seeded via a `prisma/seed.ts` script from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars (password hashed with bcrypt before storing).
- NextAuth Credentials provider (`src/lib/auth.ts`) checks email/password against the `User` table via Prisma + bcrypt compare.
- JWT session strategy (no DB session table needed — simpler for serverless deploys). `session.user.id` / `token.id` typed via `src/types/next-auth.d.ts` module augmentation.
- `src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`) wraps `next-auth/middleware`'s `withAuth`, matching `/admin` and `/admin/((?!login).*)` — i.e. everything under `/admin` except `/admin/login`.
- `/admin/login` sits directly under `src/app/admin/`, while the guarded dashboard lives in a `src/app/admin/(dashboard)/` route group so its `layout.tsx` can do a server-side `getServerSession` check (defense-in-depth per Next.js 16's guidance that Proxy alone isn't enough for Server Actions) without redirect-looping against the login page itself.

---

## 6. Folder Structure

```
src/
  app/
    (public)/
      page.tsx                  # home
      about/page.tsx
      projects/
        page.tsx
        [slug]/page.tsx
      blog/
        page.tsx
        [slug]/page.tsx
    admin/
      login/page.tsx              # public — outside the (dashboard) guard group
      (dashboard)/
        layout.tsx                 # guarded shell: getServerSession + redirect, sidebar/nav
        sign-out-button.tsx
        page.tsx                   # dashboard
        posts/
          page.tsx
          new/page.tsx
          [id]/edit/page.tsx
        projects/
          page.tsx
          new/page.tsx
          [id]/edit/page.tsx
        tags/page.tsx
    api/
      auth/[...nextauth]/route.ts
    layout.tsx                   # root layout
    globals.css
    sitemap.ts
    robots.ts
  components/
    ui/                          # shadcn components
    site/                        # navbar, footer, project-card, post-card
    admin/                       # data-table, post-form, project-form, markdown-editor
  lib/
    prisma.ts                    # Prisma client singleton (driver adapter, see section 10)
    auth.ts                      # NextAuth config
    actions/
      posts.ts                   # server actions: create/update/delete/publish
      projects.ts
      tags.ts
    validations.ts               # zod schemas (shared client/server)
    utils.ts
  types/
    next-auth.d.ts               # module augmentation for session.user.id / token.id
  proxy.ts                       # Next.js 16 name for what used to be middleware.ts (lives beside src/app)
prisma/
  schema.prisma
  seed.ts
```

---

## 7. CRUD Approach

- Use **Next.js Server Actions** (not a separate REST API) for all admin mutations — colocated with forms, fully typed, no extra API boilerplate.
- Each form (post/project) uses `react-hook-form` + a shared `zod` schema for client validation, and the server action re-validates the same schema before writing to the DB (never trust client input).
- Public pages fetch published content directly via Prisma in Server Components (no client-side fetching needed for content).

---

## 8. Images

- **Phase 1 (MVP):** cover images are a plain URL field in the form (paste a hosted image link) — zero extra infra.
- **Phase 2 (optional, later):** add real upload support via Supabase Storage if pasting URLs proves annoying.
- Since cover image URLs can point to any external host, render them with a plain `<img>` tag rather than `next/image` (which requires each domain to be allow-listed in `images.remotePatterns` ahead of time) — avoids needing to update config every time a new image host is used.

---

## 9. SEO & Polish

- `generateMetadata` per page (title/description/OG tags), dynamic OG data for blog posts and projects.
- `sitemap.ts` / `robots.ts` for crawlability.
- Tag-based filtering on `/blog` and `/projects`.
- Responsive layout, dark mode (shadcn theme toggle).

---

## 10. Environment Variables

```
DATABASE_URL=          # Supabase transaction-mode pooler (port 6543) — app runtime, via driver adapter
DIRECT_URL=            # Supabase session-mode pooler (port 5432) — Prisma CLI migrations only
NEXTAUTH_SECRET=       # random secret for session signing
NEXTAUTH_URL=          # http://localhost:3000 in dev
ADMIN_EMAIL=           # used only by the seed script
ADMIN_PASSWORD=        # used only by the seed script (hashed before storing)
```

**Getting these from Supabase:** dashboard → "Connect" → ORM tab → Prisma. Use the **pooler** URLs, not
the direct connection — Supabase's direct connection is IPv6-only and unreachable from many networks/ISPs.

**Prisma 7 note:** the version installed (7.8.0) is a newer major version with real API changes vs. older
Prisma docs/tutorials:
- The new default client generator (`provider = "prisma-client"`) outputs real `.ts` source to
  `src/generated/prisma` (gitignored, regenerated via `prisma generate`) instead of a binary in `node_modules`.
- Connection URLs are no longer declared in `schema.prisma`. `prisma.config.ts` holds the URL the **CLI**
  uses for migrate/generate (set to `DIRECT_URL`, the session pooler). The **app** connects independently
  at runtime via an explicit driver adapter (`@prisma/adapter-pg` + `pg`) constructed with `DATABASE_URL`
  (the transaction pooler) — see `src/lib/prisma.ts`.
- `directUrl` as a `schema.prisma` datasource field was removed entirely in v7; the split above is how the
  same two-URL Supabase setup is achieved instead.

---

## 11. Build Phases

1. **Scaffold** — `create-next-app` (TS, Tailwind, App Router, ESLint), git init, base folder structure.
2. **Database** — Prisma init, schema above, migration, seed script for the admin user.
3. **Auth** — NextAuth credentials config, login page, middleware guard, admin layout shell.
4. **Admin: Projects CRUD** — list table, create/edit forms with Markdown editor, delete, tag assignment.
5. **Admin: Blog CRUD** — list table, create/edit forms, publish/draft toggle, tag assignment.
6. **Public site** — home, projects list/detail, blog list/detail, about page.
7. **Polish** — SEO metadata, sitemap/robots, tag filtering, dark mode, responsive pass.
8. **Deploy** — push to GitHub, connect to Vercel, set env vars, run production migration.

---

## 12. Open Items / Things to Confirm Later

- Real name/branding, bio content, and social links for the `/about` page and footer.
- Whether you want a contact form or just links (email/GitHub/LinkedIn).
- Domain name for deployment (optional).
- Whether Phase 2 image upload is worth adding, or URL-paste is fine long-term.
