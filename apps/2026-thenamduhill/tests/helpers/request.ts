import { expect } from 'vitest'

/**
 * Wrapper gọi Route Handler + assert hợp đồng BE1 trên MỌI response.
 *
 * Vì sao assert hợp đồng ở đây chứ không ở từng test: AC-10 yêu cầu cả 53 case
 * đều kiểm `{success, data, error}` và lỗi phải song ngữ. Rải `expect` đó vào
 * từng test là 53 lần copy — và chỉ cần một chỗ quên là mất đúng cái đang muốn
 * bảo vệ. Đặt ở tầng wrapper thì không thể quên.
 */

/** Thân response thành công theo BE1. */
export interface OkBody<T> {
    success: true
    data: T
    error: null
}

/** Thân response lỗi theo BE1. */
export interface ErrBody {
    success: false
    data: null
    error: { code: string; message: { vi: string; en: string } }
}

export interface CallResult<T> {
    status: number
    /** Thân đã parse. Union — thu hẹp bằng `res.body.success`. */
    body: OkBody<T> | ErrBody
    headers: Headers
}

/** Cookie phiên do `loginAs()` cấp; `null` = gọi không đăng nhập. */
export type Session = string | null

interface CallOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    session?: Session
    /** Body JSON. Bỏ qua nếu `rawBody` được đặt. */
    json?: unknown
    /** Body thô — dùng cho test "JSON hỏng" và cho webhook (HMAC ký trên chuỗi thô). */
    rawBody?: string | FormData
    headers?: Record<string, string>
    /** Query string, không kèm dấu `?`. */
    query?: Record<string, string>
}

const BASE = 'http://localhost:3000'

function buildRequest(pathname: string, opts: CallOptions): Request {
    const url = new URL(pathname, BASE)
    for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, v)

    const headers = new Headers(opts.headers ?? {})
    if (opts.session) headers.set('cookie', opts.session)

    let body: BodyInit | undefined
    if (opts.rawBody !== undefined) {
        body = opts.rawBody
    } else if (opts.json !== undefined) {
        body = JSON.stringify(opts.json)
        headers.set('content-type', 'application/json')
    }

    return new Request(url.toString(), {
        method: opts.method ?? 'GET',
        headers,
        body,
    })
}

/**
 * Kiểm hợp đồng BE1 + song ngữ. Ném qua `expect` nên test đỏ ngay tại chỗ gọi.
 *
 * ⚠️ `legacyShape` TRƯỚC ĐÂY tha cho `/api/webhooks/payment` và 2 route
 * `/api/cron/*` — ba route trả `message` là chuỗi một ngôn ngữ thay vì
 * `I18nText {vi,en}`, làm FE đọc `error.message.vi` ra `undefined`.
 *
 * `900-03` đã sửa cả ba về `fail()`/`ok()` nên **danh sách miễn trừ nay RỖNG**
 * và MỌI route đều bị kiểm ngặt. Tham số được giữ lại có chủ ý: xoá hẳn thì
 * lần sau ai đó lại thêm ngoại lệ bằng cách khác, khó thấy hơn.
 */
function assertEnvelope(status: number, parsed: unknown, legacyShape: boolean): void {
    expect(parsed, `Response body của HTTP ${status} không phải object JSON`).toBeTypeOf('object')
    expect(parsed).not.toBeNull()

    const body = parsed as Record<string, unknown>
    expect(body).toHaveProperty('success')
    expect(typeof body.success).toBe('boolean')

    if (body.success === true) {
        expect(body).toHaveProperty('data')
        expect(body.error ?? null).toBeNull()
        return
    }

    expect(body).toHaveProperty('error')
    if (legacyShape) return

    expect(body.data ?? null).toBeNull()
    const err = body.error as Record<string, unknown>
    expect(typeof err.code, `error.code phải là chuỗi, nhận ${typeof err.code}`).toBe('string')
    expect(err.code).not.toBe('')

    // C7/BE1: thông báo lỗi BẮT BUỘC song ngữ. Thiếu một vế là FE hiện rỗng ở
    // ngôn ngữ đó — và typecheck không bắt được vì message đi qua JSON.
    const msg = err.message as Record<string, unknown> | undefined
    expect(msg, `error.message thiếu ở mã ${String(err.code)}`).toBeTypeOf('object')
    expect(typeof msg?.vi, `error.message.vi thiếu ở mã ${String(err.code)}`).toBe('string')
    expect(typeof msg?.en, `error.message.en thiếu ở mã ${String(err.code)}`).toBe('string')
    expect(String(msg?.vi)).not.toBe('')
    expect(String(msg?.en)).not.toBe('')
}

