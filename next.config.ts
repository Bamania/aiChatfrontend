import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
