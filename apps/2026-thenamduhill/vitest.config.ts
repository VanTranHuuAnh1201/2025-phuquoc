import { defineConfig } from 'vitest/config'
import path from 'node:path'

/**
 * Tầng 2 — API integration test (ticket 400-01).
 *
 * `environment: 'node'` chứ không `jsdom`: tầng này import thẳng Route Handler
 * và gọi vào Supabase thật. Không có component nào được render, nên `jsdom` chỉ
 * là chi phí khởi động thừa (TEST-STRATEGY §2).
 *
 * ⚠️ `fileParallelism: false` — CHỦ Ý, không phải thiếu tối ưu.
 * Test chạy trên **DB dev dùng chung** (nợ `M24b`: không có Docker, cũng không
 * có branching). Hai file test chạy song song sẽ cùng ghi vào `inventory` của
 * cùng một hạng phòng test ⇒ `chk_not_oversold` nổ ngẫu nhiên và không ai biết
 * là bug thật hay bug của chính bộ test. Chạy tuần tự đổi lấy sự tin cậy.
 */
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'node',
        globals: false,
        include: ['tests/**/*.test.ts'],
        setupFiles: ['./tests/setup.ts'],
        globalSetup: ['./tests/global-setup.ts'],
        fileParallelism: false,
        // Route Handler gọi thật vào Supabase cloud (ap-south-1) — một vòng
        // request mất 300-800ms. Mặc định 5s của Vitest làm test đỏ vì mạng,
        // không phải vì code sai.
        testTimeout: 40_000,
        hookTimeout: 120_000,
        reporters: ['default'],
    },
})
