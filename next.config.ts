import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/.playwright-mcp/**", "**/.next_stale_*/**"],
    };

    return config;
  },
};

export default nextConfig;
