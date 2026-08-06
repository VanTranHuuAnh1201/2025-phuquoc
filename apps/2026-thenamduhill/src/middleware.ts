import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth/jwt";

/**
 * Guard phiên ở tầng Edge (ticket 000-03 §4.4, §6.3).
 *
 * Middleware CHỈ trả lời hai câu: "đã đăng nhập chưa" và "có phải khách không".
 * Kiểm quyền chi tiết (`price.edit`, `booking.refund`…) nằm trong từng Route
 * Handler bằng `requirePermission()` — middleware không biết hành động cụ thể
 * và không được gọi DB (luật BE11).
 *
 * ⚠️ Cấm import `bcryptjs` hay bất cứ thứ gì runtime từ `@repo/core` vào file
 * này: Edge Runtime không có Node API, và import runtime từ core là rủi ro bundle.
 */

/** Đường dẫn phải đăng nhập mới vào được. */
function isGuarded(pathname: string): boolean {
    return (
        pathname === "/admin" ||
        pathname.startsWith("/admin/") ||
        pathname === "/api/admin" ||
        pathname.startsWith("/api/admin/") ||
        pathname === "/my-orders" ||
        pathname.startsWith("/my-orders/")
    );
}

/** Route API phải nhận JSON, không nhận redirect. */
function isApiPath(pathname: string): boolean {
    return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

/** Khu vực chỉ nhân viên — khách đăng nhập rồi vẫn không vào được. */
function isStaffOnly(pathname: string): boolean {
    return (
        pathname === "/admin" ||
        pathname.startsWith("/admin/") ||
        isApiPath(pathname)
    );
}

/**
 * Chuyển cookie đã đặt trên `from` sang `to`.
 *
 * `createClient(request)` trả về một `NextResponse` mang cookie phiên Supabase
 * vừa refresh. Nhánh redirect và nhánh JSON lỗi bắt buộc phải tạo response
 * MỚI (khác status/location), nên nếu không copy lại thì cookie refresh bị
 * đánh rơi — trình duyệt giữ cookie cũ đã hết hạn và vòng sau lại refresh,
 * lỗi chỉ lộ ra lúc token Supabase xoay vòng nên rất khó truy (SA review S1).
 */
function inherit(from: NextResponse, to: NextResponse): NextResponse {
    from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie));
    return to;
}

/**
 * Lỗi JSON đúng chuẩn BE1. Không dùng `errors.ts` vì file đó có thể kéo theo
 * phụ thuộc Node; ở Edge giữ nội dung tối thiểu tại chỗ.
 */
function jsonError(
    status: 401 | 403,
    code: "UNAUTHENTICATED" | "FORBIDDEN",
    vi: string,
    en: string,
): NextResponse {
    return NextResponse.json(
        { success: false, data: null, error: { code, message: { vi, en } } },
        { status },
    );
}

function redirectToLogin(request: NextRequest): NextResponse {
    const next = request.nextUrl.pathname + request.nextUrl.search;
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(next)}`;
    // 307 giữ nguyên method — POST bị chặn không bị đổi thành GET.
    return NextResponse.redirect(url, 307);
}

export async function middleware(request: NextRequest) {
    // ① Giữ nguyên: refresh cookie phiên Supabase (đường đọc dữ liệu công khai).
    //    `response` đã mang cookie Supabase — mọi nhánh dưới phải KẾ THỪA nó,
    //    không tạo `NextResponse.next()` mới, nếu không cookie Supabase bị mất.
    const response = createClient(request);

    const { pathname } = request.nextUrl;
    if (!isGuarded(pathname)) return response;

    // ② Guard JWT tự quản. Chỉ VERIFY CHỮ KÝ + HẠN, không chạm DB.
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload) {
        return inherit(
            response,
            isApiPath(pathname)
                ? jsonError(
                      401,
                      "UNAUTHENTICATED",
                      "Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục.",
                      "Your session has expired. Sign in again to continue.",
                  )
                : redirectToLogin(request),
        );
    }

    if (payload.role === "customer" && isStaffOnly(pathname)) {
        // API trả 403 để client phân biệt được với 401 (FE4): 401 → chuyển về
        // đăng nhập, 403 → hiện thông báo thiếu quyền. Trang thì đưa về login
        // vì khách không có màn quản trị nào để hiện.
        return inherit(
            response,
            isApiPath(pathname)
                ? jsonError(
                      403,
                      "FORBIDDEN",
                      "Tài khoản của bạn không có quyền truy cập khu vực quản trị.",
                      "Your account cannot access the admin area.",
                  )
                : redirectToLogin(request),
        );
    }

    return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Matcher giữ nguyên: Supabase vẫn cần chạy trên mọi route. Việc lọc route
     * được bảo vệ làm bằng `isGuarded()` trong thân middleware, không bằng matcher.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
