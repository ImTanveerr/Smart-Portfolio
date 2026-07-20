"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  SKILL_CATEGORIES,
  SKILL_CATEGORY_LABELS,
  skillSchema,
  type SkillFormValues,
} from "@/lib/validations";
import { createSkill, deleteSkill, updateSkillCategory } from "@/lib/actions/skills";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

type Skill = { id: string; name: string; category: SkillFormValues["category"] };

export function SkillManager({ skills }: { skills: Skill[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillFormValues["category"]>("FRONTEND");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = skillSchema.safeParse({ name, category });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    startTransition(async () => {
      const result = await createSkill(parsed.data);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setName("");
      router.refresh();
    });
  }

  function handleCategoryChange(id: string, newCategory: SkillFormValues["category"]) {
    startTransition(async () => {
      await updateSkillCategory(id, newCategory);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSkill(id);
      router.refresh();
    });
  }

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={handleAdd} className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <label htmlFor="skill-name" className="text-sm font-medium">
            Skill name
          </label>
          <Input
            id="skill-name"
            placeholder="e.g. Next.js"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as SkillFormValues["category"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {SKILL_CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isPending || !name.trim()}>
          Add
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-6">
        {SKILL_CATEGORIES.map((cat) => {
          const items = skills.filter((skill) => skill.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                {SKILL_CATEGORY_LABELS[cat]}
              </h2>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-1 rounded-full border border-border py-1 pr-1 pl-3 text-sm"
                  >
                    <span>{skill.name}</span>
                    <Select
                      value={skill.category}
                      onValueChange={(value) =>
                        handleCategoryChange(skill.id, value as SkillFormValues["category"])
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        className="h-6 border-none bg-transparent px-1 text-muted-foreground shadow-none"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {SKILL_CATEGORY_LABELS[c]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-full"
                      aria-label={`Remove ${skill.name}`}
                      onClick={() => handleDelete(skill.id)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {skills.length === 0 && (
          <p className="text-muted-foreground">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}
