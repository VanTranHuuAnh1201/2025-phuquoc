# PLAN FRONTEND — Release v1.0.1

> **Dành cho `ndh-fe`.** Đây là file duy nhất cần đọc để biết làm gì, theo thứ tự nào,
> và khi nào được coi là xong.
> BE có file riêng: [PLAN-BE.md](./PLAN-BE.md) — **không cần đọc file đó.**
>
> Bối cảnh chung: [OVERVIEW.md](./OVERVIEW.md) · Cách test: [TEST-STRATEGY.md](./TEST-STRATEGY.md)
> · Nợ thông tin: [MANUAL.md](./MANUAL.md)

**15 ticket FE.** Ước lượng: 4 đợt, mỗi đợt tối đa 3 ticket ở `process/` (luật R3).

---

## 0. Ba luật đọc trước khi gõ dòng code đầu tiên

### L1 — Hai ticket bắt đầu được NGAY, không phải chờ BE

`390-05` (M2 giá) và `390-07` (M4/M5 huỷ-hoàn tiền) — **BE của hai module đó đã ✅
từ v1.0.0**. Route đã chạy, đã có E2E xác nhận. Chỉ FE chưa nối.

Nghĩa là đợt 1 không phải ngồi chờ BE. Bắt đầu ngay từ hai ticket này.

### L2 — Chỉ nhận ticket khi ô BE trong MAP đã ✅

Với `390-02` và `390-04`, `430-02`, `420-03`: **không được** bắt đầu khi
`API_INTEGRATION_MAP.md` chưa ghi ✅ cho cột BE tương ứng.

`ndh-pm` gác cổng này. Bắt đầu sớm = code theo hợp đồng chưa chốt, rồi sửa lại.

### L3 — Nguyên tắc "không fallback về client"

Ba ticket của đợt 1 đều là **chuyển từ tính/ghi ở client sang gọi API**. Cám dỗ
lớn nhất là: *"API lỗi thì tạm dùng cách cũ cho mượt."*

**Cấm.** Đó chính là bug đang sửa. Thà báo lỗi rõ ràng còn hơn hiện số sai hoặc
ghi trạng thái chỉ tồn tại trên một máy.

---

## 1. Bảng công việc FE — 15 ticket

| # | Mã | Tên | Đợt | Chờ ô MAP | Phụ thuộc |
|:--:|---|---|:--:|:--:|---|
| 1 | `400-03` | Vitest + RTL: store & component thuần | **0** | — | — |
| 2 | `390-05` | `useQuote` gọi API báo giá (M2) | **1** | **BE ✅ sẵn** | — |
| 3 | `390-07` | Huỷ đơn + hoàn tiền + số tiền mất (M4/M5) | **1** | **BE ✅ sẵn** | — |
| 4 | `390-02` | Nối 4 màn danh mục (M9) | **1** | ⚠️ M9 cột BE | `390-01` |
| 5 | `390-04` | Nối trang `/lookup` (M11) | **1** | ⚠️ M11 cột BE | `390-03` |
| 6 | `410-01` | JSON-LD Hotel/HotelRoom/Offer/Breadcrumb/FAQ | **2** | — | `390-05` |
| 7 | `410-02` | hreflang vi/en + OG image động | **2** | — | `410-01` · ⚠️ `M29` |
| 8 | `410-03` | Article blog · sitemap lastmod · ISR | **2** | — | `410-01` |
| 9 | `430-02` | `ImageUploadField` kéo-thả nhiều ảnh | **3** | ⚠️ M8 cột BE | `430-01` |
| 10 | `420-03` | CMS màn "Tích hợp" | **3** | — | `420-02` |
| 11 | `430-03` | Editor paste sạch từ Word | **3** | — | `400-03` |
| 12 | `430-04` | Nút "Xem trước" trên theme H3 | **3** | — | `430-03` |
| 13 | `440-01` | Cắt bước 3 còn 5 field + autoComplete | **4** | — | `400-03` |
| 14 | `440-02` | Điền sẵn từ auth · "Đặt lại" từ đơn cũ | **4** | — | `440-01` |
| 15 | `440-03` | Mobile gộp bước 3+4, sticky CTA | **4** | — | `440-02` |

---

## 2. ĐỢT 0 — Hạ tầng test *(chặn phần lớn ticket sau)*

