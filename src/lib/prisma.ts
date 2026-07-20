import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 talks to Postgres through a driver adapter rather than its own
// bundled engine, so the pool needs to be created explicitly here.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Next.js dev mode hot-reloads modules on every file save, which would create
// a new PrismaClient (and a new connection pool) each time without this.
// Stashing the instance on `globalThis` lets it survive reloads; skipped in
// production where the module only loads once per server instance anyway.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
