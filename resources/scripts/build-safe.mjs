#!/usr/bin/env node
/**
 * Build mà KHÔNG giết dev server đang chạy.
 *
 * VÌ SAO CẦN: `next dev` và `next build` cùng ghi vào `.next/`. Build trong
 * lúc dev server đang mở sẽ ghi đè chunk mà server đang phục vụ — trang đổ
 * "Module was instantiated because it was required from…", và tiến trình dev
 * thường chết nửa vời, để lại node mồ côi giữ cổng 3000. Lần sau `pnpm dev`
 * báo `EADDRINUSE`.
 *
 * Cách chữa: đặt `NEXT_DIST_DIR=.next-build` để build đi lối riêng. Mỗi
 * `next.config.ts` đọc biến này (mặc định vẫn `.next`).
 *
 * VÌ SAO KHÔNG ĐỔI THẲNG TRONG `next.config.ts` THEO `NODE_ENV`: `vercel.json`
 * khai `outputDirectory: ".next"` và `turbo.json` khai `outputs: [".next/**"]`.
 * Đổi ngầm là deploy hỏng và cache turbo trượt — mà chỉ phát hiện được sau khi
 * đã đẩy lên. Nên mặc định giữ `.next`, chỉ lệnh này mới đổi.
 *
 * VÌ SAO `--force`: `outputs` trong `turbo.json` trỏ `.next/**`, không khớp
 * `.next-build/**`. Turbo sẽ tưởng là cache hit rồi bỏ qua build thật.
 *
 * Dùng:  pnpm build:safe                 build hết
 *        pnpm build:safe --filter=@repo/2026-thenamduhill
 */

import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)

const result = spawnSync('pnpm', ['turbo', 'build', '--force', ...args], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NEXT_DIST_DIR: '.next-build' },
})

process.exit(result.status ?? 1)
