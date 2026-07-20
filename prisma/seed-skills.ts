import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const skills: { name: string; category: "FRONTEND" | "BACKEND" | "DEVOPS" | "OTHER" }[] = [
  { name: "JavaScript", category: "FRONTEND" },
  { name: "TypeScript", category: "FRONTEND" },
  { name: "React", category: "FRONTEND" },
  { name: "Next.js", category: "FRONTEND" },
  { name: "Express", category: "BACKEND" },
  { name: "Prisma", category: "BACKEND" },
  { name: "MongoDB", category: "BACKEND" },
  { name: "PostgreSQL", category: "BACKEND" },
  { name: "Docker", category: "DEVOPS" },
  { name: "Render", category: "DEVOPS" },
  { name: "Vercel", category: "DEVOPS" },
  { name: "Supabase", category: "DEVOPS" },
  { name: "Git", category: "OTHER" },
];

async function main() {
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category },
      create: skill,
    });
  }
  console.log(`Seeded ${skills.length} skills.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
