# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Đọc file này trước khi làm bất cứ việc gì. Mục tiêu, ràng buộc và quyết định
> kiến trúc đã chốt đều nằm ở đây — **không hỏi lại người dùng những điều đã ghi**.

---

## 1. Dự án là gì

Monorepo chứa **nhiều sản phẩm web thương mại**, bắt đầu bằng **Booking Hotel**.

Bài toán cốt lõi: khách hàng chưa biết mình thích giao diện nào, nên mỗi sản phẩm
phải xuất được **N giao diện khác nhau trên cùng một nguồn dữ liệu và cùng một
nghiệp vụ**. Hiện tại N = 4; thiết kế phải chịu được N = 20 mà không phải sửa lại
kiến trúc.

Đây đồng thời là **portfolio cá nhân** của chủ repo (senior Frontend) — dùng để
giới thiệu năng lực khi tìm việc. Vì vậy chất lượng code, tài liệu và commit
history đều là sản phẩm, không chỉ là phương tiện.

### Hai đối tượng người xem

| Đối tượng | Ưu tiên | Thấy gì |
|---|---|---|
| **Khách hàng đang trả tiền** (ưu tiên số 1) | Cao nhất | Trang chủ monorepo giới thiệu sản phẩm, link `/booking-hotel` là bản demo chỉnh chu |
| Nhà tuyển dụng / tech lead | Thứ hai | README + `docs/ARCHITECTURE.md` giải thích quyết định kỹ thuật |

Khi phải đánh đổi: **ưu tiên trải nghiệm khách hàng end-user**, không phải độ
"ấn tượng kỹ thuật" của README.

---

## 2. Quyết định kiến trúc đã chốt

Những điều dưới đây **đã quyết**, không mở lại trừ khi người dùng yêu cầu:

| Chủ đề | Quyết định | Lý do |
|---|---|---|
| Cấu trúc repo | **Monorepo, pnpm workspaces** | Sẽ có nhiều sản phẩm + nhiều theme; cần chia sẻ code mà không copy |
| Package manager | **pnpm** (có sẵn v11) — **không dùng yarn 1.22** | Yarn Classic hoisting không đáng tin với Next 15 + React 19 |
| Đơn vị theme | **1 Next app + mỗi theme là 1 package** | Thêm mẫu thứ 20 = thêm 1 folder + 1 dòng đăng ký. Một lần build, một lần deploy |
| Data | **Một nguồn duy nhất** trong `packages/core`, mọi theme đọc chung | "1 CMS data, N render" là yêu cầu gốc của dự án |
| Code Pho Group cũ | Chuyển nguyên trạng vào `apps/2025-phogroup`, **không sửa bên trong** | Demo hiện có phải tiếp tục chạy |
| Ngôn ngữ tài liệu | README song ngữ (`README.md` EN + `README.vi.md` VI); tài liệu nội bộ tiếng Việt | Tiếp cận cả recruiter quốc tế lẫn khách trong nước |

### Cấu trúc hiện tại

```
apps/
  portfolio/           Trang chính — danh mục sản phẩm  → cổng 3002
  2026-thenamduhill/   Booking Hotel — hub + N mẫu      → cổng 3000
  2025-phogroup/       Pho Group cũ (vùng đóng băng)    → cổng 3001
packages/
  core/         Type, dữ liệu, nghiệp vụ booking, i18n — KHÔNG chứa JSX
  ui/           Primitive không mang bản sắc thương hiệu
  tsconfig/     Config TypeScript dùng chung
  theme-h1/     ✅ tokens + sections + composition (khuôn mẫu)
  theme-h2..h4/ ⏳ nhân bản từ h1 sau khi duyệt
resources/
  design/       Bundle Figma (prototype HTML)
  docs/         Kiến trúc + hướng dẫn deploy
  handover/     Tài liệu bàn giao dự án tour
scripts/crawl/  Script cào dữ liệu (là code, không phải tài liệu)
```

**Mỗi sản phẩm = 1 app = 1 Vercel Project = 1 domain.** `apps/portfolio` chỉ
liệt kê và link sang các app khác bằng **URL tuyệt đối** (đọc từ biến môi
trường), không import code của chúng.

