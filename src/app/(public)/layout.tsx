import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { AmbientBackground } from "@/components/site/ambient-background";
import { getProfile } from "@/lib/profile";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      <AmbientBackground />
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-16">{children}</main>
      <Footer profile={profile} />
    </div>
  );
}
