import { afterAll, describe, expect, it } from 'vitest'
import { POST as loginRoute } from '@/app/api/auth/login/route'
import { POST as logoutRoute } from '@/app/api/auth/logout/route'
import { GET as meRoute } from '@/app/api/auth/me/route'
import { POST as registerRoute } from '@/app/api/auth/register/route'
import { call, expectFail, expectOk } from '../helpers/request'
import { loginAs, sessionForGhostAccount, toCookie } from '../helpers/auth'
import { adminDb, teardown, testEmail, testPhone, trackAccount } from '../helpers/seed'

/**
 * 4 route: `/auth/login` · `/auth/logout` · `/auth/me` · `/auth/register`.
 * TEST-STRATEGY §6 nhóm "Auth · token hết hạn · phân biệt 401/403": 6 case, 4 negative.
 */

interface AuthPayload {
    account: { id: string; role: string; fullName: string; email?: string; active: boolean }
    permissions: string[]
}

afterAll(teardown)

describe('POST /api/auth/register', () => {
    it('[happy] đăng ký khách mới → 200, cấp cookie phiên, vai trò luôn là customer', async () => {
        const email = testEmail('reg')
        const res = await call<AuthPayload>(registerRoute, '/api/auth/register', {
            method: 'POST',
            json: {
                email,
                password: 'MatKhauTest2026',
                fullName: 'Khách Test Đăng Ký',
                phone: testPhone(),
                // BE2: gửi kèm `role` để chứng minh server BỎ QUA nó.
                role: 'owner',
            },
        })

        const data = expectOk(res)
        trackAccount(data.account.id)

        expect(data.account.role).toBe('customer')
        expect(data.account.email).toBe(email)
        expect(data.permissions).toContain('booking.view.own')
        expect(data.permissions).not.toContain('price.edit')

        const setCookie = res.headers.get('set-cookie')
        expect(setCookie, 'Đăng ký xong phải cấp cookie phiên luôn').toContain('ndh_session=')
        expect(setCookie).toContain('HttpOnly')
        expect(setCookie).toContain('SameSite=Strict')

        // Đọc lại TỪ SERVER, không tin response (luật MAP A3).
        const { data: row } = await adminDb()
            .from('accounts')
            .select('role, active')
            .eq('id', data.account.id)
            .maybeSingle<{ role: string; active: boolean }>()
        expect(row?.role, 'DB phải ghi customer dù client gửi role=owner (BE2)').toBe('customer')
    })

    it('[negative] mật khẩu ngắn hơn 8 ký tự → 400 WEAK_PASSWORD', async () => {
        const res = await call(registerRoute, '/api/auth/register', {
            method: 'POST',
            json: { email: testEmail('weak'), password: 'abc', fullName: 'A', phone: testPhone() },
        })
        expectFail(res, 400, 'WEAK_PASSWORD')
    })

    it('[negative] số điện thoại sai định dạng → 400 INVALID_PHONE', async () => {
        const res = await call(registerRoute, '/api/auth/register', {
            method: 'POST',
            json: {
                email: testEmail('badphone'),
                password: 'MatKhauTest2026',
                fullName: 'A',
                phone: '12345',
            },
        })
        expectFail(res, 400, 'INVALID_PHONE')
    })

    it('[negative] email trùng → 409 ALREADY_REGISTERED', async () => {
        const email = testEmail('dup')
        const first = await call<AuthPayload>(registerRoute, '/api/auth/register', {
            method: 'POST',
            json: { email, password: 'MatKhauTest2026', fullName: 'Trùng', phone: testPhone() },
        })
        trackAccount(expectOk(first).account.id)

        const second = await call(registerRoute, '/api/auth/register', {
            method: 'POST',
            json: { email, password: 'MatKhauTest2026', fullName: 'Trùng 2', phone: testPhone() },
        })
        expectFail(second, 409, 'ALREADY_REGISTERED')
    })
})