/**
 * RỖNG kể từ `900-03`: không route nào còn được miễn hợp đồng BE1.
 *
 * Danh sách khai TƯỜNG MINH (không dùng tiền tố mờ) để route mới thêm vào
 * `/api/cron/` sau này **bị kiểm ngặt** như mọi route khác. Thêm phần tử vào
 * đây là tự nhận nợ kỹ thuật — phải kèm mã ticket.
 */
const LEGACY_SHAPE_ROUTES = new Set<string>([])

function isLegacyShapeRoute(pathname: string): boolean {
    return LEGACY_SHAPE_ROUTES.has(pathname)
}

type Handler = (req: Request) => Promise<Response> | Response
type HandlerWithParams<P> = (
    req: Request,
    ctx: { params: Promise<P> },
) => Promise<Response> | Response

/** Gọi Route Handler không có route param. */
export async function call<T = unknown>(
    handler: Handler,
    pathname: string,
    opts: CallOptions = {},
): Promise<CallResult<T>> {
    const res = await handler(buildRequest(pathname, opts))
    const text = await res.text()
    let parsed: unknown
    try {
        parsed = JSON.parse(text)
    } catch {
        throw new Error(
            `Route ${pathname} trả về nội dung không phải JSON (HTTP ${res.status}): ${text.slice(0, 200)}`,
        )
    }
    assertEnvelope(res.status, parsed, isLegacyShapeRoute(pathname))
    return { status: res.status, body: parsed as OkBody<T> | ErrBody, headers: res.headers }
}

/** Gọi Route Handler có route param (`[id]`). */
export async function callWithParams<T = unknown, P extends object = { id: string }>(
    handler: HandlerWithParams<P>,
    pathname: string,
    params: P,
    opts: CallOptions = {},
): Promise<CallResult<T>> {
    const res = await handler(buildRequest(pathname, opts), { params: Promise.resolve(params) })
    const text = await res.text()
    let parsed: unknown
    try {
        parsed = JSON.parse(text)
    } catch {
        throw new Error(
            `Route ${pathname} trả về nội dung không phải JSON (HTTP ${res.status}): ${text.slice(0, 200)}`,
        )
    }
    assertEnvelope(res.status, parsed, false)
    return { status: res.status, body: parsed as OkBody<T> | ErrBody, headers: res.headers }
}

/** Thu hẹp về nhánh thành công; ném với ngữ cảnh đọc được nếu là lỗi. */
export function expectOk<T>(result: CallResult<T>, expectedStatus = 200): T {
    if (!result.body.success) {
        throw new Error(
            `Mong HTTP ${expectedStatus} thành công, nhận ${result.status} `
            + `${result.body.error.code}: ${result.body.error.message.vi}`,
        )
    }
    expect(result.status).toBe(expectedStatus)
    return result.body.data
}

/**
 * Lấy phần tử thứ `index` và thu hẹp khỏi `undefined`.
 *
 * `noUncheckedIndexedAccess` của repo làm `arr[0]` có kiểu `T | undefined`.
 * Dùng `!` thì mất đúng thứ cấu hình đó đang bảo vệ, và khi mảng rỗng thật thì
 * test đỏ bằng `Cannot read properties of undefined` — không nói được mảng nào.
 * Hàm này đỏ kèm tên mảng và độ dài thật.
 */
export function at<T>(items: readonly T[], index: number, label: string): T {
    const item = items[index]
    if (item === undefined) {
        throw new Error(`${label}: thiếu phần tử [${index}], mảng chỉ có ${items.length} phần tử`)
    }
    return item
}

/** Thu hẹp về nhánh lỗi + assert đúng status và mã lỗi. */
export function expectFail(
    result: CallResult<unknown>,
    status: number,
    code?: string,
): ErrBody['error'] {
    if (result.body.success) {
        throw new Error(
            `Mong lỗi HTTP ${status}${code ? ` (${code})` : ''}, nhưng route trả thành công `
            + `${result.status}: ${JSON.stringify(result.body.data).slice(0, 200)}`,
        )
    }
    expect(result.status).toBe(status)
    if (code) expect(result.body.error.code).toBe(code)
    return result.body.error
}
