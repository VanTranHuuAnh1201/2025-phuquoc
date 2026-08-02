import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    /**
     * Các package trong workspace xuất TypeScript nguồn (không build sẵn),
     * nên Next phải tự transpile. Thêm theme mới thì thêm vào đây.
     */
    transpilePackages: ['@repo/core', '@repo/ui', '@repo/theme-h1'],

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
        ],
    },
}

export default nextConfig
