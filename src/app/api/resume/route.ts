import { NextResponse } from "next/server";
import { getProfile } from "@/lib/profile";

// Proxies the resume through our own domain instead of linking straight to
// Cloudinary, so we control the Content-Disposition header ourselves
// (?download=1 forces a download; otherwise it opens inline in the browser).
// Cloudinary's own attachment flag isn't documented for raw file resources,
// so this is the reliable way to support both behaviors from one upload.
export async function GET(request: Request) {
  const profile = await getProfile();

  if (!profile?.resumeUrl) {
    return NextResponse.json({ error: "No resume uploaded" }, { status: 404 });
  }

  const upstream = await fetch(profile.resumeUrl);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 502 });
  }

  const download = new URL(request.url).searchParams.get("download") === "1";
  const filename = `${(profile.name || "resume").replace(/[^a-z0-9]+/gi, "-")}-resume.pdf`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
