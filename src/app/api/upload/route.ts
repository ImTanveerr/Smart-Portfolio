import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB, comfortably under Vercel's request body limit

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

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Image must be under 4MB" }, { status: 400 });
  }

  const folder = formData.get("folder");
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const url = await uploadImageToCloudinary(
      buffer,
      typeof folder === "string" && folder ? `portfolio/${folder}` : "portfolio"
    );
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
