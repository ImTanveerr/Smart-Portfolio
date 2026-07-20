import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { uploadRawFileToCloudinary } from "@/lib/cloudinary";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Resume must be a PDF" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const url = await uploadRawFileToCloudinary(buffer, "portfolio/resume");
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Cloudinary resume upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
