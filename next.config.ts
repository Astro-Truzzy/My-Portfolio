import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: [
      "gsap",
      "@gsap/react",
      "three",
      "@react-three/drei",
      "@react-three/fiber",
    ],
  },
};

export default nextConfig;
