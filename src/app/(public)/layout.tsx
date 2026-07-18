import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-16">{children}</main>
      <Footer />
    </div>
  );
}
