# Brief — <tên khách hàng>

> Copy file này thành `<tên-khách>.md` cùng thư mục, điền rồi đưa cho Claude:
> `Khởi động theo brief resources/docs/briefs/<tên-khách>.md`
> Trường nào chưa có ghi `chưa có` — Claude sẽ hỏi lại đúng trường đó,
> không tự bịa.

## Nguồn website

| Trường | Giá trị |
|---|---|
| Website khách hàng hiện tại | `https://thenamduhill.com` |
| Website khách yêu thích (recommend) | `https://2025-phuquoc.vercel.app/vi` |
| Folder crawl | `resources/scripts/crawl/output/thenamduhillresort/` |
| Folder ảnh khách cung cấp | `D:\2026\2025-phuquoc\apps\2026-thenamduhillresort\public\uploads`, `D:\2026\2025-phuquoc\resources\scripts\crawl\output\thenamduhill\assets` |
| Logo / brand asset | `D:\2026\2025-phuquoc\apps\2026-thenamduhillresort\public\uploads\OP5.png` |

Link nội dung website  cũ `D:\2026\2025-phuquoc\resources\scripts\crawl\output\thenamduhill\thenamduhill.full-site.json`, 
`D:\2026\2025-phuquoc\resources\scripts\crawl\output\thenamduhill\assets\manifest.json`

Link website hiện tại tôi đã chuẩn bị `https://2026-thenamduhill.vercel.app/`

## Ràng buộc remake (nếu có website hiện tại)

Bản remake phải **tốt hơn nhưng đầy đủ chức năng** như bản hiện tại.
Liệt kê chức năng bắt buộc giữ (teardown sẽ kiểm kê lại, đây là danh sách
khách tự khai):

- Website booking hotel, client workflow chính sẽ là xem phòng, chọn phòng, đặt phòng, thanh toán, tạm thời để các phương tiện thủ công, xem hệ thống website cũ đang support chức năng thanh toán nào
- Các trang web hiện tại đang có: Home
Rooms & Suites
Winning & Dinning
Experiences
Event
News
Gallery
Contact Us

Trong website tôi đang chuẩn bị có các chức năng sau, hãy dựa vào đó để thiết kế và triển khai webiste, đảm bảo các chức năng đều hoạt động

## Trả lời K0 (5 câu — trả lời trước để không bị hỏi)

1. Design direction: <tropical editorial / dark-luxury / …> Tôi không phân biệt được các loại thiết kế, cần phân tích và recommand cho tôi.
2. Nguồn ảnh: <ảnh khách chụp / ảnh crawl DEV-ONLY chờ thay / ảnh sinh> Hãy tận dụng tối đa các ảnh tôi đã chuẩn bị, chọn ra các ảnh chính phù hợp với hệ thống dể phát triển, nếu chất lượng ảnh ko tốt có thể gợi ý ảnh cần tạo tôi có thể sử dụng 
3. Nội dung thật: Đã có nội dung chính thức có thể xem ở phần crawl data, cần refactor danh sách nội dung này, để đạt được yêu cầu mà chúng ta cần là cung cấp dịch vụ booking Hotel tại Nam Du, tăng lượt chuyển đổi. Tôi nghĩ có thể đóng vai trò là giới thiệu Nam Du đến người dùng, đây sẽ là một trong những key để người dùng có thiện cảm và có độ trust để booking. Phục vụ khách en/vi.
4. Mức độ motion: khuyến nghị tạm thời là tĩnh or nhẹ, sẽ có 1 bước thêm animation để đồng bộ cả trang sẽ tốt hơn là thiết kế rời rạc. recommanded: tĩnh, sẽ thêm animation ở bước cuối cùng để đồng bộ các trang. 
5. Brand asset phải tôn trọng: <logo, font, màu — hoặc `tự do`> Đã có logo `D:\2026\2025-phuquoc\apps\2026-thenamduhillresort\public\uploads\OP5.png`, hãy dựa vào đó để thiết kế. Hãy sử dụng các màu sắc chủ đạo từ logo để làm màu sắc chính, kết hợp với màu sắc của Nam Du để tạo ra một thiết kế hài hòa. Nam du là 1 hòn đảo hoang sơ, nên các màu sắc cần phải hài hòa với thiên nhiên. Có rất nhiều ảnh về các homestay và resort đẹp ở đảo Nam Du, tôi muốn bạn chọn ra các ảnh phù hợp với hệ thống để phát triển, hoặc có thể suggest ảnh cần tạo. 

## Ghi chú thêm
- Đối với khách hàng: nổi đau lớn nhất là độ uy tín của website, tôi không biết đây có phải website của chính chủ resort ko, rất nhiều nổi lừa đảo qua hình thức này, nên người dùng rất lo lắng khi thanh toán.
- Đối với nhà cung cấp: có thể nguồn kinh phí hạn hẹp sẽ tận dụng hình ảnh đã có thay vì booking photo mới, chúng ta đóng vai trò quan trọng làm đẹp trang website với hình ảnh đã có. hình ảnh phòng khách sạn đã có sẵn ở file crawl.
- Kênh liên hệ các website thường là họ tên, sdt, địa chỉ email, nội dung tư vấn, nhưng tôi nghĩ rất ít người sử dụng nó. đa số sẽ sử dụng ZALO OA (chính),facebook, tiktok , youtube
