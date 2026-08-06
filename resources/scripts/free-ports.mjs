#!/usr/bin/env node
/**
 * Giải phóng các cổng dev của repo NÀY.
 *
 * VÌ SAO CẦN: `next dev` bị ngắt nửa chừng (build ghi đè `.next`, đóng
 * terminal, Ctrl-C không kịp lan xuống tiến trình con) thường để lại một node
 * mồ côi vẫn giữ cổng. Lần chạy sau báo `EADDRINUSE` và phải đi tìm PID bằng
 * tay — đã xảy ra nhiều lần.
 *
 * VÌ SAO KHÔNG GIẾT MỌI NODE GIỮ CỔNG ĐÓ: máy này còn worktree khác của cùng
 * dự án (`D:\2026\wt-h4-amanoi`) chạy dev ở cổng 3100. Một lệnh
 * `taskkill /IM node.exe` là giết luôn cả thứ mình không sở hữu. Script đọc
 * dòng lệnh của từng tiến trình và CHỈ giết cái có đường dẫn nằm trong repo
 * này — worktree khác, editor, script nền đều an toàn.
 *
 * Dùng:
 *   pnpm free-ports          giải phóng 3000-3003
 *   pnpm free-ports 3000     chỉ một cổng
 */

import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const DEFAULT_PORTS = [3000, 3001, 3002, 3003]

const run = (cmd, args) => {
    try {
        return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    } catch {
        // netstat/wmic trả mã khác 0 khi không có kết quả — không phải lỗi thật.
        return ''
    }
}

/** PID đang LISTEN trên một cổng. Windows: `netstat -ano`. */
function listenersOn(port) {
    const out = run('netstat', ['-ano'])
    const pids = new Set()
    for (const line of out.split(/\r?\n/)) {
        if (!line.includes('LISTENING')) continue
        // Cột địa chỉ cục bộ phải kết thúc đúng bằng `:<port>`, không phải
        // `:30000` hay địa chỉ từ xa trùng số.
        if (!new RegExp(`(^|\\s)\\S*:${port}\\s`).test(line)) continue
        const pid = line.trim().split(/\s+/).pop()
        if (pid && pid !== '0') pids.add(pid)
    }
    return [...pids]
}

/** Dòng lệnh đầy đủ của một PID, để biết nó thuộc repo nào. */
function commandLineOf(pid) {
    const out = run('wmic', ['process', 'where', `ProcessId=${pid}`, 'get', 'CommandLine', '/value'])
    const m = out.match(/CommandLine=(.*)/)
    return m ? m[1].trim() : ''
}

/** Chuẩn hoá để so đường dẫn: Windows không phân biệt hoa thường và dùng `\`. */
const normalize = (s) => s.toLowerCase().replace(/\//g, '\\')

const ports = process.argv.slice(2).length
    ? process.argv.slice(2).map(Number).filter(Boolean)
    : DEFAULT_PORTS

const repoNeedle = normalize(REPO_ROOT)
let killed = 0
let skipped = 0

for (const port of ports) {
    for (const pid of listenersOn(port)) {
        const cmd = commandLineOf(pid)

        // Không đọc được dòng lệnh thì KHÔNG giết: thà báo EADDRINUSE còn hơn
        // tắt nhầm thứ của người khác.
        if (!cmd) {
            console.log(`  :${port}  pid ${pid} — không đọc được dòng lệnh, bỏ qua`)
            skipped++
            continue
        }

        if (!normalize(cmd).includes(repoNeedle)) {
            console.log(`  :${port}  pid ${pid} — của repo khác, giữ nguyên`)
            skipped++
            continue
        }

        // `/T` giết cả cây con: turbo → npx → next → worker. Thiếu nó thì
        // tiến trình cháu vẫn ôm cổng.
        run('taskkill', ['/PID', pid, '/T', '/F'])
        console.log(`  :${port}  pid ${pid} — đã tắt`)
        killed++
    }
}

if (!killed && !skipped) console.log(`Cổng ${ports.join(', ')} đều rảnh.`)
else console.log(`\nĐã tắt ${killed}, giữ nguyên ${skipped}.`)
