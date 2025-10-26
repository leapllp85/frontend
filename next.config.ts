import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  env: {
    BASE_URL: 'http://35.200.219.72:8000',
  },
  // Disable React StrictMode to prevent double API calls in development
  reactStrictMode: false,
};

export default nextConfig;