### `400-03` — Vitest + Testing Library

**Vì sao trước tiên**: 6 store Zustand đều có `persist`, mà `cart.store` phải
**giữ giỏ khi đi qua màn login** (luật F1). Logic đó hiện chỉ được E2E kiểm —
chậm, và khi đỏ thì không chỉ ra chỗ sai.

**Cấu trúc**

```
tests/unit/
  stores/{auth,cart,booking,notify,catalog,promotion}.store.test.ts
  format.test.ts               tiền · ngày · pick()
  components/{StatusBadge,Field}.test.tsx
```

> Lưu ý: repo có **`catalog.store.ts`** và `ticket.store.ts` — không phải
> `inventory.store` như tài liệu cũ ghi. Kiểm `ls src/stores/` trước khi viết.

**Chỉ tiêu: ≥30 case, ≥8 negative.**

**Năm case bắt buộc**

| Case | Kỳ vọng |
|---|---|
| `cart.store`: set giỏ → mô phỏng logout/login | **Giỏ còn nguyên** |
| `auth.store`: `logout()` | Xoá sạch, **không sót token trong localStorage** |
| Format ngày `'2026-08-20'` với `TZ=UTC` **và** `TZ=Asia/Bangkok` | Cả hai ra `20/08/2026` — không lệch múi giờ |
| `StatusBadge` cả 6 trạng thái đơn | Render **chữ**, không chỉ màu (luật D4) |
| `Field` `error` | Render **thông báo bằng chữ**, không chỉ đổi viền |

**Cách làm đúng**: `beforeEach` clear `localStorage` + reset store — không thì
state rò rỉ giữa các test. Không mock store đang test.

**Xong khi**: `pnpm test:unit` xanh **khi backend đang tắt** · ≥30 case · ≥8 negative

---

## 3. ĐỢT 1 — Vá API đỏ *(ưu tiên cao nhất)*

### 3.1 `390-05` — `useQuote` gọi API báo giá (M2) 🔴 · **bắt đầu ngay**

**Vấn đề đang có**: `src/stores/useQuote.ts` gọi `buildQuote()` của `@repo/core`
**chạy ở trình duyệt**. Đã xác nhận bằng code — dòng `return buildQuote({...})`
nằm trong `useMemo`.

**Hậu quả với chủ resort**: chị vào CMS tăng giá Bungalow ngày lễ từ 1.2tr lên
1.8tr. Khách vào web **vẫn thấy 1.2tr**, đặt phòng, rồi server chốt đơn 1.8tr.
Khách thấy một giá, trả một giá khác.

**Điểm quan trọng: công thức KHÔNG sai.** Nó nằm ở `packages/core` và đúng. Chỉ
sai **nơi chạy**. Ticket này đổi nơi chạy, **không đụng công thức**.

**Làm gì**

```
useQuote.ts:68   buildQuote({...})  →  fetch POST /api/availability/search
```

API đã có, trả `data.rooms[].{room, availability}` (MAP §M2).
⚠️ **Không có** `/api/pricing/quote` như tài liệu cũ ghi — dùng đúng 2 endpoint tồn tại.

**⚠️ KHÔNG xoá `buildQuote()` khỏi `packages/core`** — server vẫn dùng. Chỉ bỏ
lời gọi **từ trình duyệt**.

**Ba việc phải thêm vì giờ có độ trễ mạng**

| Việc | Yêu cầu |
|---|---|
| **Loading** | Skeleton cho breakdown, **giữ nguyên kích thước** — không nhảy layout (luật FE1) |
| **Debounce** | Khách đổi ngày liên tục không được bắn 10 request |
| **Error** | Thông báo bằng chữ + nút Thử lại |

**AC quan trọng nhất — bằng chứng chính của ticket**

> Sửa `priceOverride` trong CMS → **trang khách đổi theo**.

**Ba negative bắt buộc**

| Case | Kỳ vọng |
|---|---|
| `409` hết phòng | *"Hết phòng cho 20/8–22/8. Thử ngày khác hoặc giảm số khách."* — nói rõ phải làm gì (FE7) |
| **Mất mạng** | Lỗi bằng chữ + Thử lại. **KHÔNG rơi về `buildQuote()` client** — đó là quay lại đúng bug đang sửa |
| API trả giá khác giá đang hiện | **Lấy giá server**, hiện *"Giá đã cập nhật."* |

