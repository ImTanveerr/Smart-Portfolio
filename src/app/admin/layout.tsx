import type { Metadata } from "next";
import { AmbientBackground } from "@/components/site/ambient-background";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// Shared by every admin route, including /admin/login (which sits outside
// the (dashboard) layout) - one place to apply the same background the
// public site uses, instead of each area sourcing its own.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientBackground />
      {children}
    </>
  );
}
