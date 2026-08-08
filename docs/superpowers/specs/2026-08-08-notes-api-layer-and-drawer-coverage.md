# Note — Tầng gọi API & phạm vi dùng Drawer

> Ngày: 2026-08-08 · **Đây là GHI CHÚ để xử lý sau, không phải việc đã làm.**
> Không thay đổi code nào trong đợt này.

---

## A. Hai file trong `packages/achitecture/` KHÔNG mô tả repo này

Đọc hết 2230 dòng. Kết luận: chúng là tài liệu của **NextGig FE Portal** — một
portal tuyển dụng gig/shift ở Singapore, không liên quan tới dự án đặt phòng.

### Bằng chứng

| Nguồn | Nội dung |
|---|---|
| `ARCHITECTURE.md:1` | Tiêu đề: "ARCHITECTURE — **NextGig FE Portal**" |
| `ARCHITECTURE.md:31` | "nền tảng việc làm theo ca (gig/shift marketplace)" |
| `SECURITY-REVIEW:558` | `connect-src 'self' https://api.nextgig.sg` |
| `SECURITY-REVIEW:268` | Key `REFRESH_TOKEN_WEB_EMPLOYER` |

Trong 2230 dòng **không có chữ nào** nhắc Phú Quốc, Nam Du, booking, phòng,
Supabase, Next.js hay pnpm.

### Stack lệch

| Hạng mục | Tài liệu | Repo này |
|---|---|---|
| Framework | Vite 6 + React Router v7 (SPA) | Next 15 App Router (RSC) |
| Package manager | `yarn build` / `yarn audit` | pnpm + turbo |
| Cấu trúc | single-app, `src/` ở gốc | monorepo: 4 app + 13 package |
| HTTP client | **Axios** (toàn bộ tài liệu xoay quanh) | **không có axios** — 12 chỗ `fetch()` thuần |
| Server state | TanStack Query v5 | không có |
| Env | `import.meta.env.VITE_URL_API` | `process.env.*` |
| Deploy | nginx + Docker | Next runtime + Supabase |
| Alias | `@/services`, `@/stores` (một app) | `@repo/*` (workspace) |

Mức khớp ước lượng **5–10%**, và chỉ ở tầng khái niệm (phân lớp
component→hook→service→http, anti-corruption layer, xử lý lỗi tập trung).

### Nguy hiểm nếu làm theo — đi LÙI so với luật đang có

| Tài liệu làm | Luật repo | Hệ quả |
|---|---|---|
| `Bearer` token trong `localStorage` | `BE10`: cookie **HttpOnly + Secure + SameSite=Strict** | Tài liệu tự xếp đây là 🔴 nghiêm trọng và khuyên "tốt nhất là httpOnly cookie" — tức luật repo ĐÃ ở mức tài liệu chỉ dám đề xuất cho Đợt 3 |
| `hardCodePermission(role)` ở client | `BE2`: "❌ TUYỆT ĐỐI KHÔNG tin `role` từ client" | Phân quyền bị bỏ qua bằng cách sửa localStorage |
| Envelope `{data, metadata}` | `BE1`: `{success, data, error}` + message `{vi,en}` | Hợp đồng API khác hẳn |
| **Không nhắc mã 409 lần nào** | `BE4`: 409 là mã chống overbooking | Mất lớp phòng thủ cốt lõi của nghiệp vụ |
| Chuỗi lỗi chỉ tiếng Việt | `BE1`/`FE6`: song ngữ kể cả chuỗi lỗi | Vi phạm luật dữ liệu |
| `localStorage.clear()` + hard redirect khi 401 | `FE4`: "giỏ hàng không được mất khi qua login" | `cart.store` persist bị xoá sạch |

### Việc nên làm (chưa làm)

1. **Thêm banner ở đầu cả hai file**: "Tài liệu tham chiếu từ dự án NextGig —
   KHÔNG mô tả repo này". Không có banner thì agent/dev sau sẽ hiểu nhầm.
2. **Sửa chính tả thư mục**: `packages/achitecture` → thiếu chữ `r`. Và nó nằm
   trong `packages/` như một workspace package nhưng **không có `package.json`**
   — nên chuyển ra `docs/reference/` thì đúng chỗ hơn.
