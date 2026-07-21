import { prisma } from "@/lib/prisma";
import { SkillManager } from "@/components/admin/skill-manager";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Skills"
        description="Shown in the Skills section on the home page."
      />
      <SkillManager skills={skills} />
    </div>
  );
}
