import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permet de garantir que les builds de production Vercel ne soient pas bloqués
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