3. Ba ý **đáng chuyển vào `.claude/rules/`** vì bổ khuyết luật hiện tại:
   - Không để wrapper fetch **nuốt lỗi** — phải phân biệt "lỗi API" với "rỗng"
   - **Một hàm `logout()` duy nhất** có xoá cache + hard redirect cho mọi đường thoát
   - **Bắt buộc `timeout`** cho mọi HTTP client + xử lý nhánh network/cancel/timeout

---

## B. Tầng gọi API hiện tại — hiện trạng đo được

**Chưa có axios. 12 chỗ gọi `fetch()` thuần, rải rác, không qua lớp chung nào.**

| File | Gọi gì |
|---|---|
| `stores/auth.store.ts` | `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` |
| `stores/booking.store.ts` | `/api/bookings` |
| `stores/promotion.store.ts` | `/api/promotions` |
| `hooks/useAdminData.ts` | `/api/admin/accounts` + 3 lần gọi lại |
| `app/admin/orders/new/page.tsx` | `POST /api/bookings` |
| `app/lookup/page.tsx` | `/api/bookings?code=…&phone=…` |

### Ba khoảng trống, xác nhận bằng grep (kết quả rỗng)

```bash
# 1. Không có timeout / AbortController ở BẤT KỲ đâu
grep -rn "AbortController\|signal:\|timeout" stores/ hooks/ app/lookup   # → rỗng

# 2. Không xử lý 401/403/409 ở client
grep -rn "status === 401\|status === 403\|status === 409" stores/ hooks/ app/   # → rỗng
```

| # | Khoảng trống | Hệ quả | Luật liên quan |
|---|---|---|---|
| 1 | **Không timeout** | API treo → UI treo vô hạn, không có gì cho user biết. Nặng hơn: cạn connection pool trình duyệt (6/host) làm **cả app** đứng chứ không riêng màn đang lỗi | chưa có luật nào phủ |
| 2 | **Không xử lý 401/403/409** | `FE4` yêu cầu ba mã này xử lý riêng: 409 → "Phòng vừa được khách khác đặt"; 401 → `/login?next=…`; 403 → "không có quyền". Hiện không mã nào được phân biệt | `FE4`, `BE1`, `BE4` |
| 3 | **5 chỗ `catch {}` nuốt lỗi** | `booking.store.ts:247`, `promotion.store.ts:46`, `auth.store.ts:105/136/151` | `C3` |

### Về #3 — hiện tại là CỐ Ý, sau này là bug

```ts
} catch {
    // Fallback silently
}
```

Ở **giai đoạn 1** (`app-flows.md §F7`) store là nguồn thật, API lỗi thì giữ seed
demo — nuốt lỗi là đúng ý đồ. Nhưng khi lên **giai đoạn 3 (Supabase)** thì
"lỗi mạng" và "không có dữ liệu" trông giống hệt nhau, đúng cái bẫy mà tài liệu
NextGig tự mô tả ở `ARCHITECTURE.md:136`.

**Phải sửa TRƯỚC khi chuyển sang giai đoạn 3, không phải sau.**

### Đề xuất khi làm (chưa làm)

Không bê axios vào chỉ để có axios. Cân nhắc theo thứ tự:

1. **Một wrapper `apiFetch()` mỏng** trong `src/lib/api.ts` — `fetch` thuần +
   timeout + parse envelope `{success,data,error}` của `BE1` + ném lỗi có mã.
   Không kéo thêm dependency, hợp với Next (RSC dùng được `fetch` gốc).
2. **Axios** chỉ khi thật sự cần interceptor phức tạp (refresh token xoay vòng,
   retry, single-flight). Hiện `BE10` ghi "refresh token hoãn v1.1" nên **chưa cần**.
3. Dù chọn cách nào: lỗi phải mang `code` + message `{vi,en}` theo `BE1`, và
   401/403/409 phải phân biệt được theo `FE4`.

---

## C. Drawer — chỗ đã dùng và chỗ CHƯA dùng

### Đã dùng (5 màn, mở chung một drawer chi tiết đơn)

`admin/page.tsx` (Dashboard) · `admin/orders/page.tsx` · `admin/customers/page.tsx` ·
`admin/housekeeping/page.tsx` · `admin/inventory/page.tsx`

### CHƯA dùng — "Đặt phòng mới"

