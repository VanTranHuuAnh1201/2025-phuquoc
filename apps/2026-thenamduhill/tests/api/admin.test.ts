import { afterAll, describe, expect, it } from 'vitest'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { GET as accountsRoute } from '@/app/api/admin/accounts/route'
import { POST as uploadRoute } from '@/app/api/admin/upload/route'
import { call, expectFail, expectOk } from '../helpers/request'
import { loginAs } from '../helpers/auth'
import { seedAccount, teardown } from '../helpers/seed'
import { sessionForAccount } from '../helpers/auth'

/**
 * 2 route: `GET /api/admin/accounts` · `POST /api/admin/upload`.
 *
 * TEST-STRATEGY §6 nhóm "Upload ảnh · outbox": 4 case, 2 negative
 * (file SVG bị loại, vượt `MAX_BYTES`). Outbox chưa tồn tại (ticket `420-01`).
 */

/**
 * Ảnh do test tải lên — `persist()` ghi thẳng vào `public/uploads/`, một thư
 * mục ĐANG ĐƯỢC COMMIT (chứa hero, ảnh phòng thật). Không dọn thì mỗi lần chạy
 * để lại một file rác trong cây mã nguồn, và `git status` bẩn dần (luật W8.3
 * điều 5: không commit sản phẩm phụ của test).
 */
const uploadedFiles: string[] = []

afterAll(async () => {
    const dir = path.join(process.cwd(), 'public', 'uploads')
    for (const name of uploadedFiles) {
        await rm(path.join(dir, name), { force: true })
    }
    await teardown()
})

interface AccountDto {
    id: string
    email: string
    role: string
    status: string
}

/** Ảnh PNG thật, nhỏ — `sharp` phải decode được, không dùng byte giả. */
async function realPng(width = 32, height = 32): Promise<Buffer> {
    return sharp({
        create: { width, height, channels: 3, background: { r: 10, g: 97, b: 104 } },
    })
        .png()
        .toBuffer()
}

function formDataWith(buffer: Buffer, name: string, type: string): FormData {
    const form = new FormData()
    form.append('file', new File([new Uint8Array(buffer)], name, { type }), name)
    return form
}

describe('GET /api/admin/accounts', () => {
    it('[happy] owner đọc được danh sách tài khoản', async () => {
        const res = await call<AccountDto[]>(accountsRoute, '/api/admin/accounts', {
            session: await loginAs('owner'),
        })
        const list = expectOk(res)
        expect(Array.isArray(list)).toBe(true)
        expect(list.length).toBeGreaterThan(0)
        expect(list[0]).toHaveProperty('role')
        expect(list[0]).toHaveProperty('status')
    })

    /*
     * ⚠️ Hai case dưới TRƯỚC ĐÂY khoá hiện trạng của lỗ `900-02`: route khai
     * `export async function GET()` trần + `createAdminClient()` (service role,
     * bỏ qua RLS) nên gọi KHÔNG cookie vẫn trả đủ 46 tài khoản kèm email, SĐT,
     * vai trò của cả nhân viên lẫn khách.
     *
     * `900-02` đã vá bằng `withAuthGuard(..., 'account.manage')`. Assertion đã
     * ĐẢO sang kỳ vọng đúng (AC-5). Đây là test hồi quy của một lỗ bảo mật đã
     * từng mở — sửa nó thành `expectOk` là mở lại lỗ, không phải sửa test.
     */
    it('[negative] KHÔNG token → 401 UNAUTHENTICATED, không rò rỉ tài khoản nào', async () => {
        const res = await call<AccountDto[]>(accountsRoute, '/api/admin/accounts')
        expectFail(res, 401, 'UNAUTHENTICATED')

        // Không chỉ kiểm mã lỗi: khẳng định thân response KHÔNG còn dữ liệu.
        // Một route trả 401 mà vẫn kèm `data` thì lỗ vẫn nguyên.
        expect(res.body.data, 'Response lỗi không được kèm dữ liệu').toBeNull()
        expect(JSON.stringify(res.body)).not.toContain('@namduhill.demo')
    })

    /*
     * §B8: `account.manage` CHỈ cấp cho `owner`. Ba vai trò dưới đều là người
     * đã đăng nhập hợp lệ ⇒ phải là 403 (thiếu quyền), KHÔNG phải 401 — FE xử
     * lý hai mã này khác nhau (401 đá về /login, 403 hiện thông báo).
     *
     * `manager` nằm trong danh sách là CHỦ Ý, trả lời câu hỏi bỏ ngỏ ở mục 6
     * của ticket: manager có toàn quyền vận hành nhưng KHÔNG được xem bản đồ
     * tài khoản quản trị.
     */
    it.each(['editor', 'receptionist', 'manager'] as const)(
        '[negative] %s KHÔNG có account.manage → 403 FORBIDDEN',
        async (role) => {
            const res = await call<AccountDto[]>(accountsRoute, '/api/admin/accounts', {
                session: await loginAs(role),
            })
            expectFail(res, 403, 'FORBIDDEN')
            expect(res.body.data).toBeNull()
        },
    )

    it('[negative] customer (khách) → 403 FORBIDDEN', async () => {
        const customer = await seedAccount('accounts-customer')
        const res = await call<AccountDto[]>(accountsRoute, '/api/admin/accounts', {
            session: await sessionForAccount(customer.id, 'customer'),
        })
        expectFail(res, 403, 'FORBIDDEN')
        expect(res.body.data).toBeNull()
    })
})