⚠️ *"Chỉ còn 3 phòng"* chỉ hiện khi `availableUnits` là **số thật từ API**. Cấm
bịa khan hiếm (luật FE13/P10 — dark pattern).

**Rủi ro**: đổi `useQuote` sang async có thể vỡ nhiều màn. **Đếm nơi dùng trước
khi sửa** — `ndh-sa` chốt ở mục 6 của ticket.

---

### 3.2 `390-07` — Huỷ đơn + hoàn tiền (M4/M5) 🟡 · **bắt đầu ngay**

**Vấn đề đang có**: 3 route BE đã ✅ nhưng FE chưa nối cái nào.

| Route | Tình trạng FE |
|---|---|
| `/cancel` | `CancelDialog` còn gọi store — chỉ ghi `localStorage` |
| `/cancel/quote` | Chưa nối |
| `/refund` | Chưa nối |

**Hệ quả kép**

1. **Huỷ đơn chỉ ghi `localStorage`** — badge đổi ngay nhưng **F5 quay lại trạng
   thái cũ**, máy lễ tân khác không thấy, tồn kho **không được nhả**.
2. **Nút huỷ không hiện số tiền mất.** `§F4` yêu cầu *"hiện rõ mất bao nhiêu tiền
   trước khi bấm"*. Khách bấm huỷ mà không biết mình mất bao nhiêu.

`common.md C8` lấy đúng ví dụ này:
> ❌ *"Bạn có chắc không?"* → ✅ *"Huỷ đơn NDH-20260820-0042? Khách được hoàn 50% (1.250.000đ)."*

**Luồng đúng**

```
Bấm [Huỷ đơn]
   │
   ├─ ① GET /cancel/quote     ← TRƯỚC khi hiện hộp thoại
   │
   ▼  ② hộp thoại hiện, ĐÃ CÓ SỐ
      Tổng đã thanh toán   1.273.725đ
      Huỷ trước 5 ngày → hoàn  50%
      Khách được hoàn        636.862đ
      Khách mất              636.863đ
      Lý do huỷ [__________]      ← bắt buộc, API cần
```

⚠️ **Hộp thoại không được hiện trước khi có số** — hiện rồi mới điền số là khách
kịp đọc con số rỗng rồi bấm.

**Ba AC quan trọng nhất**

| AC | Kỳ vọng |
|---|---|
| Huỷ xong **F5** | Vẫn là `cancelled` — trạng thái sống ở DB |
| Sau khi huỷ | **Tồn kho được nhả** — kiểm `availableUnits` trước/sau |
| Khách tự huỷ ở `/my-orders` | Thấy **cùng con số** như admin — cùng một API, không ai tính lại (luật R8) |

**Negative bắt buộc**: mất mạng lúc bấm xác nhận → lỗi bằng chữ + Thử lại,
**KHÔNG đánh dấu huỷ ở local**.

---

### 3.3 `390-02` — Nối 4 màn danh mục (M9) 🔴 · ⚠️ chờ `390-01`

**Đây là ticket nhạy cảm nhất của cả release.**

4 màn CMS đang đọc/ghi `catalog.store` có `persist(localStorage)`. Chủ resort
**có thể đã nhập dữ liệu thật** vào đó. Chuyển sang API mà không di trú là **xoá
công của chị**.

**Bước di trú bắt buộc — chạy một lần khi phát hiện dữ liệu cũ**

```
┌────────────────────────────────────────────────────────┐
│  ⚠ Phát hiện dữ liệu lưu trên máy này                  │
│                                                        │
│  5 hạng phòng · 3 gói giá đang lưu cục bộ, chưa được   │
│  đồng bộ lên máy chủ.                                  │
│                                                        │
│  [Tải lên máy chủ]   [Tải file sao lưu]   [Bỏ qua]    │
└────────────────────────────────────────────────────────┘
```

**Ba luật của di trú**

| # | Luật |
|:--:|---|
| 1 | Phải có **cả hai** nút: "Tải lên máy chủ" **và** "Tải file sao lưu" |
| 2 | Bấm **"Bỏ qua"** → dữ liệu cũ **vẫn giữ nguyên trong localStorage**, không xoá |
| 3 | Không bao giờ xoá localStorage trước khi tải lên thành công |

