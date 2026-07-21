import { getProfile } from "@/lib/profile";
import { ProfileForm } from "@/components/admin/profile-form";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Profile"
        description="Shown in the hero section and the About section on the home page."
      />
      <ProfileForm
        defaultValues={{
          name: profile?.name ?? "",
          title: profile?.title ?? "",
          description: profile?.description ?? "",
          aboutContent: profile?.aboutContent ?? "",
          email: profile?.email ?? "",
          phone: profile?.phone ?? "",
          avatarImage: profile?.avatarImage ?? "",
          avatarImage2: profile?.avatarImage2 ?? "",
          githubUrl: profile?.githubUrl ?? "",
          linkedinUrl: profile?.linkedinUrl ?? "",
          twitterUrl: profile?.twitterUrl ?? "",
          websiteUrl: profile?.websiteUrl ?? "",
          resumeUrl: profile?.resumeUrl ?? "",
          projectsCount: profile?.projectsCount ?? 3,
          postsCount: profile?.postsCount ?? 3,
        }}
      />
    </div>
  );
}
