import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * Neo gốc workspace về thư mục monorepo.
   *
   * Không có dòng này, Next suy ra gốc sai và cho webpack quét cả ổ `D:\`.
   * Watcher đụng `pagefile.sys` / `DumpStack.log.tmp` (Windows khoá cứng) →
   * `Watchpack Error EINVAL` → build bị vô hiệu liên tục, `.next` bị xoá đi
   * dựng lại, URL CSS mang `?v=` mới mỗi request nên file cũ trả 404 và
   * trang mất sạch style.
   */
  outputFileTracingRoot: path.join(__dirname, '../../'),

  /**
   * Package workspace xuất TypeScript nguồn, Next phải tự transpile.
   * `@repo/ui` và `@repo/theme-h7` được import trong `app/layout.tsx`
   * (tokens.css) nên bắt buộc phải có mặt ở đây.
   */
  transpilePackages: ['@repo/core', '@repo/ui', '@repo/theme-h7'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Ảnh của chính khách hàng, dùng cho bản POC dựng cho họ xem.
      { protocol: 'https', hostname: 'thenamduhill.com', pathname: '/**' },
    ],
  },

  /**
   * Giữ watcher NẰM TRONG thư mục dự án.
   *
   * Trên Windows, watcher của webpack bò ra tới gốc ổ `D:\` và lstat trúng
   * `pagefile.sys` / `DumpStack.log.tmp` — file hệ thống bị khoá cứng, trả
   * `EINVAL`. Watcher chết → webpack coi như có thay đổi → rebuild vô tận,
   * `.next` bị dựng lại liên tục nên URL CSS đổi `?v=` mỗi lần và file cũ
   * trả 404 → mất sạch style.
   */
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules/**', '**/.next/**', '**/.git/**', 'D:/*'],
      }
    }
    return config
  },
}

export default nextConfig
