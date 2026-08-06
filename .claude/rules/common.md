# Rules — Chuẩn kỹ thuật chung (Common)

Áp cho **mọi code trong repo**, không phân biệt backend hay frontend.
Vi phạm = phải sửa trước khi coi là xong.

Luật riêng theo tầng: [backend.md](./backend.md) · [frontend.md](./frontend.md)
Kiến trúc package: [architecture.md](./architecture.md)

---

## C1 — TypeScript nghiêm ngặt, không `any`

```ts
/* ✅ */ function priceOf(date: string): number
/* ❌ */ function priceOf(date: any): any
```

Không biết kiểu → dùng `unknown` rồi thu hẹp, không dùng `any`.

Kiểm — phải rỗng:

```bash
grep -rn ": any\|as any" apps/2026-thenamduhill/src packages/*/src
```

Ngoại lệ duy nhất: thư viện bên thứ ba không có type, và phải kèm comment nói rõ lý do.

## C2 — Một đơn vị, một lý do để thay đổi

Mỗi hàm/component làm đúng một việc. Phép thử: *"File này phải sửa khi nào?"*
Nhiều hơn một loại lý do — nội dung đổi, nghiệp vụ đổi, cách lấy dữ liệu đổi —
thì đang giữ nhầm trách nhiệm.

> **Không có trần số dòng.** File 900 dòng gồm 30 hàm mỗi cái một nhiệm vụ thì
> lành mạnh; file 400 dòng với 1 hàm làm 8 việc thì hỏng.

## C3 — Không nuốt lỗi

```ts
/* ❌ */ try { await save() } catch {}
/* ❌ */ try { await save() } catch (e) { console.log(e) }

/* ✅ */
try {
    await save()
} catch (e) {
    logger.error('Lưu đơn thất bại', { bookingId, error: e })
    return { success: false, error: { code: 'SAVE_FAILED', message: {…} } }
}
```

Bắt lỗi thì phải làm một trong ba: xử lý được, chuyển tiếp có ngữ cảnh, hoặc
ghi log rồi trả lỗi rõ ràng.

## C4 — Không hardcode bí mật, không hardcode cấu hình

```ts
/* ✅ */ const secret = process.env.JWT_SECRET
         if (!secret) throw new Error('JWT_SECRET chưa cấu hình')

/* ❌ */ const secret = 'namduhill2026'
/* ❌ */ const apiUrl = 'https://xyz.supabase.co'
```

Biến môi trường mới → bổ sung `.env.local.example` ngay trong cùng thay đổi.

## C5 — Tên đặt theo vai trò, không theo giá trị

| ❌ | ✅ | Vì sao |
|---|---|---|
| `--color-teal` | `--color-brand` | Đổi sang xanh lá thì tên thành nói dối |
| `price1500000` | `basePrice` | Giá thay đổi |
| `data2` | `confirmedBookings` | `data2` không nói gì |
| `handleClick3` | `handleConfirmPayment` | |

## C6 — Tiền và ngày

| Luật | |
|---|---|
| Tiền lưu `DECIMAL(12,2)` trong DB, `number` (VNĐ nguyên) trong TS | Không `FLOAT` |
| Ngày lịch dùng chuỗi `YYYY-MM-DD` | Không dùng `Date` object để so sánh ngày |
| Timestamp dùng chuỗi ISO 8601 | |
| Tiền phòng tính **theo từng đêm** | `Σ giáMộtĐêm[ngày]`, không `giá × số đêm` |
| Khuyến mãi cộng dồn **nhân** | `1tr × 0.9 × 0.8`, không `1tr × (1−0.3)` |

`packages/core/src/pricing.ts` đã xử lý ngày bằng `Date.parse(\`${d}T00:00:00Z\`)`
và `getUTCDay()`. Đây là **cách đúng** cho ngày lịch không có giờ — không "sửa"
thành ép múi giờ GMT+7.

## C7 — Song ngữ ở tầng dữ liệu

Mọi chuỗi khách nhìn thấy đều mang dạng `{ vi, en }`:

```ts
/* ✅ */ name: { vi: 'Phòng gia đình', en: 'Family Room' }
/* ❌ */ name: 'Phòng gia đình'
```

Áp cả cho chuỗi lỗi, trạng thái rỗng, `aria-label`.

## C8 — Giọng viết: ngắn, chắc, hướng thực thi

| ❌ | ✅ |
|---|---|
| Có vẻ như không còn phòng | Hết phòng cho ngày đã chọn |
| Vui lòng thử lại sau | Không lưu được. Kiểm tra kết nối rồi bấm Lưu lại. |
| Bạn có chắc không? | Huỷ đơn NDH-20260820-0042? Khách được hoàn 50% (1.250.000đ). |

## C9 — Comment giải thích *vì sao*, không phải *cái gì*

```ts
/* ❌ */ // tăng bookedUnits lên 1
         inv.bookedUnits += 1

/* ✅ */ // Bump version cùng lúc để lần ghi sau phát hiện được xung đột
         // khi hai lễ tân cùng sửa một ngày (optimistic locking).
         inv.bookedUnits += 1
         inv.version += 1
```

Comment tiếng Việt cho code nghiệp vụ. Không comment code hiển nhiên.

## C10 — Không copy code

Cần dùng chung giữa hai theme của cùng domain → đẩy lên `packages/domain-hotel`.
Giữa hai domain → đẩy lên tầng nền, và phải gột sạch từ vựng ngành trước.

**Không bao giờ copy giữa các theme** — đó là thứ kiến trúc này sinh ra để loại bỏ.

## C11 — Không tối ưu sớm

Chạy đúng trước, nhanh sau. Tối ưu chỉ khi có số đo chứng minh chỗ đó chậm.

## C12 — Lệnh build

```bash
pnpm dev          # phát triển
pnpm build:safe   # build KHI dev server đang chạy  ← dùng cái này
pnpm build        # CHỈ khi đã tắt dev server
pnpm check        # lint + typecheck
pnpm free-ports   # giải phóng cổng 3000-3003 bị kẹt
```

⚠️ Chạy `pnpm build` khi dev server đang mở sẽ **giết dev server và kẹt cổng** —
cả hai cùng ghi vào `.next/`.

## C13 — Định nghĩa "xong" tối thiểu

Trước khi báo hoàn thành bất cứ việc gì:

- [ ] `pnpm lint` sạch
- [ ] `pnpm typecheck` sạch, không `any`
- [ ] `pnpm build:safe` xanh — **cả 4 theme**, không riêng theme đang sửa
- [ ] Không vi phạm ranh giới package (`architecture.md`)
- [ ] Dữ liệu mới có đủ `{vi, en}`
- [ ] Đã tự chạy thử đúng luồng, không chỉ đọc code suy ra

---

## Tự kiểm nhanh

```bash
# any
grep -rn ": any\|as any" apps/2026-thenamduhill/src packages/*/src

# hex ngoài tokens.css
grep -rn "#[0-9a-fA-F]\{3,8\}" packages/theme-*/src | grep -v tokens.css

# theme gọi thẳng tầng dữ liệu
grep -rn "getRooms\|buildQuote\|applyPromotions" packages/theme-*/src

# catch rỗng
grep -rn "catch {}\|catch (e) {}" apps packages
```

Cả bốn phải rỗng.
