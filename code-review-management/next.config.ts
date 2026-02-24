import type { NextConfig } from "next";

/**
 * Docs:
 * 1. https://github.com/vercel/next.js/discussions/18311
 * - Referenced to load images from external URLs.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
