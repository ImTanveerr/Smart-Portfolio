import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploaded photos/covers/avatars live on Cloudinary; next/image refuses
    // to optimize remote images unless the host is explicitly allow-listed.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
