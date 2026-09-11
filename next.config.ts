import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    cpus: 1,
  },
  async rewrites() {
    return [
      {
        source: "/api/storage/:path*",
        destination: "/storage/:path*",
      },
    ];
  },
};

export default nextConfig;
