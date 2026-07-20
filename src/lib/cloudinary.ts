import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadImageToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return uploadToCloudinary(buffer, folder, "image");
}

export function uploadRawFileToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return uploadToCloudinary(buffer, folder, "raw");
}

function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