Đặt tên theo `<năm>-<khách hàng>`, và **tên thư mục = tên package = tên Vercel
Project = tên biến env** (`apps/2026-thenamduhill` ↔ `@repo/2026-thenamduhill`
↔ `NEXT_PUBLIC_URL_2026_THENAMDUHILL`). Nhìn log build hay lệnh turbo là biết
ngay đang nói app nào.

```
vantha.com.vn                 ← apps/portfolio, danh mục
  ├─→ thenamduhillresort.com  ← apps/2026-thenamduhill:  /  = hub,  /h1 = mẫu 01
  └─→ 2025-phuquoc.vercel.app ← apps/2025-phogroup
```

Hub của `apps/2026-thenamduhill` nằm ở `/`, **không phải** `/booking-hotel` — app đã có domain
riêng nên tên sản phẩm không cần lặp trong đường dẫn, và tên khách hàng không
nằm trong code. Chi tiết: [DEPLOY.md](resources/docs/DEPLOY.md).

### Ranh giới package — bất khả xâm phạm

```
theme-*  →  ui, core        ✅
ui       →  core            ✅
core     →  (không phụ thuộc ai)
theme-a  →  theme-b         ❌ TUYỆT ĐỐI KHÔNG
core     →  ui / theme-*    ❌
```

`packages/core` không được chứa JSX hay CSS. Nếu một logic cần dùng ở 2 theme
trở lên, nó thuộc về `core` hoặc `ui` — **không bao giờ copy giữa các theme**.

---

## 3. Nguồn thiết kế

`resources/design/project/` là bundle bàn giao từ Claude Design — **prototype HTML/CSS/JS,
không phải code sản xuất**. Nhiệm vụ là tái tạo *kết quả hình ảnh* bằng React,
không bê nguyên cấu trúc prototype.

Điểm quan trọng đã khảo sát:

- `namdu-data.js` — **một data context song ngữ `{vi, en}` dùng chung cho cả 4
  layout**. Đây chính là hình mẫu của `packages/core`; port sang TypeScript có type đầy đủ.
- Cả 4 home render **cùng bộ section id**: `top, about, rooms, dining, tours,
  places, gallery, booking, contact`. Chỉ khác bảng màu, font và cách bố cục.
- Mỗi theme có bộ token riêng — H1 xanh dương `#075E9E` + Plus Jakarta Sans;
  H2/H3 teal `#066168` + cam `#FFAA0D` + Figtree; H4 teal + xanh lá `#85D200`.
- `Showcase Hub.dc.html` là mẫu trang chủ liệt kê các giao diện.
- `image-slot.js` / `support.js` là scaffold của công cụ thiết kế — **không port**.

**Đừng mở prototype bằng trình duyệt hay chụp màn hình** trừ khi được yêu cầu;
mọi kích thước, màu, quy tắc layout đều nằm trong source.

Nội dung và hình ảnh crawl trong `scripts/crawl/output/` cùng theme Travlla có
bản quyền bên thứ ba — chỉ dùng dựng cấu trúc ở môi trường dev, **không đưa lên
production**.

---

## 4. Lệnh

Monorepo đã dựng xong. Dùng **pnpm** ở gốc — không dùng yarn nữa:

```bash
pnpm install   # cài toàn bộ workspace
pnpm dev       # chạy hết → mở http://localhost:3002 rồi click
pnpm build     # build toàn bộ (turbo, có cache)
pnpm check     # lint + typecheck toàn bộ
```

**Chỉ cần nhớ `pnpm dev` và cổng 3002.** Trang chính ở đó, click sang từng sản
phẩm. Các app chạy song song ở cổng cố định: 3002 portfolio · 3000
`2026-thenamduhill` · 3001 `2025-phogroup`.

Khi cần nhẹ máy, chạy riêng một app: `pnpm dev:portfolio`, `dev:thenamduhill`,
`dev:phogroup` — lúc đó các cổng kia không có gì.

Build riêng một package: `pnpm turbo build --filter=@repo/2026-thenamduhill`.

Chưa có test framework — **không bịa lệnh test**.

Crawler (tài liệu tiếng Việt trong `scripts/crawl/README.md`):

