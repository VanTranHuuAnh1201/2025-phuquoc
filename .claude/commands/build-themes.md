---
description: Dựng theme từ các Design DNA đã chọn — chỉ trang HOME, desktop + mobile
argument-hint: <tên-khách> [số hướng cần dựng, vd "1,3,5" hoặc "all"]
---

Dựng theme cho khách `$1` từ các hướng đã chốt ở `/directions`.

## Phạm vi — chỉ HOME

Mỗi hướng sinh **một** package theme, **chỉ trang chủ**, desktop + mobile.
Các trang con (rooms/blog/checkout) dùng lại bản của `domain-*`.

Lý do: user review home trước rồi mới đầu tư tiếp cho hướng thắng cuộc. Dựng
đủ mọi trang cho N hướng là tiêu công vào những hướng sẽ bị loại.

## Điều kiện tiên quyết

`resources/docs/directions/$1.md` phải tồn tại. Chưa có → nói user chạy
`/directions $1` trước, dừng lại.

Nếu tham số thứ hai trống → hỏi user chạy hướng nào (đừng mặc định "all").

## Với MỖI hướng, làm đúng 6 bước

Đọc [CLAUDE.md §4 "Thêm một mẫu mới"](../../CLAUDE.md) — quy trình đã kiểm chứng.

1. Tạo `packages/theme-hN/`, khung copy từ `theme-h1`
2. `package.json` — khai styling engine mà hướng đó chọn (R14)
3. `tokens.css` — khai token dưới `[data-theme='hN']`, đủ bộ D1
4. `sections/` — 9 section id của luật R7: `top about rooms dining tours places
   gallery booking contact`. Được **bỏ bớt**, không được **đổi tên**.
5. `composition.tsx` + `meta.ts` — meta phải chứa **Design DNA 5 khối** để
   trang hub hiện được hướng của từng mẫu
6. Đăng ký: `apps/2026-thenamduhill/package.json` · `themes/registry.ts` ·
   `app/layout.tsx` (import tokens.css) · `next.config.ts` (transpilePackages)
   · `globals.css` (`@source` nếu dùng Tailwind)

Rồi `pnpm install`. Route `/hN` và thẻ hub tự xuất hiện — không sửa route.

## Luật phải giữ

| Luật | |
|---|---|
| **R1** | Không import theme khác, kể cả copy một hàm nhỏ |
| **R4** | Theme chỉ chứa hình thức — không gọi API, không tính giá |
| **R7** | Không đổi tên section id |
| **R13** | Không gọi thẳng repository/pricing, dữ liệu vào qua props |
| **D0** | Không hex nào ngoài `tokens.css` |
| **D1** | Token đặt tên theo **vai trò** (`brand`), không theo màu (`gold`) |
| **D3** | Component tương tác đủ 7 trạng thái |
| **P9** | Mobile là thiết kế riêng, không phải `flex-direction: column` |

## Kiểm tự động trước khi báo xong

```bash
# 1. Không hex ngoài tokens.css (luật D0)
grep -rn "#[0-9a-fA-F]\{3,8\}" packages/theme-hN/src --include="*.tsx" | grep -v tokens.css

# 2. Theme không chạm tầng dữ liệu (luật R13)
grep -rn "getRooms\|calculatePrice\|buildQuote" packages/theme-hN/src

# 3. Nội dung bên thứ ba không lên production (luật R9)
grep -rn "thenamduhill.com\|botble.com" packages/theme-hN/src

# 4. Build — CẢ N theme, không riêng theme mới
pnpm build && pnpm lint
```

Ba lệnh grep đầu phải **rỗng**. Build phải xanh cho **mọi** app.

⚠️ Với Tailwind: build xanh **không** đảm bảo style chạy. Phải kiểm CSS bundle
thật sự có class của theme mới — quên `@source` thì trang trắng trơn mà build
vẫn báo thành công.

## Báo cáo

Với mỗi theme đã dựng: tên, slug, engine, đường dẫn xem (`/hN?lang=vi`), kết
quả 4 lệnh kiểm trên.

Cuối cùng nhắc user:

> Mở http://localhost:3000/ để xem tất cả các mẫu cạnh nhau.