**Hai AC chứng minh ticket**

- Tạo hạng phòng ở máy A → **thấy ngay ở máy B**
- Hạng phòng tạo trong CMS → **hiện trên trang khách** (`/h3/rooms`) — không chỉ kiểm CMS

**Xử lý lỗi theo luật FE4**: `401` → `/login?next=` · `403` → *"Tài khoản của bạn
không có quyền thực hiện thao tác này."* (lễ tân thấy đúng câu này) · `409` xoá
hạng còn đơn → nói rõ còn bao nhiêu đơn.

**Rủi ro**: `grep` mọi nơi dùng `catalog.store` **trước khi** bỏ `persist` — có
thể màn khác cũng đọc.

---

### 3.4 `390-04` — Nối trang `/lookup` (M11) 🔴 · ⚠️ chờ `390-03`

**Vấn đề đang có**: `/lookup` gọi `GET /api/bookings?code=&phone=` — route bọc
`withAuthGuard` nên khách chưa đăng nhập nhận **401**. Tính năng coi như không có.

**Làm gì**: đổi sang `/api/bookings/lookup` (`390-03` đã tạo).

**Điều quan trọng nhất — thông báo lỗi phải MƠ HỒ có chủ đích**

```
Sai mã  →  "Không tìm thấy đơn khớp mã và số điện thoại đã nhập. Kiểm tra lại giúp bạn."
Sai SĐT →  "Không tìm thấy đơn khớp mã và số điện thoại đã nhập. Kiểm tra lại giúp bạn."
              ↑ CÙNG MỘT CÂU — không được nói rõ cái nào sai
```

Nói rõ "sai SĐT" là **lộ mã đơn nào có thật**.

Xử lý `429`: *"Bạn đã tra cứu quá nhiều lần. Thử lại sau ít phút."*

**Trên điện thoại**: ô SĐT phải có `autoComplete="tel"` + `inputMode="tel"` — bấm
vào hiện **bàn phím số**.

**AC bảo mật**: **không render** dữ liệu nhạy cảm (CCCD, ghi chú nội bộ) — kể cả
khi API lỡ trả. FE chỉ render field cần, không đổ nguyên object.

---

## 4. ĐỢT 2 — SEO

### 4.1 `410-01` — JSON-LD *(sau `390-05`)*

**Vì sao phải sau `390-05`**: `Offer.price` phải là **giá thật**. Nếu M2 chưa nối
thì FE còn đọc seed cục bộ → JSON-LD khai **giá sai lên Google**, và giá sai trên
kết quả tìm kiếm là thứ Google trừng phạt.

**Lỗ hổng hiện tại, đo được**: `grep -rn "schema.org" apps/2026-thenamduhill/src`
→ **rỗng**. Không có một dòng structured data nào.

Khách tìm *"resort Nam Du"*: Booking.com hiện **giá + sao + ảnh**, site của chị
hiện **link trần**. Google không thiếu thông tin — nó thiếu **cách đọc**.

**Làm gì**

```
packages/domain-hotel/src/seo/json-ld.ts    ← ĐẶT Ở ĐÂY, không phải packages/utils
apps/.../src/components/JsonLd.tsx
```

⚠️ **Ranh giới package**: hàm sinh JSON-LD nhắc "phòng", "hạng phòng", "giá đêm"
→ thuộc `domain-hotel` (luật R15). Đặt vào `utils` là vi phạm.

⚠️ Theme **không** gọi thẳng repository (luật R13) — dữ liệu vào qua props từ tầng app.

| Schema | Đặt ở | Mục đích |
|---|---|---|
| `Hotel` | Trang chủ mỗi theme | name, address, geo, image, telephone, priceRange |
| `HotelRoom` + `Offer` | Chi tiết hạng phòng | **Để Google hiện giá** |
| `BreadcrumbList` | Trang có breadcrumb | Thay URL dài bằng đường dẫn đọc được |
| `FAQPage` | **Chỉ trang thật sự có FAQ** | Nhồi vào mọi trang = spam structured data |

**Negative bắt buộc**: hết phòng → `availability: 'SoldOut'` · thiếu dữ liệu →
**bỏ field**, không xuất `null`/`undefined` vào JSON-LD.

