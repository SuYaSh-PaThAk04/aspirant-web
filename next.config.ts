import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/p/:slug([^/]+)-:id([a-fA-F0-9]{24})",
        destination: "/post/:id",
        permanent: true,
      },
      {
        source: "/p/:id([a-fA-F0-9]{24})",
        destination: "/post/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