Nút `+ Đặt phòng mới` vẫn `<Link href="/admin/orders/new">` → **rời trang**:

| File | Dòng |
|---|---|
| `app/admin/orders/page.tsx` | 583 |
| `app/admin/page.tsx` | 467 |

Đây đúng là điểm không nhất quán: mở một đơn *đã có* thì trượt ra drawer, còn
*tạo mới* thì nhảy trang. Cùng một nghiệp vụ, hai kiểu tương tác.

**Chưa đổi vì chưa có xác nhận của khách** — ghi nhận ở đây để hỏi.

Nếu đổi thì cân nhắc:

| | Ủng hộ drawer | Chống |
|---|---|---|
| Nhất quán | Mọi thao tác với đơn đều ở drawer | |
| Không mất ngữ cảnh | Lễ tân đang nghe điện thoại, tạo đơn xong quay lại đúng bảng | |
| Độ dài form | | Form >10 trường + panel giá bên phải; 560px có thể chật, cần `contentClassname: 'sm:!max-w-[860px]'` |
| Deep-link | | Comment ở `orders/new/page.tsx:6-8` ghi rõ lý do chọn route riêng: cần dán link khi đang nghe điện thoại |

**Nếu làm:** giữ route `/orders/new` (cho deep-link) và thêm đường mở bằng
drawer — giống cách `/orders/[id]` đang tồn tại song song với drawer chi tiết.

---

## D. File KHÔNG còn dùng / dùng ít — chưa xoá

**Không xoá gì trong đợt này.** Danh sách để rà lại sau.

| File | Trạng thái | Ghi chú |
|---|---|---|
| `app/admin/orders/[id]/page.tsx` (512 dòng) | **Còn dùng, giữ** | 3 chỗ link tới: `orders/page.tsx:289` (icon mắt), `admin/page.tsx:306`, và chính drawer (`OrderDetailPanel.tsx:423` — "Mở trang đầy đủ →"). Sau refactor nó chỉ còn phần khung; mọi dialog dùng chung từ `_shared/OrderDialogs.tsx`. **Không phải code chết.** |
| `app/admin/orders/new/page.tsx` (610 dòng) | **Còn dùng, giữ** | Xem mục C |
| `packages/cms-ui/src/DrawerRight/` (2 file) | **Không biên dịch, không export** | Bản tham chiếu shadcn `Sheet` từ dự án khác. Đã loại khỏi `tsconfig` (`exclude`) và khỏi Tailwind (`@source not`). Bản dùng thật là `DrawerRight.tsx` cùng cấp. **Nên xoá hoặc chuyển ra `docs/reference/`** — để trong `src/` là mìn hẹn giờ (đã làm build đổ một lần vì class trong comment). |
| `packages/cms-ui/src/SidePanel.tsx` | **Đã xoá** | Bản đầu, thay bằng `DrawerRight.tsx` |
| `app/admin/orders/_shared/useOrderPanel.ts` | **Đã xoá** | Hook `?order=` của bản đầu, không cần với API mệnh lệnh |

### Hai file còn dùng hệ token CŨ (`--text`, `--space-*`) thay vì `--cms-*`

`app/admin/orders/[id]/page.tsx` và `app/admin/orders/new/page.tsx` — **hai
outlier duy nhất trong 16 file admin**. Chạy được nhờ khối ánh xạ ở
`tokens.css:100-115`, nhưng `--space-*` / `--radius-lg` / `--font-display`
**không** được map nên hai trang này lệch nhịp so với phần còn lại của CMS.

---

## Tóm tắt việc cần quyết

| # | Việc | Cần ai quyết |
|---|---|---|
| 1 | Drawer cho "Đặt phòng mới" | **Khách hàng** |
| 2 | Banner + đổi tên/chuyển chỗ `packages/achitecture/` | Chủ dự án |
| 3 | Xoá `packages/cms-ui/src/DrawerRight/` | Chủ dự án |
| 4 | Chọn hướng tầng API: wrapper mỏng vs axios | `ndh-sa` |
| 5 | Sửa 5 chỗ `catch {}` **trước** khi lên Supabase | `ndh-sa` xếp lịch |
| 6 | Migrate 2 file outlier sang `--cms-*` | `ndh-fe`, ưu tiên thấp |
