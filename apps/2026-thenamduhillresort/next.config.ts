import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  /** Package workspace xuất TypeScript nguồn, Next phải tự transpile. */
  transpilePackages: ['@repo/core'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Ảnh của chính khách hàng, dùng cho bản POC dựng cho họ xem.
      { protocol: 'https', hostname: 'thenamduhill.com', pathname: '/**' },
    ],
  },
}

export default nextConfig