**Bằng chứng**: ảnh chụp Google Rich Results Test **0 lỗi** cho trang chủ + 1 trang phòng.

---

### 4.2 `410-02` — hreflang + OG image · ⚠️ **BỊ CHẶN**

> **Ticket này KHÔNG được chuyển sang `process/` khi `M29` còn ⏳.**

Repo đang có **hai giá trị mâu thuẫn**: MANUAL v1.0.0 ghi `thenamduhill.com`,
`DEPLOY.md` ghi `thenamduhillresort.com`. Mà `thenamduhill.com` là **website cũ
của chị đang chạy** — trỏ nhầm là làm sập site đang sống.

`hreflang`/`canonical` trỏ sai tên miền **còn tệ hơn không khai**: Google index
tên miền không ai truy cập, mọi tín hiệu SEO dồn vào đó.

Đây là ngoại lệ hợp lệ của W0b — **không có giá trị mặc định nào an toàn**.

**Khi được mở khoá**: `site-url.ts` **phải throw** nếu thiếu env (luật C4) — không
fallback thầm về localhost, vì đó là cách canonical sai lọt lên production.

**Bẫy kỹ thuật**: `ImageResponse` của `next/og` cần font có **đủ glyph tiếng
Việt**. Kiểm bằng chuỗi `ữ ằ ợ ẫ ỹ` — dấu vỡ trên ảnh chia sẻ là lỗi nhìn thấy ngay.

---

### 4.3 `410-03` — Article · sitemap lastmod · ISR

Chị đã ghi nhận *"Trang web đều đạt, nhanh"*. Ticket này **giữ nó nhanh khi giá
thay đổi hằng ngày** — khó hơn nhanh lúc mới build.

| Việc | Điểm dễ sai |
|---|---|
| `Article` cho blog | `dateModified` phải **đổi thật** khi sửa bài, không cứng bằng `datePublished` |
| `sitemap.ts` thêm `lastmod` | Lấy từ **`updated_at` thật của DB**, không phải thời điểm build — build thì mọi URL cùng ngày, Google mất tín hiệu |
| Sitemap | **Không được chứa** `/my-orders`, `/admin/**`, `/booking` |
| ISR trang phòng | `revalidate` khai rõ số giây, không `force-dynamic` |
| `/api/revalidate` | **Phải có `requirePermission`** — không thì người lạ làm cạn cache |

---

## 5. ĐỢT 3 — Nội dung & tích hợp

### 5.1 `430-02` — `ImageUploadField` *(chờ `430-01`)*

File `ImageUploadField.tsx` đang có trong working tree — **hoàn thiện, không viết lại**.

**AC dễ bỏ sót nhất**

> Sắp xếp lại thứ tự bằng kéo — **và bằng bàn phím** (luật FE11).

Nhiều thư viện kéo-thả **không** hỗ trợ bàn phím. **Chốt thư viện ở mục 6 TRƯỚC
khi code** — phát hiện sau là phải làm lại.

**Mobile là thiết kế riêng**: kéo-thả không dùng được trên cảm ứng → nút "Chọn
ảnh" mở thẳng thư viện điện thoại. Không phải `flex-direction: column`.

**Alt song ngữ bắt buộc** VI + EN mỗi ảnh — thiếu thì cảnh báo (luật D4).

**Đo thật**: ảnh 8MB từ điện thoại → xong **dưới 10 giây**, có tiến trình suốt quá trình.

---

### 5.2 `420-03` — CMS màn "Tích hợp" *(chờ `420-02`)*

Màn chị mở khi nghi ngờ *"lịch trên Airbnb sao chưa khoá"*.

Bảng theo **đủ format §F6**: tiêu đề + đếm · ô tìm · bộ lọc + nút Đặt lại · chọn
nhiều · header in hoa `scope="col"` · phân trang "Hiển thị x–y trong z".

**Badge trạng thái có CHỮ**, không chỉ màu. Số liệu canh phải `tabular-nums`.

**Không cho sửa `payload`** — outbox là bản ghi sự kiện, chỉ đọc.

**Negative**: lễ tân → **không thấy menu**, gọi API trực tiếp → **403** (bảo mật 2 lớp).

**Rủi ro**: 1.200 dòng outbox → phân trang **server-side**, không tải hết rồi lọc ở client.

---

