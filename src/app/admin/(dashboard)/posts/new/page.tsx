import { PostForm } from "@/components/admin/post-form";
import { AdminPageHeader } from "@/components/admin/page-header";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="New post" />
      <PostForm />
    </div>
  );
}
