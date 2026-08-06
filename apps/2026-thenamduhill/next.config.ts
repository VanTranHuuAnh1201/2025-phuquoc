import type { NextConfig } from 'next'

/**
 * THƯ MỤC BUILD — MẶC ĐỊNH `.next`, ĐỔI ĐƯỢC QUA BIẾN MÔI TRƯỜNG.
 *
 * VÌ SAO CẦN ĐỔI ĐƯỢC: `next dev` và `next build` cùng ghi vào `.next/`. Chạy
 * `pnpm build` trong lúc dev server đang mở thì build ghi đè chunk mà server
 * đang phục vụ — trang đổ "Module was instantiated because it was required
 * from…", và tiến trình dev thường chết nửa vời, để lại một node mồ côi vẫn
 * giữ cổng 3000. Lần sau `pnpm dev` báo EADDRINUSE.
 *
 * `pnpm build:safe` ở gốc đặt `NEXT_DIST_DIR=.next-build` để build đi lối
 * riêng, dev server không hề hấn.
 *
 * VÌ SAO KHÔNG TỰ ĐỔI THEO `NODE_ENV`: `vercel.json` khai
 * `outputDirectory: ".next"` và `turbo.json` khai `outputs: [".next/**"]`.
 * Đổi ngầm khi `NODE_ENV=production` là deploy hỏng và cache turbo trượt —
 * mà chỉ phát hiện được sau khi đã đẩy lên. Mặc định phải giữ `.next`.
 */
const distDir = process.env.NEXT_DIST_DIR || '.next'

const nextConfig: NextConfig = {
    distDir,

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
        '@repo/theme-h4',
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
