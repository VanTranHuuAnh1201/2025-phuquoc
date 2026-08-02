import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // apps/2025-phogroup la vung dong bang (luat R10): giu nguyen trang, khong sua
    // source. Code cu co san loi lint (any, the <a> noi bo) tu truoc khi
    // chuyen vao monorepo, nen khong cho lint chan build o day.
    // Muon don dep thi don co y trong mot thay doi rieng.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
};

export default nextConfig;
