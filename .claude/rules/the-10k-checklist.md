# Rules — The $10K Checklist

8 thứ phân biệt website $10K với website $200 — chuyển thành **luật kiểm chứng
được** cho dự án này. Đây là **cổng chất lượng (quality gate)**: một theme/trang
chưa qua đủ 8 mục thì chưa được coi là xong, dù lint sạch và build xanh.

Quan hệ với các rules khác: file này KHÔNG thay thế
[design-tokens.md](./design-tokens.md) hay [app-flows.md](./app-flows.md) —
nó là tầng "gu thẩm mỹ + cảm giác đắt tiền" đặt lên trên. Xung đột thì luật
cũ thắng (token D2 đã chốt, section id R7 đã chốt).

---

## K0 — Giao thức đặt câu hỏi TRƯỚC khi phác thảo

### K0.0 — Brief & kickoff

Mỗi khách một brief tại `resources/docs/briefs/<tên-khách>.md` (mẫu:
`_template.md`). Khi user gõ *"Khởi động theo brief …"* hoặc đưa kickoff
inline, phải theo các quy tắc:

- **Website hiện tại** của khách = *hợp đồng chức năng* — remake phải đầy đủ
  chức năng như nó (teardown xuất parity checklist); **website recommend** =
  *tham chiếu thẩm mỹ*. Không rõ URL nào vai nào → hỏi, không đoán.
- **Folder crawl** quy ước tại `resources/scripts/crawl/output/<tên-khách>/`.
  Chưa có / không rõ → **hỏi user** crawl site nào hay nhận link bản có sẵn —
  không tự ý crawl.
- Review/comment của khách hàng cuối **không crawl** (chính sách nền tảng) —
  social proof chỉ lấy từ tư liệu khách cung cấp, không bịa số liệu.
- Trường brief ghi `chưa có` → hỏi đúng trường đó; trường đã điền không hỏi lại.

Hướng dẫn vận hành đầy đủ cho người dùng: `resources/docs/CLAUDE-GUIDE.md`.

Tự động hoá không có nghĩa là đoán mò. Trước khi `conversion-blueprint` xuất
tài liệu, phiên chính **bắt buộc hỏi user** (AskUserQuestion) những điều dưới
đây NẾU chưa có trong context/teardown — mỗi mục một câu, có phương án gợi ý:

| # | Phải làm rõ | Vì sao không được tự bịa |
|---|---|---|
| Q1 | **Design direction** khách muốn: editorial / dark-luxury / tropical-minimal / retro-modern…? (kèm mẫu tham chiếu nếu có) | K1 — point of view là quyết định của khách trả tiền, không phải của AI |
| Q2 | **Nguồn ảnh**: khách có bộ ảnh chụp thật chưa? Nếu chưa — dùng ảnh sinh theo art direction hay chờ chụp? | K5 + R9 — ảnh crawl không được lên production |
| Q3 | **Nội dung thật**: tên phòng, giá, chính sách đã có bản chính thức chưa hay dùng placeholder có đánh dấu? | R9/F8 — nội dung crawl làm hại SEO chính mình |
| Q4 | **Mức độ chuyển động**: khách thích tĩnh sang trọng hay có scroll effect? | K6 — motion là thứ dễ làm lố nhất |
| Q5 | Có **brand asset** sẵn (logo, font đã mua, màu nhận diện) phải tôn trọng không? | K2/K3 — font display có thể tốn license |

Trả lời xong mới chạy blueprint. Câu nào user đã trả lời ở phiên trước / đã
ghi trong teardown thì **không hỏi lại** (nguyên tắc CLAUDE.md).

---

## K1 — Point of view, không phải template

Site phải cam kết MỘT hướng thẩm mỹ cụ thể và theo đến cùng.

