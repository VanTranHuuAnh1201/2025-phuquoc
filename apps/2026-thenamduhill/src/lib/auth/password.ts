import bcrypt from 'bcryptjs'

/**
 * Băm và so mật khẩu nhân viên (ticket 000-03 §6.1).
 *
 * ⚠️ CHỈ NODE RUNTIME. Cấm import file này trong `middleware.ts` hoặc bất kỳ
 * file nào khai `export const runtime = 'edge'` (luật BE11).
 *
 * Vì sao `bcryptjs` chứ không `bcrypt`/`argon2`: hai cái kia là native addon
 * (node-gyp), phải biên dịch lúc cài — hỏng trên máy dev Windows và hay vỡ trên
 * Vercel build image khi đổi phiên bản Node. `bcryptjs` là JS thuần, cùng thuật
 * toán, cùng format hash (`$2a$`/`$2b$`) nên TƯƠNG THÍCH NGƯỢC: v1.1 muốn đổi
 * sang argon2 chỉ cần thêm nhánh đọc theo tiền tố hash, không phải reset mật
 * khẩu của ai. BE10 cho phép "bcrypt cost ≥ 12 hoặc argon2".
 */

/** BE10: cost ≥ 12. Tăng cost là phải cân lại thời gian đăng nhập trên Vercel. */
export const BCRYPT_COST = 12

/**
 * Hash giả dùng cho chống dò tài khoản (000-03 §6.5).
 * Là hash bcrypt hợp lệ của một chuỗi ngẫu nhiên không ai biết, cost 12 — nên
 * `bcrypt.compare` với nó tốn đúng thời gian như so với hash thật.
 */
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.9jFBqK1Kb6iCcTQ0nTQiHkBz8SbGZDm'

/** Băm mật khẩu mới. Chỉ dùng ở seed và màn đổi mật khẩu. */
export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, BCRYPT_COST)
}

/**
 * So mật khẩu với hash đã lưu.
 *
 * `hash` nhận `null` để gọi được cả khi tài khoản không tồn tại: lúc đó vẫn
 * chạy một lần compare với hash giả rồi trả `false`. Không làm vậy thì thời
 * gian phản hồi chênh ~200ms và dò được tài khoản nào có thật (kênh phụ).
 */
export async function verifyPassword(plain: string, hash: string | null): Promise<boolean> {
    if (!hash) {
        await bcrypt.compare(plain, DUMMY_HASH)
        return false
    }
    return bcrypt.compare(plain, hash)
}
