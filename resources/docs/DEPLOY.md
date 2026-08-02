# Deploy lên Vercel

## Mô hình: Project, không phải thư mục

**Vercel không map subdomain vào thư mục.** Không có setting kiểu "trỏ
`booking.domain.com` vào `apps/2026-thenamduhill/`". Đơn vị deploy của Vercel là **Project**,
và domain gắn vào Project:

```
Domain  →  Vercel Project  →  Root Directory (thư mục trong repo)
```

Một thư mục chỉ "có địa chỉ" khi bạn tạo Project với Root Directory trỏ vào nó.
Một repo tạo được nhiều Project — Vercel hỗ trợ sẵn cho monorepo.

## Ba Project của repo này

| Vercel Project | Root Directory | Package | Domain | Cổng local |
|---|---|---|---|---|
| `portfolio` | `apps/portfolio` | `@repo/portfolio` | `vantha.com.vn` | 3002 |
| `2026-thenamduhill` | `apps/2026-thenamduhill` | `@repo/2026-thenamduhill` | `thenamduhillresort.com` | **3000** |
| `2025-phogroup` | `apps/2025-phogroup` | `@repo/2025-phogroup` | `2025-phuquoc.vercel.app` | 3001 |

Tên thư mục, tên package và tên Vercel Project **trùng nhau** — đọc log build
hay lệnh turbo đều biết ngay đang nói app nào.

**Mỗi sản phẩm deploy độc lập.** Sửa `apps/2026-thenamduhill` sẽ không build lại
`2025-phogroup`, nhờ `turbo-ignore` (xem bên dưới).

### Quan hệ giữa chúng

`apps/portfolio` là **trang chính** — chỉ liệt kê sản phẩm và link sang từng
app. Nó không import code của sản phẩm nào, chỉ chứa URL. Vì các app deploy
riêng nên link là **URL tuyệt đối**, không phải route nội bộ.

```
vantha.com.vn                    ← trang chính, danh mục sản phẩm
   ├─→ thenamduhillresort.com    ← Booking Hotel (app riêng)
   │      /          hub chọn mẫu
   │      /h1 /h2    các mẫu giao diện
   └─→ 2025-phuquoc.vercel.app   ← Pho Group (app riêng)
```

### Vì sao không còn `/booking-hotel`

`apps/2026-thenamduhill` có domain riêng, nên hub nằm ngay ở `/`. Đường dẫn
`thenamduhillresort.com/h1` gọn hơn `thenamduhillresort.com/booking-hotel/h1`,
và **tên khách hàng không nằm trong code** — bán cho khách thứ hai chỉ cần thêm
domain, không sửa route.

## Tạo Project (làm một lần cho mỗi app)

1. Vercel → **Add New… → Project** → chọn repo này.
2. **Root Directory**: `apps/portfolio` (hoặc `apps/2026-thenamduhill`, `apps/2025-phogroup`) —
   bước quan trọng nhất; bỏ qua thì Vercel build nhầm ở gốc.
3. Framework Preset: **Next.js** (Vercel tự nhận).
4. Build/Install command: **để trống** — `vercel.json` trong mỗi app đã khai báo.
5. Deploy.

Lặp lại cho từng app. **Ba Project, cùng một repo.**

## Biến môi trường cho trang chính

`apps/portfolio` cần biết URL thật của từng sản phẩm. Vào **Project Settings →
Environment Variables** của Project `portfolio`:

| Biến | Giá trị |
|---|---|
| `NEXT_PUBLIC_URL_2026_THENAMDUHILL` | `https://thenamduhillresort.com` |
| `NEXT_PUBLIC_URL_2025_PHOGROUP` | `https://2025-phuquoc.vercel.app` |

Tên biến khớp tên app — nhìn là biết trỏ tới đâu.

Ở máy local không cần set — code tự dùng `localhost:3000` / `3001`. Mẫu đầy đủ
ở `apps/portfolio/.env.example`.

> Biến `NEXT_PUBLIC_*` được nhúng vào bundle **lúc build**. Đổi giá trị phải
> **redeploy** Project portfolio thì mới ăn.

## Vì sao build command phải `cd ../..`

Root Directory là `apps/2026-thenamduhill`, nên Vercel chạy lệnh **bên trong thư mục đó**.
Nhưng pnpm workspace và turbo phải chạy ở **gốc repo** mới thấy được các
package. Vì thế `vercel.json` lùi hai cấp:

```json
{
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@repo/2026-thenamduhill",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile"
}
```

## Bỏ qua build không cần thiết

```json
{ "ignoreCommand": "cd ../.. && npx turbo-ignore @repo/2026-thenamduhill" }
```

`turbo-ignore` đọc đồ thị phụ thuộc và **huỷ build** nếu commit không đụng tới
app đó hay package nào nó phụ thuộc:

| Sửa gì | Project nào build lại |
|---|---|
| `apps/2025-phogroup` | chỉ `2025-phogroup` |
| `apps/portfolio` | chỉ `portfolio` |
| `packages/theme-h1` | chỉ `2026-thenamduhill` (portfolio không phụ thuộc) |
| `packages/core` | `2026-thenamduhill` (portfolio vẫn không) |

**Thêm mẫu thứ 20 không tạo thêm Project nào** — các mẫu nằm trong cùng
`apps/2026-thenamduhill`, phân biệt bằng path `/h1`…`/h20`.

## Gửi link cho khách

Mỗi sản phẩm có domain riêng, nên **gửi thẳng link của sản phẩm đó**. Khách chỉ
thấy trang của họ — không thấy trang chính, không thấy khách khác.

| Gửi cho | Link | Khách thấy gì |
|---|---|---|
| Khách Nam Du Hill | `thenamduhillresort.com` | Hub chọn mẫu → `/h1`, `/h2`… |
| Khách xem sẵn một mẫu | `thenamduhillresort.com/h1` | Vào thẳng mẫu 01 |
| Khách Pho Group | `2025-phuquoc.vercel.app` | Trang Pho Group |
| Nhà tuyển dụng / đối tác | `vantha.com.vn` | Danh mục toàn bộ sản phẩm |

Khách **không cần cài gì**. Link là website chạy thật, mở bằng trình duyệt trên
điện thoại hay máy tính đều được.

`vantha.com.vn` là trang của *bạn*, không phải của khách — chỉ gửi khi muốn giới
thiệu năng lực tổng thể (tuyển dụng, khách tiềm năng mới).

## Remote cache (khuyến nghị)

```bash
npx turbo login
npx turbo link
```

CI build lại thứ bạn vừa build ở máy → cache hit. Miễn phí với tài khoản Vercel.

## Thêm một sản phẩm mới

1. Tạo `apps/<ten-san-pham>/` (copy khung từ `apps/portfolio`).
2. Thêm `vercel.json` với `--filter=@repo/<ten>`.
3. Thêm một phần tử vào `apps/portfolio/src/products.ts` + một biến env.
4. Tạo Vercel Project mới, Root Directory trỏ vào thư mục đó.

## Nếu sau này muốn subdomain cho từng mẫu

Vẫn giữ **một** Project cho `apps/2026-thenamduhill`. Thêm wildcard domain
`*.thenamduhillresort.com` và một middleware đọc host rồi rewrite:

```ts
// apps/2026-thenamduhill/src/middleware.ts
const sub = request.headers.get('host')?.split('.')[0]
if (sub && sub.startsWith('h')) {
    return NextResponse.rewrite(new URL(`/${sub}`, request.url))
}
```

Cần wildcard DNS trỏ về Vercel và wildcard domain trên Vercel (có thể cần gói
trả phí). Không cần tạo thêm Project.
