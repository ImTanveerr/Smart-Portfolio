import { getProfile } from "@/lib/profile";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">
          Shown in the hero section and the About section on the home page.
        </p>
      </div>
      <ProfileForm
        defaultValues={{
          name: profile?.name ?? "",
          title: profile?.title ?? "",
          description: profile?.description ?? "",
          aboutContent: profile?.aboutContent ?? "",
          email: profile?.email ?? "",
          phone: profile?.phone ?? "",
          avatarImage: profile?.avatarImage ?? "",
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
