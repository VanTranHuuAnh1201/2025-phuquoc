# Nút cuộn ‹ › + fade mép cho dải "Hạng phòng nổi bật"

Ngày: 2026-08-05 · Theme: `packages/theme-h7` · Section: `rooms`

---

## 1. Vấn đề

Trên desktop, dải hạng phòng ở trang chủ đặt `grid-auto-columns` sao cho **đúng 4
thẻ vừa khít container** ([Rooms.tsx:269](../../../packages/theme-h7/src/sections/Rooms.tsx)).
Từ phòng thứ 5 trở đi vẫn cuộn được, nhưng **không có tín hiệu thị giác nào cho
biết điều đó**: mép phải cắt gọn đúng biên container, trông như một lưới 4 cột
đã hết nội dung.

Hệ quả: người dùng desktop không biết còn phòng để xem. Trên mobile không có vấn
đề này — thẻ rộng `78vw` nên luôn lộ mép thẻ kế tiếp, bản thân nó đã là lời mời
vuốt.

## 2. Phạm vi

| | |
|---|---|
| Sửa | `packages/theme-h7/src/sections/Rooms.tsx` + 1 file client component mới |
| Không sửa | `packages/core`, `packages/ui`, mọi theme khác |
| Không sửa | `Dining.tsx`, `Places.tsx`, `Gallery.tsx` — dùng cùng pattern rail nhưng nằm ngoài phạm vi lần này |
| Không thêm | dependency mới, hex mới ngoài `tokens.css` |

Section này dùng chung cho mọi app import `@repo/theme-h7`. Hiện có hai app dùng:
`apps/2026-thenamduhillresort` (cổng 3003) và `apps/2026-thenamduhill` (route
`[theme]`). Thay đổi áp cho cả hai — đúng chủ đích "1 nguồn, N render".

Ba section rail còn lại của h7 tạm thời sẽ **không đồng nhất** với Rooms. Đây là
đánh đổi có ý thức để thấy kết quả sớm; nhân rộng sau nếu ưng.

## 3. Thiết kế

### 3.1 Bố cục header

```
┌─ container ──────────────────────────────────────────┐
│ HẠNG PHÒNG NỔI BẬT               ‹ ›  Xem tất cả → │
└──────────────────────────────────────────────────────┘
```

Nút cuộn đặt **trước** link "Xem tất cả phòng", cùng hàng.

Lý do đặt trước, không phải sau: đọc trái→phải, `‹ ›` là điều khiển *tại chỗ*
(cuộn trong section) còn "Xem tất cả phòng →" là điều hướng *rời trang*. Hành
động rời trang nằm cuối, sát mép. Nếu để `‹ ›` sau, mũi tên `→` của link bị kẹp
giữa hai cụm mũi tên khác — đọc rối và dễ bấm nhầm.

Link "Xem tất cả phòng" **giữ nguyên hành vi hiện tại**: điều hướng sang trang
danh sách phòng (`themePath(slug, 'rooms')`). Không đổi đích, không đổi nhãn.

### 3.2 Nút cuộn

| Thuộc tính | Giá trị |
|---|---|
| Kích thước | 32×32px — đạt target chạm ≥24px (luật D4 / WCAG 2.2 §2.5.8) |
| Hình dạng | tròn, viền `1px var(--border)`, nền `var(--surface)` |
| Icon | chevron SVG `currentColor`, **không** dùng ký tự `‹ ›` hay emoji (luật D5) |
| Hiển thị | `display: none` dưới 960px; hiện từ `min-width: 960px` |
| `aria-label` | song ngữ — VI "Xem các phòng trước/tiếp theo", EN "Previous/Next rooms" |

Ẩn trên mobile vì vuốt chạm đã là cách tương tác tự nhiên, và 960px đúng là
breakpoint nơi rail chuyển sang bố cục 4-thẻ-vừa-container.

Bấm nút cuộn đi **một bề rộng thẻ + gap**, dùng
`scrollBy({ left: ±step, behavior: 'smooth' })`. Không cuộn cả trang.

### 3.3 Bảy trạng thái (luật D3)

| Trạng thái | Xử lý |
|---|---|
| `default` | viền `--border`, icon `--text` |
| `hover` | nền `--brand`, icon trắng, chuyển trong 150ms |
| `focus-visible` | `outline: 2px solid var(--brand)`, `outline-offset: 2px` |
| `active` | `transform: translateY(1px)` |
| `disabled` | ở đầu/cuối rail — `opacity` giảm, `cursor: not-allowed`, `aria-disabled="true"`, không nhận bấm |
| `loading` | không áp dụng — thao tác đồng bộ, không có độ trễ |
| `error` | không áp dụng — cuộn không thể thất bại |

