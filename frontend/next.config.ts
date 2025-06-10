import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://172.29.16.1:3000', // <-- Add this line
    'http://172.29.16.1'
  ],
};

export default nextConfig;
