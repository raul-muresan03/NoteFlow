import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["files.edgestore.dev"]
  }
};

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
