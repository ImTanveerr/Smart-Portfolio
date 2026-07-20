import { Cloud, Code2, Server, Sparkles, type LucideIcon } from "lucide-react";
import { SKILL_CATEGORIES, SKILL_CATEGORY_LABELS, type SkillFormValues } from "@/lib/validations";
import { Badge } from "@/components/ui/badge";
import { StaggerGroup, StaggerItem } from "@/components/site/stagger";

type Skill = { id: string; name: string; category: SkillFormValues["category"] };

const CATEGORY_ICONS: Record<SkillFormValues["category"], LucideIcon> = {
  FRONTEND: Code2,
  BACKEND: Server,
  DEVOPS: Cloud,
  OTHER: Sparkles,
};

export function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {SKILL_CATEGORIES.map((category) => {
        const items = skills.filter((skill) => skill.category === category);
        if (items.length === 0) return null;
        const Icon = CATEGORY_ICONS[category];

        return (
          <StaggerItem
            key={category}
            className="space-y-3 rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-a)]/30 hover:shadow-md"
          >
            <h3 className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Icon className="size-4" strokeWidth={1.75} />
              {SKILL_CATEGORY_LABELS[category]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className="transition-transform hover:-translate-y-0.5 hover:bg-[color-mix(in_oklch,var(--secondary),var(--accent-a)_12%)]"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}