describe('POST /api/auth/login', () => {
    it('[happy] email + mật khẩu đúng → 200 và cookie phiên', async () => {
        const email = testEmail('login')
        const password = 'MatKhauTest2026'
        const reg = await call<AuthPayload>(registerRoute, '/api/auth/register', {
            method: 'POST',
            json: { email, password, fullName: 'Khách Đăng Nhập', phone: testPhone() },
        })
        trackAccount(expectOk(reg).account.id)

        const res = await call<AuthPayload>(loginRoute, '/api/auth/login', {
            method: 'POST',
            json: { email, password },
        })
        const data = expectOk(res)
        expect(data.account.email).toBe(email)
        expect(res.headers.get('set-cookie')).toContain('ndh_session=')
    })

    it('[negative] sai mật khẩu → 401 INVALID_CREDENTIALS, không lộ email có tồn tại hay không', async () => {
        const email = testEmail('wrongpass')
        const reg = await call<AuthPayload>(registerRoute, '/api/auth/register', {
            method: 'POST',
            json: { email, password: 'MatKhauTest2026', fullName: 'X', phone: testPhone() },
        })
        trackAccount(expectOk(reg).account.id)

        const wrongPassword = await call(loginRoute, '/api/auth/login', {
            method: 'POST',
            json: { email, password: 'SaiMatKhau2026' },
        })
        const errA = expectFail(wrongPassword, 401, 'INVALID_CREDENTIALS')

        const unknownEmail = await call(loginRoute, '/api/auth/login', {
            method: 'POST',
            json: { email: testEmail('khong-ton-tai'), password: 'MatKhauTest2026' },
        })
        const errB = expectFail(unknownEmail, 401, 'INVALID_CREDENTIALS')

        // Hai trường hợp phải TRẢ GIỐNG HỆT nhau — khác nhau là dò được email
        // nào có thật trong hệ thống (login/route.ts:41).
        expect(errA.message.vi).toBe(errB.message.vi)
    })

    it('[negative] tài khoản bị vô hiệu hoá → 403 ACCOUNT_DISABLED, KHÔNG phải 401', async () => {
        const email = testEmail('disabled')
        const password = 'MatKhauTest2026'
        const reg = await call<AuthPayload>(registerRoute, '/api/auth/register', {
            method: 'POST',
            json: { email, password, fullName: 'Bị khoá', phone: testPhone() },
        })
        const accountId = expectOk(reg).account.id
        trackAccount(accountId)

        await adminDb().from('accounts').update({ active: false }).eq('id', accountId)

        const res = await call(loginRoute, '/api/auth/login', {
            method: 'POST',
            json: { email, password },
        })
        // Phân biệt được với 401: FE phải hiện "liên hệ quản lý", không phải
        // "thử lại mật khẩu" (BE1).
        expectFail(res, 403, 'ACCOUNT_DISABLED')
    })

    it('[negative] body không phải JSON hợp lệ → 400 INVALID_BODY', async () => {
        const res = await call(loginRoute, '/api/auth/login', {
            method: 'POST',
            rawBody: '{ khong-phai-json',
            headers: { 'content-type': 'application/json' },
        })
        expectFail(res, 400, 'INVALID_BODY')
    })
})

describe('GET /api/auth/me — phân biệt 401 vs 403', () => {
    it('[happy] có phiên hợp lệ → 200, permissions suy từ role trong DB', async () => {
        const res = await call<AuthPayload>(meRoute, '/api/auth/me', {
            session: await loginAs('receptionist'),
        })
        const data = expectOk(res)
        expect(data.account.role).toBe('receptionist')
        // §B8: lễ tân KHÔNG có price.edit. Đây là nguồn của mọi test RBAC sau.
        expect(data.permissions).not.toContain('price.edit')
        expect(data.permissions).toContain('booking.change-status')
    })

    it('[negative] KHÔNG có token → 401 UNAUTHENTICATED', async () => {
        const res = await call(meRoute, '/api/auth/me')
        // SA đã chốt (380-02 §8.3 điểm 3): mã 401 là `UNAUTHENTICATED`, bám code
        // ở guard.ts:96 — KHÔNG phải `UNAUTHORIZED` như ví dụ trong ticket.
        expectFail(res, 401, 'UNAUTHENTICATED')
    })

    it('[negative] token chữ ký sai → 401 UNAUTHENTICATED', async () => {
        const res = await call(meRoute, '/api/auth/me', {
            session: toCookie('khong.phai.token'),
        })
        expectFail(res, 401, 'UNAUTHENTICATED')
    })

    it('[negative] token hợp lệ nhưng account đã bị xoá → 401 (chứng minh guard đọc lại DB)', async () => {
        const res = await call(meRoute, '/api/auth/me', {
            session: await sessionForGhostAccount(),
        })
        // Token ký đúng, payload ghi role=owner. Nếu guard tin token thì đây là
        // 200 và ai giữ secret cũng thành owner vĩnh viễn. Phải là 401.
        expectFail(res, 401, 'UNAUTHENTICATED')
    })

    it('[negative] tài khoản bị vô hiệu hoá giữa ca → 403 ACCOUNT_DISABLED, phân biệt với 401', async () => {
        const account = await seedDisabledStaff()
        const res = await call(meRoute, '/api/auth/me', { session: account.cookie })
        expectFail(res, 403, 'ACCOUNT_DISABLED')
    })
})

describe('POST /api/auth/logout', () => {
    it('[happy] xoá cookie phiên kể cả khi token đã hỏng', async () => {
        const res = await call<{ loggedOut: boolean }>(logoutRoute, '/api/auth/logout', {
            method: 'POST',
        })
        expect(expectOk(res).loggedOut).toBe(true)
        const setCookie = res.headers.get('set-cookie') ?? ''
        expect(setCookie).toContain('ndh_session=')
        expect(setCookie).toContain('Max-Age=0')
    })
})

/** Tạo nhân viên `active=false` + cookie hợp lệ — dựng đúng kịch bản khoá giữa ca. */
async function seedDisabledStaff(): Promise<{ cookie: string }> {
    const { seedAccount } = await import('../helpers/seed')
    const { sessionForAccount } = await import('../helpers/auth')
    const acc = await seedAccount('disabled-staff', 'manager', false)
    return { cookie: await sessionForAccount(acc.id, 'manager') }
}
