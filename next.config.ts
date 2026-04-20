import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent webpack from bundling Playwright and Chromium binaries
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium-min"],
};

export default nextConfig;