Hai trạng thái cuối ghi rõ "không áp dụng" thay vì bỏ trống, để lần review sau
không phải đoán là quên hay cố ý.

### 3.4 Fade hai mép

Lớp phủ gradient trên `.h7-rooms-rail`, rộng ~48px, `pointer-events: none`,
gradient chạy về `var(--surface)` — trùng nền section nên hoà liền, không lộ vệt.

**Có điều kiện**, không cố định:

- mép phải hiện khi **còn cuộn được sang phải**
- mép trái hiện khi **đã rời khỏi vị trí đầu**

Fade cố định sẽ vẫn mờ khi đã cuộn hết — trông như lỗi render.

Chỉ hiện từ 960px trở lên, cùng breakpoint với nút. Dưới ngưỡng đó mép thẻ kế
tiếp đã đủ làm tín hiệu.

### 3.5 Cấu trúc component

`Rooms.tsx` hiện **không có** `'use client'`. Theo dõi vị trí cuộn cần
`useRef` + `useState` + listener `scroll`/`resize` — bắt buộc client.

Quyết định: **giữ `Rooms.tsx` là server component**, tách vỏ rail thành một
client component riêng nhận `children`:

```
Rooms.tsx                 (server) — data, thẻ phòng, style
  └─ RoomsRail.tsx        (client) — 'use client', ref, nút, fade
       └─ {children}      thẻ phòng render từ server, truyền xuống nguyên vẹn
```

Lý do: `apps/2026-thenamduhillresort/src/app/page.tsx` đã có `'use client'` ở
dòng 1, nên ở app đó cả cây vốn là client — tách hay không, không khác gì.
Nhưng `apps/2026-thenamduhill` render theme qua route `[theme]` **không** đánh
`'use client'`. Đánh thẳng lên `Rooms.tsx` sẽ kéo toàn bộ thẻ phòng sang client
ở app đó, phá SSG/ISR mà luật F8 yêu cầu cho trang nội dung.

Tách vỏ giữ cho cả hai app cùng đúng, chi phí ~60 dòng.

### 3.6 Cách phát hiện biên rail

Đọc `scrollLeft`, `scrollWidth`, `clientWidth` của phần tử rail:

- ở đầu: `scrollLeft <= 1`
- ở cuối: `scrollLeft + clientWidth >= scrollWidth - 1`

Dung sai 1px vì trình duyệt làm tròn `scrollLeft` thành số lẻ khi trang được
phóng to (zoom), khiến so sánh `=== 0` không bao giờ đúng.

Cập nhật khi: `scroll` (có throttle qua `requestAnimationFrame`), `resize`, và
một lần khi mount.

## 4. Khả năng tiếp cận

- Nút là `<button type="button">` thật, không phải `<div>` — vào được bằng Tab
- `aria-label` song ngữ, mô tả rõ hành động (luật D5: cấm nhãn mơ hồ)
- Rail có `tabIndex={0}` + `role="group"` + `aria-label` để người dùng bàn phím
  cuộn được bằng phím mũi tên mà không cần chuột
- Fade `pointer-events: none` — không chặn bấm vào thẻ nằm dưới
- Nút disabled dùng `aria-disabled` thay vì thuộc tính `disabled`, để screen
  reader vẫn đọc được và focus không bị nhảy cóc

## 5. Định nghĩa xong

- [ ] Desktop ≥960px: thấy `‹ ›`, bấm cuộn mượt đúng một thẻ
- [ ] Nút trái disabled khi ở đầu, nút phải disabled khi ở cuối
- [ ] Fade phải tắt hẳn khi cuộn tới cuối; fade trái chỉ hiện sau khi rời đầu
- [ ] Mobile <960px: không thấy nút, không thấy fade, vuốt chạm như cũ
- [ ] "Xem tất cả phòng" vẫn sang trang danh sách phòng
- [ ] Tab tới được cả hai nút, viền focus rõ
- [ ] `pnpm lint` + typecheck sạch
- [ ] Cả N theme còn build được (luật R5 / §7.3)
- [ ] Không có hex nào ngoài `tokens.css` (luật D0)

## 6. Ngoài phạm vi

- Nhân rộng sang `Dining`, `Places`, `Gallery` của h7
- Tách `<ScrollRail>` dùng chung vào `packages/ui` cho N theme
- Dọn dead code trong `apps/2026-thenamduhillresort/src/components/home/`
  (`RoomsSection.tsx`, `ContactCtaSection.tsx`, `DiningSection.tsx`,
  `ExploreSection.tsx`, `WhyUsSection.tsx` — không file nào được import)

Ba mục này đáng làm, nhưng là việc riêng.
