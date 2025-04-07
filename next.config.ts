import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // ⬅ DISABLE SW di mode dev
})

module.exports = withPWA({
  reactStrictMode: true,
})

export default nextConfig;
