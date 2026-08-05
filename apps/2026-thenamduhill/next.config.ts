import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    /**
     * Các package trong workspace xuất TypeScript nguồn (không build sẵn),
     * nên Next phải tự transpile. Thêm theme mới thì thêm vào đây.
     */
    transpilePackages: [
        '@repo/utils',
        '@repo/core',
        '@repo/ui',
        '@repo/ui-layout',
        '@repo/domain-hotel',
        '@repo/theme-h1',
        '@repo/theme-h2',
        '@repo/theme-h3',
    ],

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
            // Ảnh của chính khách hàng, dùng cho bản POC dựng cho họ xem.
            { protocol: 'https', hostname: 'thenamduhill.com', pathname: '/**' },
        ],
    },
}

export default nextConfig