### 5.3 `430-03` → `430-04` — Editor + Xem trước

**`430-03` — paste sạch từ Word**

Hai kịch bản hiện tại đều tệ: paste vào `<textarea>` mất sạch định dạng; paste vào
rich text không lọc thì tha theo `<span style="mso-…">` của Word — **phá design
system** (luật P0/FE2).

Đúng ở giữa: **giữ cấu trúc, bỏ hình thức**.

Whitelist (không blacklist — blacklist luôn thiếu):
`p · br · strong · em · u · h2 · h3 · ul · ol · li · a[href] · blockquote`

**AC quan trọng nhất của ticket**

> **Lọc CẢ Ở SERVER khi lưu**, không chỉ ở client.

Client bị bỏ qua được — POST HTML bẩn thẳng vào API là XSS lọt. Test: POST
`<script>alert(1)</script>` vào API → lưu ra phải sạch.

⚠️ `sanitize.ts` đặt ở `packages/core` → **không JSX, không CSS**, chạy được Node
thuần (luật R2/BE9) vì server cũng dùng.

⚠️ **Không tự viết sanitizer** — dùng thư viện đã kiểm chứng (nguyên tắc BE12).
Tự viết là cách kinh điển để lọt XSS.

**`430-04` — Xem trước**

Render nội dung nháp bằng **theme H3 thật**, không phải khung admin — nếu dùng
khung admin thì ticket này vô nghĩa, chị vẫn phải đoán.

**Bảo mật 2 lớp**: `robots.ts` chặn `/preview/**` **và** meta `noindex,nofollow`.
Nội dung nháp lọt Google là duplicate content với bản đã đăng.

Token **≥128 bit ngẫu nhiên**, không id tăng dần. Hết hạn 24h, tự dọn.

---

## 6. ĐỢT 4 — Luồng đặt phòng mobile

Theo **Đ2**: giảm thao tác bằng **cắt field + autofill**, không bằng OCR. Lý do
đầy đủ ở [OVERVIEW §5](./OVERVIEW.md).

### 6.1 `440-01` — Cắt bước 3 từ 7 → 5 field

Trạng thái hiện tại đo từ `app/booking/page.tsx:1159-1240`:

| Field | Giữ? |
|---|---|
| Họ tên · SĐT · Email | ✅ giữ (đã có `autoComplete` đúng) |
| **CCCD (`idNumber`)** | **BỎ** → chuyển sang form check-in |
| **Giờ đến dự kiến** | **BỎ khỏi form chính** → gộp vào "Yêu cầu đặc biệt" |
| Yêu cầu đặc biệt | ✅ giữ |
| Hoá đơn VAT | ✅ giữ (đã ẩn sau checkbox — đúng) |

⚠️ **KHÔNG xoá `idNumber` khỏi DB/type/API.** Lễ tân vẫn nhập lúc check-in — đó
là chỗ nó thuộc về. Chỉ bỏ khỏi **form khách**.

Hint "Yêu cầu đặc biệt" phải nhắc giờ tàu (song ngữ): *"Trăng mật, sinh nhật, ăn
chay, hoặc giờ tàu dự kiến từ Rạch Giá — lễ tân cần biết trước."*

**Đo trên điện thoại THẬT, không DevTools**

- Bấm vào SĐT → hiện **bàn phím số**
- **≥3 field autofill** được từ danh bạ/Keychain bằng **một lần chọn**

---

### 6.2 `440-02` — Điền sẵn từ tài khoản

Đưa **khách quay lại xuống 0 field**. Khách đã đăng nhập bắt buộc trước bước 3
(luật F1) nên hệ thống đã có tên, SĐT, email — không điền sẵn là bắt gõ lại thứ
mình đã biết.

**Thứ tự ưu tiên — không được sai**

```
① Khách đang gõ dở (cart.store)     ← cao nhất, KHÔNG BAO GIỜ ghi đè
② Thông tin đơn gần nhất
③ Thông tin tài khoản (auth.store)
④ Trống
```

Ghi đè cái khách đang gõ là lỗi phổ biến nhất của prefill và là thứ làm mất niềm
tin nhanh nhất.

**Nói rõ nguồn**: *"Lấy từ tài khoản của bạn. Sửa được."*