describe('POST /api/admin/upload', () => {
    it('[happy] editor tải PNG lên → 201, ảnh được nén sang WebP', async () => {
        const png = await realPng(600, 400)
        const res = await call<{
            url: string
            fileName: string
            originalBytes: number
            optimizedBytes: number
        }>(uploadRoute, '/api/admin/upload', {
            method: 'POST',
            session: await loginAs('editor'),
            rawBody: formDataWith(png, 'anh-thử-nghiệm.png', 'image/png'),
        })
        const data = expectOk(res, 201)
        uploadedFiles.push(data.fileName)

        expect(data.fileName.endsWith('.webp'), 'Ảnh phải được đổi sang WebP').toBe(true)
        // Tên file phải bị làm sạch: không dấu tiếng Việt, không ký tự lạ.
        expect(data.fileName).toMatch(/^[a-z0-9-]+\.webp$/)
        expect(data.url.startsWith('/uploads/')).toBe(true)
        expect(data.optimizedBytes).toBeGreaterThan(0)
    })

    it('[negative] file SVG bị loại → 400 UNSUPPORTED_TYPE (SVG chứa được script)', async () => {
        const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')
        const res = await call(uploadRoute, '/api/admin/upload', {
            method: 'POST',
            session: await loginAs('editor'),
            rawBody: formDataWith(svg, 'doc-hai.svg', 'image/svg+xml'),
        })
        expectFail(res, 400, 'UNSUPPORTED_TYPE')
    })

    it('[negative] file vượt MAX_BYTES (15MB) → 400 FILE_TOO_LARGE', async () => {
        // Buffer 16MB mang MIME hợp lệ — chặn phải xảy ra ở bước kiểm dung
        // lượng, TRƯỚC khi `sharp` phải đọc toàn bộ vào bộ nhớ.
        const tooBig = Buffer.alloc(16 * 1024 * 1024, 1)
        const res = await call(uploadRoute, '/api/admin/upload', {
            method: 'POST',
            session: await loginAs('editor'),
            rawBody: formDataWith(tooBig, 'qua-lon.jpg', 'image/jpeg'),
        })
        expectFail(res, 400, 'FILE_TOO_LARGE')
    })

    it('[negative] không gửi file nào → 400 NO_FILE', async () => {
        const res = await call(uploadRoute, '/api/admin/upload', {
            method: 'POST',
            session: await loginAs('editor'),
            rawBody: new FormData(),
        })
        expectFail(res, 400, 'NO_FILE')
    })

    it('[negative] KHÔNG đăng nhập → 401 UNAUTHENTICATED', async () => {
        const png = await realPng()
        const res = await call(uploadRoute, '/api/admin/upload', {
            method: 'POST',
            rawBody: formDataWith(png, 'a.png', 'image/png'),
        })
        expectFail(res, 401, 'UNAUTHENTICATED')
    })

    it('[negative] khách (customer) KHÔNG có content.edit → 403 FORBIDDEN', async () => {
        const customer = await seedAccount('upload-customer')
        const png = await realPng()
        const res = await call(uploadRoute, '/api/admin/upload', {
            method: 'POST',
            session: await sessionForAccount(customer.id, 'customer'),
            rawBody: formDataWith(png, 'a.png', 'image/png'),
        })
        // Phân biệt rõ với 401 ở case trên — hai mã, hai cách xử lý ở FE.
        expectFail(res, 403, 'FORBIDDEN')
    })
})
