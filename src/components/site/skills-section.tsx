import { SKILL_CATEGORIES, SKILL_CATEGORY_LABELS, type SkillFormValues } from "@/lib/validations";
import { Badge } from "@/components/ui/badge";

type Skill = { id: string; name: string; category: SkillFormValues["category"] };

export function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {SKILL_CATEGORIES.map((category) => {
        const items = skills.filter((skill) => skill.category === category);
        if (items.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {SKILL_CATEGORY_LABELS[category]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <Badge key={skill.id} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
