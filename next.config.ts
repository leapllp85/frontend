import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  env: {
    BASE_URL: 'http://localhost:8000',
  },
};

export default nextConfig;
