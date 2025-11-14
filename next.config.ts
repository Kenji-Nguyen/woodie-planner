import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Required for react-konva to work properly in Next.js (webpack mode)
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    return config;
  },
  // Empty turbopack config to allow Turbopack to run (Next.js 16+ default)
  // react-konva works fine with Turbopack without special configuration
  turbopack: {},
};

export default nextConfig;