- Blueprint phải ghi rõ **một câu định vị thẩm mỹ** cho theme (ví dụ:
  *"tropical editorial — ảnh full-bleed, chữ serif display lớn, nhiều khoảng
  thở"*) và mọi quyết định sau đó đối chiếu với câu này.
- **Kiểm:** nhìn 3 section bất kỳ phải thấy cùng một "giọng" thị giác. Nếu một
  section có thể cắm sang website khách sạn bất kỳ mà không lạc lõng → đang là
  template, chưa đạt.
- 4 theme H1–H4 phải có 4 point of view **phân biệt được bằng mắt trong 3
  giây** trên trang hub — đây chính là sản phẩm đang bán ("N giao diện").

## K2 — Typography phải làm việc

- Cặp font **display + body** rõ ràng; cấm mặc định Inter/Roboto/Arial cho
  sản phẩm mới. (Token đã chốt: H1 Plus Jakarta Sans, H2–H4 Figtree — đạt;
  theme mới phải chọn có chủ đích và khai trong `tokens.css`.)
- Hierarchy do **scale + weight** đảm nhiệm, không do màu mè.
- **Kiểm:** font có subset tiếng Việt đầy đủ (dấu không vỡ, không fallback
  giữa câu); headline không dùng cỡ ngoài thang `--font-size-*` (D5).

## K3 — Hệ màu kiềm chế

- 3–5 màu dùng nhất quán; sang trọng đến từ tiết chế, không từ trang trí.
- **Kiểm:** đếm hex trong `tokens.css` — vai trò nào ngoài bộ D1 phải có lý
  do; không hex nào ngoài `tokens.css` (D0); CTA phẳng, không gradient (D5).

## K4 — Hierarchy có khoảng thở

- Mỗi màn hình có primary / secondary / tertiary rõ — người xem biết nhìn đâu
  mà không phải cố.
- **Kiểm:** squint test — nheo mắt nhìn trang, phải nổi lên đúng 1 điểm chính
  mỗi viewport; mỗi trang đúng MỘT CTA chính (M2); không "bức tường nội dung
  phẳng" — section dài phải có nhịp (xen kẽ layout, ảnh, số liệu).

## K5 — Ảnh có chủ đích

- Cấm ảnh Unsplash generic ai cũng thấy rồi. Với resort: ảnh chụp thật của
  khách > ảnh sinh đúng art direction > curation chặt tay. Ảnh crawl
  (thenamduhill/Travlla) tuyệt đối không lên production (R9).
- **Kiểm:** mọi ảnh cùng một tông (màu, ánh sáng, độ bão hoà); ảnh hero phải
  "bán" được cảm giác ở đó (với Nam Du: biển, tàu, bình minh đảo — không
  phải stock "hotel room" vô danh); mọi ảnh có `alt` (D4).

## K6 — Motion thì thầm

- Micro-interaction và scroll behavior phải như làm tay — không "AOS fade-up
  slop" gắn đại trà mọi section.
- **Kiểm:** mỗi animation trong blueprint có lý do định hướng chú ý (đã bắt
  buộc ở conversion-blueprint); duration lấy từ `--motion-*`; tôn trọng
  `prefers-reduced-motion`; bar đánh giá — designer nhìn vào gật đầu, không
  đảo mắt. Nghi ngờ thì bỏ hiệu ứng.

## K7 — Mobile được THIẾT KẾ, không phải bị nén

Đây là chỗ 90% site rẻ tiền sụp đổ — và repo này đã có tiền lệ tốt
(commit "feat: mobile first").

- **Kiểm:** với mỗi section, blueprint phải mô tả layout mobile **khác biệt
  có chủ đích** (không chỉ "stack dọc lại"): booking bar thành sticky bottom
  bar; bảng đổi thành thẻ dưới 640px (F6 — cấm cuộn ngang bảng); vùng chạm
  ≥44px cho CTA, ≥24px mọi target (D4); hero mobile có thông điệp + ô tìm
  trong viewport đầu, không bắt cuộn mới thấy.

## K8 — Thứ đắt tiền vô hình

Người xem không thấy trực tiếp nhưng CẢM được "site này nhanh và chạy đúng".

- **Kiểm — có số, không khẩu hiệu:**
  - Load < 2s (LCP): `next/image` AVIF/WebP, font `display: swap`, đo
    Lighthouse và ghi số vào PR
  - WCAG AA: tương phản ≥ 4.5:1 chữ thường, ≥ 3:1 chữ lớn/focus ring — đo và
    ghi (D4)
  - Tab qua toàn bộ luồng đặt phòng không mất focus, không bẫy
  - HTML ngữ nghĩa: landmark, heading đúng cấp, `<th scope>`, form có label
  - `generateMetadata()` riêng từng trang, Schema.org Hotel/HotelRoom/Offer,
    hreflang vi/en (F8)

---

## Vị trí trong quy trình

```
Khách gửi mẫu / yêu cầu
  → ① website-teardown        (chấm luôn mẫu của khách theo K1–K8 ở Lớp 5)
  → ② customer-mindset         (nỗi đau, lời từ chối)
  → K0: hỏi user các câu chưa rõ  ← CHỐT: không đoán
  → ③ conversion-blueprint     (blueprint phải có mục "K-check": tự đối chiếu K1–K8)
  → thực thi (frontend-design / ui-ux-pro-max / Figma nhận blueprint)
  → nghiệm thu: K1–K8 + tự kiểm của design-tokens.md
```

## Tự kiểm trước khi báo xong

- [ ] Đã hỏi user đủ các câu K0 còn thiếu, không tự bịa direction/ảnh/nội dung
- [ ] Theme nêu được point of view một câu, 3 section cùng giọng
- [ ] Không font/màu/cỡ ngoài token; CTA phẳng
- [ ] Squint test: mỗi viewport một điểm nhìn chính
- [ ] Không ảnh generic/crawl trên đường production
- [ ] Mỗi animation có lý do; tôn trọng reduced-motion
- [ ] Mobile có quyết định layout riêng từng section
- [ ] Có số đo: LCP, tương phản, Lighthouse — ghi vào PR
