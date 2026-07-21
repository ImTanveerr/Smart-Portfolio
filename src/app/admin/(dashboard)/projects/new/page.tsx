import { ProjectForm } from "@/components/admin/project-form";
import { AdminPageHeader } from "@/components/admin/page-header";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="New project" />
      <ProjectForm />
    </div>
  );
}
