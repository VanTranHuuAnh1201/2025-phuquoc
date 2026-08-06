import type { NextConfig } from 'next'

/**
 * Thư mục build — mặc định `.next`, đổi được qua `NEXT_DIST_DIR`.
 * Giải thích đầy đủ ở `apps/2026-thenamduhill/next.config.ts`.
 *
 * Ngắn gọn: `next build` chạy khi dev server đang mở sẽ ghi đè chunk mà server
 * đang phục vụ, làm trang lỗi module và để lại tiến trình mồ côi giữ cổng.
 * `pnpm build:safe` đặt biến này để hai lệnh đi hai lối.
 */
const distDir = process.env.NEXT_DIST_DIR || '.next'

const nextConfig: NextConfig = {
    distDir,
}

export default nextConfig