```bash
pnpm crawl:full            # BFS toàn site      → output/full-site.json
pnpm crawl:rooms           # chi tiết phòng AJAX → output/room-details.json
pnpm crawl:build           # → output/*.seed.ts
pnpm crawl:travlla         # crawl Travlla demo (89 trang, ~1 phút)
```

Kết quả crawl **cố ý không tự merge** vào mockData — sinh file seed để người
kiểm tra rồi merge tay.

### Thêm một mẫu mới (đã kiểm chứng)

Đúng 5 chỗ, không đụng `core`/`ui`/route:

1. tạo `packages/theme-hN/` (copy khung từ `theme-h1`)
2. `apps/2026-thenamduhill/package.json` — thêm `"@repo/theme-hN": "workspace:*"`
3. `apps/2026-thenamduhill/src/themes/registry.ts` — thêm import + một phần tử mảng
4. `apps/2026-thenamduhill/src/app/layout.tsx` — thêm một dòng import `tokens.css`
5. `apps/2026-thenamduhill/next.config.ts` — thêm vào `transpilePackages`

Rồi `pnpm install`. Route `/hN` và thẻ trên hub tự xuất hiện.

### Thêm một sản phẩm mới

1. Tạo `apps/<ten>/` (copy khung từ `apps/portfolio`)
2. Thêm `vercel.json` với `--filter=@repo/<ten>`
3. Thêm một phần tử vào `apps/portfolio/src/products.ts` + một biến env
4. Tạo Vercel Project mới, Root Directory trỏ vào thư mục đó

---

## 5. Code hiện có (`apps/2025-phogroup` sau khi chuyển)

Bối cảnh để không hiểu nhầm khi phải đụng vào:

- **Hai cây app độc lập.** `src/app/[locale]/layout.tsx` tự render `<html>`/`<body>`
  riêng bên cạnh root layout. `src/app/admin/` không đa ngôn ngữ và bị middleware
  i18n loại trừ hoàn toàn.
- **i18n tự viết, không phải next-intl.** `next-intl` có trong dependencies nhưng
  **không được dùng**. Cơ chế thật: [middleware.ts](apps/2025-phogroup/src/middleware.ts) redirect
  theo `Accept-Language` (mặc định `vi`) → [i18n.ts](apps/2025-phogroup/src/i18n.ts) chứa toàn bộ
  chuỗi inline → [LanguageContext.tsx](apps/2025-phogroup/src/app/contexts/LanguageContext.tsx) cấp
  `useLanguage()`. `src/locales/*.json` là **file chết**, không được nối vào đâu cả.
- **Route page mỏng** — resolve `params`, tra mock data theo id, đưa cho một
  layout trong `src/app/components/layouts/`.
- Mock data nằm cạnh route (`[locale]/hotels/mockData.ts`); interface dùng chung
  ở [lib/data.ts](apps/2025-phogroup/src/app/lib/data.ts).
- Design system cũ: UI marketing dùng gradient **cam→hồng**, riêng form trong
  `shared/BookingForm.tsx` dùng **xanh dương** — chi tiết ở
  `resources/handover/02-DESIGN-SYSTEM.md`. Ràng buộc này **chỉ áp dụng cho `apps/2025-phogroup`**,
  không áp cho sản phẩm booking hotel mới.

---

## 6. Quy ước

- Alias `@/*` → `./src/*` (trong từng app).
- Route page nhận `params: Promise<{...}>` và phải `await` (Next 15).
- Code trong `src/app/**` dùng thụt lề 4 space, nhiều file không có dấu chấm phẩy
  — **theo đúng file đang sửa**, đừng reformat cả file.
- `src/mockup/website.tsx` là file nháp tham khảo, không thuộc route nào.
- Tài liệu trong `resources/handover/` và `scripts/crawl/` viết bằng tiếng Việt.

---

## 7. Định nghĩa "xong"

Một thay đổi chỉ được coi là hoàn thành khi:

1. `pnpm lint` và typecheck sạch (chưa có test để chạy).
2. Không vi phạm ranh giới package ở §2.
3. Thêm/sửa theme thì **cả N theme vẫn build được** — không chỉ theme đang làm.
4. Dữ liệu mới thêm vào `core` phải có **cả hai ngôn ngữ** `{vi, en}`.
5. Không đưa nội dung/hình ảnh có bản quyền bên thứ ba vào đường dẫn production.
