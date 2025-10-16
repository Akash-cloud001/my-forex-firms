import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'my-forex-firms.b-cdn.net',
      },
    ],
  },
};

export default nextConfig;