**"Đặt lại"**: sao chép hạng phòng + gói + thông tin khách, **không sao chép ngày cũ**.

---

### 6.3 `440-03` — Mobile gộp bước 3+4

Sau `440-01`/`440-02`, bước 3 còn **5 field (khách mới) hoặc 0 (khách quay lại)**,
bước 4 là **3 lựa chọn thanh toán** (Đ1). Cộng lại **ngắn hơn một màn hình điện
thoại** — giữ 2 trang riêng là bắt bấm thêm một lần không có lý do.

**Chỉ gộp trên mobile.** Desktop giữ 2 bước — ở đó có chỗ cho sidebar giá dính bên phải.

⚠️ **Stepper phải đổi theo**: mobile hiện **3 bước**. Để 4 bước mà chỉ có 3 trang
là nói dối với khách.

**Kiểm trên điện thoại thật**: bàn phím **không che sticky CTA** khi gõ field cuối.
DevTools không mô phỏng được việc này.

**Mặc định `at-property`** (thanh toán trực tiếp) theo Đ1.

---

## 7. Lịch — 4 đợt

```
ĐỢT 0  400-03                              (độc lập, không chờ BE)

ĐỢT 1  390-05 ─┐ bắt đầu NGAY, BE đã ✅
       390-07 ─┘
       390-02   ← chờ MAP M9  cột BE ✅
       390-04   ← chờ MAP M11 cột BE ✅

ĐỢT 2  410-01 → 410-02 → 410-03            (410-01 sau 390-05)
                  ↑ 410-02 bị M29 chặn

ĐỢT 3  430-02 (chờ 430-01) · 420-03 (chờ 420-02)
       430-03 → 430-04

ĐỢT 4  440-01 → 440-02 → 440-03            (chuỗi tuần tự)
```

Tối đa **3 ticket ở `process/`** cùng lúc.

---

## 8. Checklist chung mọi ticket FE

Trước khi báo xong bất kỳ ticket nào:

- [ ] `pnpm test:unit` xanh, có **≥1 negative test**
- [ ] `pnpm lint` + `pnpm typecheck` sạch, **0 `any`**
- [ ] `pnpm build:safe` xanh **cả 4 theme** *(không dùng `pnpm build` khi dev server đang chạy)*
- [ ] Đủ **7 trạng thái UI**: default · hover · focus-visible · active · disabled · loading · error
- [ ] `loading` **giữ nguyên kích thước** — không nhảy layout
- [ ] `error` có **thông báo bằng chữ**, không chỉ đổi màu; vùng lỗi có `aria-live="polite"`
- [ ] **Không `outline: none`** ở đâu cả
- [ ] **0 hex ngoài `tokens.css`**; spacing/radius lấy từ token
- [ ] **Song ngữ toàn bộ** kể cả lỗi, trạng thái rỗng, `aria-label`, `alt`
- [ ] Trạng thái rỗng **nói rõ phải làm gì** (luật FE7)
- [ ] **Mobile 375px**: không cuộn ngang · target ≥24px · CTA ≥44px · bảng đổi **thẻ**
- [ ] Icon **SVG** (`lucide-react`), **không emoji**
- [ ] `<label>` gắn đúng — click label phải focus vào input
- [ ] **Không sửa SQL, Route Handler, migration**
- [ ] **Cột FE trong MAP → ✅**

---

## 9. Khi gặp vấn đề

| Tình huống | Làm gì |
|---|---|
| Ô BE trong MAP chưa ✅ | **Không bắt đầu.** Báo `ndh-pm` |
| API trả khác hợp đồng `api-contracts.ts` | Mở `900-*`. `ndh-sa` phân xử — **không tự sửa để khớp** |
| Muốn fallback về cách cũ khi API lỗi | **Cấm** — đó là bug đang sửa. Báo lỗi rõ ràng thay vì hiện số sai |
| Đổi `useQuote` sang async làm vỡ màn khác | Đếm nơi dùng **trước khi** sửa. Test tầng 3 cho store trước |
| Thư viện chọn không hỗ trợ bàn phím | Chốt lại ở mục 6 **trước khi code**, không sửa sau |
| Thiếu thông tin từ chủ dự án | **KHÔNG dừng** — ghi MANUAL.md, dùng mặc định, chạy tiếp (W0b). *Trừ `M29` chặn `410-02`* |
