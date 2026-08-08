import { config as loadEnv } from 'dotenv'
import path from 'node:path'

/**
 * Chạy MỘT LẦN trước toàn bộ suite (không phải mỗi file như `setup.ts`).
 *
 * Việc duy nhất: quét rác của lần chạy trước bị ngắt giữa chừng. Đây là điều
 * kiện để AC-12 ("chạy 3 lần liên tiếp đều xanh") đứng vững kể cả khi lần thứ
 * nhất bị Ctrl-C giữa chừng — teardown lúc đó không kịp chạy.
 */
export default async function globalSetup(): Promise<void> {
    loadEnv({ path: path.resolve(__dirname, '../.env.local'), quiet: true })
    const { sweepOrphans } = await import('./helpers/seed')
    const removed = await sweepOrphans()
    if (removed > 0) {
        console.warn(`[test] Đã dọn ${removed} bản ghi rác của lần chạy trước.`)
    }
}
