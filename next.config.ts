import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    optimizePackageImports: ["react-icons", "lucide-react", "three", "mermaid", "zod", "ai", "@ai-sdk/react", "framer-motion"],
  },
  productionBrowserSourceMaps: false,
  images: {
    deviceSizes: [360, 414, 512, 600, 640, 768, 1024, 1280],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
    qualities: [60, 70, 75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unavatar.io",
        port: "",
        pathname: "/twitter/**",
      },
    ],
  },
};

export default nextConfig;
