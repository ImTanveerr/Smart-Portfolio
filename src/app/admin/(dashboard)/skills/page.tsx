import { prisma } from "@/lib/prisma";
import { SkillManager } from "@/components/admin/skill-manager";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <p className="text-muted-foreground">
          Shown in the Skills section on the home page.
        </p>
      </div>
      <SkillManager skills={skills} />
    </div>
  );
}
