-- =============================================================================
-- 20260101000300_seed_reference.sql
--
-- SINH TỰ ĐỘNG bởi resources/scripts/seed/build-seed.ts — ĐỪNG SỬA TAY.
-- Sửa dữ liệu ở packages/core/src/data/ rồi chạy lại: pnpm seed:build
--
-- Ticket 200-01 §6.5 — dữ liệu danh mục: hạng phòng, phòng vật lý, mùa vụ,
-- gói giá, dịch vụ thêm, khuyến mãi, cấu hình cơ sở, tài khoản nhân viên,
-- nội dung marketing.
--
-- Id giữ NGUYÊN SLUG của core (room-suite-sea, standard, high-summer…).
-- Cấm sinh UUID mới cho bảng danh mục (schema-mapping Q1).
--
-- ⚠️ Nội dung marketing là BẢN DEMO (MANUAL.md M2/M6). property_settings.brand
-- mang khoá "demo": true để 300-02 lọc được trước khi go-live.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 1. property_settings — đúng một hàng ở v1.0.0
-- ---------------------------------------------------------------------------

INSERT INTO public.property_settings (id, brand, hero, about, facts, nav, transport, notes, child_policy) VALUES (
    'nam-du-hill',
    '{"name":"The Nam Du Hill","suffix":"Resort","tagline":{"vi":"Hành trình nghỉ dưỡng hoàn hảo","en":"A perfect island escape"},"address":{"vi":"Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam","en":"Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam"},"phone":"0985 000 650","email":"thenamduhill@gmail.com","site":"thenamduhill.com","logo":"/OP5.png","demo":true}'::jsonb,
    '{"kicker":{"vi":"Quần đảo Nam Du · Kiên Giang","en":"Nam Du Archipelago · Kien Giang"},"title":{"vi":"Nghỉ dưỡng trên đồi, thức giấc cùng 21 hòn đảo","en":"Wake up on the hill, above 21 islands"},"sub":{"vi":"Resort trên sườn đồi hướng biển tại Hòn Củ Tron — điểm xuất phát thuận tiện nhất cho hành trình khám phá Nam Du.","en":"A hillside resort facing the sea on Hon Cu Tron — the most convenient base for exploring Nam Du."},"badges":[{"vi":"Trọn gói vé tàu + phòng + tour","en":"Ferry + room + tour bundles"},{"vi":"Xác nhận trong 15 phút","en":"Confirmed in 15 minutes"},{"vi":"Hỗ trợ đưa đón bến tàu","en":"Free pier transfer"}],"images":["/hero-1.jpg","/hero-2.jpg"]}'::jsonb,
    '{"title":{"vi":"The Nam Du Hill Resort","en":"The Nam Du Hill Resort"},"kicker":{"vi":"Hành trình nghỉ dưỡng hoàn hảo","en":"A perfect island escape"},"body":[{"vi":"Tọa lạc trên sườn đồi hướng biển, The Nam Du Hill Resort là điểm dừng chân lý tưởng cho những ai tìm kiếm sự yên bình và thoải mái. Chúng tôi mang đến trải nghiệm nghỉ dưỡng khác biệt với từng khoảnh khắc được chăm chút bằng dịch vụ tận tâm.","en":"Set on an ocean-facing hillside, The Nam Du Hill Resort is the ideal stop for anyone seeking calm and comfort. Every moment here is shaped by attentive, personal service."},{"vi":"Hệ thống phòng tiện nghi, không gian café & bar trên cao cùng đội ngũ nhân viên thân thiện sẽ mang lại cho bạn những ngày thư giãn trọn vẹn. Từ dịch vụ đưa đón, hỗ trợ tour khám phá đảo đến các tiện ích trải nghiệm địa phương tất cả đều được thiết kế để tối đa sự thoải mái cho du khách.","en":"Well-appointed rooms, a rooftop café & bar and a warm team make for genuinely restful days. From pier transfers and island tours to local experiences, everything is designed around your comfort."}],"services":[{"vi":"Dịch vụ lưu trú","en":"Accommodation"},{"vi":"Nhà hàng & Bar","en":"Restaurant & Bar"},{"vi":"Hồ bơi vô cực","en":"Infinity pool"},{"vi":"BBQ & Karaoke","en":"BBQ & Karaoke"}]}'::jsonb,
    '[{"value":"21","label":{"vi":"hòn đảo lớn nhỏ","en":"islands in the group"}},{"value":"309m","label":{"vi":"đỉnh cao nhất Hòn Lớn","en":"highest peak on Hon Lon"}},{"value":"9,12","label":{"vi":"km² tổng diện tích","en":"km² total area"}},{"value":"T12–T3","label":{"vi":"mùa biển đẹp nhất","en":"best season to visit"}}]'::jsonb,
    '[{"href":"#rooms","label":{"vi":"Phòng","en":"Rooms & Suites"}},{"href":"#dining","label":{"vi":"Ẩm thực","en":"Wining & Dining"}},{"href":"#places","label":{"vi":"Khám phá","en":"Experiences"}},{"href":"#tours","label":{"vi":"Sự kiện","en":"Events"}},{"href":"#gallery","label":{"vi":"Thư viện","en":"Gallery"}},{"href":"#contact","label":{"vi":"Liên hệ","en":"Contact Us"}}]'::jsonb,
    '[{"leg":{"vi":"TP.HCM → Rạch Giá","en":"HCMC → Rach Gia"},"mode":{"vi":"Xe giường nằm chạy đêm (23:00 → 06:00)","en":"Overnight sleeper bus (23:00 → 06:00)"},"price":{"vi":"210.000 – 250.000đ","en":"210,000 – 250,000₫"}},{"leg":{"vi":"Rạch Giá → Nam Du","en":"Rach Gia → Nam Du"},"mode":{"vi":"Tàu cao tốc, 2–3 giờ (Superdong, Phú Quốc Express…)","en":"Speedboat, 2–3 hrs (Superdong, Phu Quoc Express…)"},"price":{"vi":"~225.000đ / lượt","en":"~225,000₫ one way"}},{"leg":{"vi":"Di chuyển trên đảo","en":"Getting around the island"},"mode":{"vi":"Xe máy tự lái, cung đường vòng đảo 11 km","en":"Self-drive motorbike on the 11 km island loop"},"price":{"vi":"120.000 – 150.000đ / ngày","en":"120,000 – 150,000₫ per day"}},{"leg":{"vi":"Tham quan đảo vệ tinh","en":"Satellite island tour"},"mode":{"vi":"Tàu gỗ du lịch, ghép đoàn hoặc trọn gói","en":"Wooden tour boat, shared or private"},"price":{"vi":"200.000 – 400.000đ / khách","en":"200,000 – 400,000₫ per guest"}}]'::jsonb,
    '[{"vi":"Đặt phòng và vé tàu trước 2–4 tuần trong cao điểm tháng 12 – tháng 3.","en":"Book rooms and ferry tickets 2–4 weeks ahead in the December–March peak."},{"vi":"Không bẻ, đạp hay thu gom san hô — hệ sinh thái biển ở đây rất mong manh.","en":"Do not break, step on or collect coral — the reef here is fragile."},{"vi":"Mang theo thuốc chống say sóng và theo dõi dự báo thời tiết trước 3 ngày.","en":"Bring motion-sickness tablets and check the forecast three days ahead."}]'::jsonb,
    '{"freeUnderAge":6,"halfPriceUntilAge":11,"childRate":250000}'::jsonb
);

-- ---------------------------------------------------------------------------
-- 2. room_types — 20 hạng phòng (Room + RoomExtra gộp)
-- ---------------------------------------------------------------------------

INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-gia-dinh-nhin-ra-bien-01',
    '{"vi":"Phòng gia đình nhìn ra biển","en":"Phòng gia đình nhìn ra biển"}'::jsonb,
    '{"vi":"Mặc định 2 người. Phụ thu giường phụ 450.000đ/khách. Tối đa 4 người View nhìn ra biển","en":"Mặc định 2 người. Phụ thu giường phụ 450.000đ/khách. Tối đa 4 người View nhìn ra biển"}'::jsonb,
    '28 m²',
    2,
    1886000,
    '[{"vi":"Hướng biển","en":"Sea view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Gia đình","en":"Family"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/1-full.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/ghep-1.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/ghep-2.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/ghep-3.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-1.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-2.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-4.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-5.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-6.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-8.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/nhin-ra-bien-9.jpg","https://thenamduhill.com/image/catalog/room-suite/1-phong-gia-dinh-nhin-ra-view-bien/1%20(4).jpg"]'::jsonb,
    'family',
    450000,
    '[]'::jsonb,
    4,
    2,
    450000,
    '{"vi":"Mặc định 2 người. Phụ thu giường phụ 450.000đ/khách. Tối đa 4 người View nhìn ra biển","en":"Mặc định 2 người. Phụ thu giường phụ 450.000đ/khách. Tối đa 4 người View nhìn ra biển"}'::jsonb,
    '{"vi":"Nhìn ra biển và sân vườn","en":"Sea and garden view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, diện tích khoảng 28 m2, có trang bị tủ áo, bố trí 01 ghế hình trứng thư giãn, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và nhìn từ trên đồi cao xuống thung lủng là một mảng xanh của hoa lá xung quanh tạo cho khách cảm giác thư giảng, thoải mái và rất gần gủi với thiên nhiên.","en":"Phòng có ban công riêng, diện tích khoảng 28 m2, có trang bị tủ áo, bố trí 01 ghế hình trứng thư giãn, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và nhìn từ trên đồi cao xuống thung lủng là một mảng xanh của hoa lá xung quanh tạo cho khách cảm giác thư giảng, thoải mái và rất gần gủi với thiên nhiên."}'::jsonb,
    NULL,
    '[{"vi":"Phòng không hút thuốc","en":"Non-smoking room"},{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    0
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-gia-dinh-view-bien-08-08',
    '{"vi":"Phòng gia đình view biển (08)","en":"Phòng gia đình view biển (08)"}'::jsonb,
    '{"vi":"Phòng 03 giường - 01 giường đôi & 02 giường đơn View nhìn ra biển","en":"Phòng 03 giường - 01 giường đôi & 02 giường đơn View nhìn ra biển"}'::jsonb,
    '40 m²',
    4,
    3088000,
    '[{"vi":"Hướng biển","en":"Sea view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Gia đình","en":"Family"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/cover8.jpg","https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/daidien1.jpg","https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/daidien2.jpg","https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-1.jpg","https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-2.jpg","https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-3.jpg","https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-6.jpg","https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-7.jpg","https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/suite-phong-ngu-8-9.jpg"]'::jsonb,
    'family',
    NULL,
    '[]'::jsonb,
    4,
    4,
    0,
    '{"vi":"Phòng 03 giường - 01 giường đôi & 02 giường đơn View nhìn ra biển","en":"Phòng 03 giường - 01 giường đôi & 02 giường đơn View nhìn ra biển"}'::jsonb,
    '{"vi":"Nhìn ra biển và chợ đêm","en":"Sea and night-market view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, diện tích sàn khoảng 40 m2, 01 tầng trệt được bố trí 02 giường đơn, 01 gác lửng và bố trí 01 giường đôi, có trang bị tủ áo, bố trí 01 bàn, truy cập wifi miễn phí, 02 phòng tắm, 02 wc , 02 bàn lavabo được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities) , dép mang trong nhà. Ngoài ra phòng ở có cửa sổ, thoáng mát giúp đón ánh sáng và gió mát tự nhiên và có tầm nhìn hướng biển, chợ đêm với nhiều ánh đèn lấp lánh đầy màu sắc.","en":"Phòng có ban công riêng, diện tích sàn khoảng 40 m2, 01 tầng trệt được bố trí 02 giường đơn, 01 gác lửng và bố trí 01 giường đôi, có trang bị tủ áo, bố trí 01 bàn, truy cập wifi miễn phí, 02 phòng tắm, 02 wc , 02 bàn lavabo được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities) , dép mang trong nhà. Ngoài ra phòng ở có cửa sổ, thoáng mát giúp đón ánh sáng và gió mát tự nhiên và có tầm nhìn hướng biển, chợ đêm với nhiều ánh đèn lấp lánh đầy màu sắc."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    1
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04',
    '{"vi":"Phòng giường đôi có ban công nhìn ra biển","en":"Phòng giường đôi có ban công nhìn ra biển"}'::jsonb,
    '{"vi":"1 giường đôi lớn, có ban công & Nhìn ra Biển","en":"1 giường đôi lớn, có ban công & Nhìn ra Biển"}'::jsonb,
    '15 m²',
    2,
    1546000,
    '[{"vi":"Hướng biển","en":"Sea view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Đôi","en":"Couple"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/cover3_4.jpg","https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/dai-dien.jpg","https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/ghepfull1.jpg","https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/nhin-ra-bien1.jpg","https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/nhin-ra-bien2.jpg","https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/nhin-ra-bien6.jpg","https://thenamduhill.com/image/catalog/room-suite/3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien/nhin-ra-bien5.jpg"]'::jsonb,
    'suite',
    NULL,
    '[]'::jsonb,
    2,
    2,
    0,
    '{"vi":"1 giường đôi lớn, có ban công & Nhìn ra Biển","en":"1 giường đôi lớn, có ban công & Nhìn ra Biển"}'::jsonb,
    '{"vi":"Nhìn ra biển và thung lủng","en":"Sea and valley view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, diện tích khoảng 15 m2, có trang bị tủ áo, bố trí 01 ghế, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và bao quanh bởi mảng xanh của hoa lá xung quanh tạo cho khách cảm giác thư giảng, thoải mái và gần rủi với thiên nhiên.","en":"Phòng có ban công riêng, diện tích khoảng 15 m2, có trang bị tủ áo, bố trí 01 ghế, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và bao quanh bởi mảng xanh của hoa lá xung quanh tạo cho khách cảm giác thư giảng, thoải mái và gần rủi với thiên nhiên."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    2
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-tieu-chuan-giuong-doi-luc-giac-05',
    '{"vi":"Phòng tiêu chuẩn giường đôi (lục giác)","en":"Phòng tiêu chuẩn giường đôi (lục giác)"}'::jsonb,
    '{"vi":"1 giường đôi lớn, 21m2, View nhìn ra biển","en":"1 giường đôi lớn, 21m2, View nhìn ra biển"}'::jsonb,
    '18 m²',
    2,
    1546000,
    '[{"vi":"Hướng biển","en":"Sea view"},{"vi":"Đôi","en":"Couple"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/5-phong-tieu-chuan-luc-giac/full.jpg","https://thenamduhill.com/image/catalog/room-suite/5-phong-tieu-chuan-luc-giac/ghepfull.jpg"]'::jsonb,
    'couple',
    NULL,
    '[{"who":"Ngọc Anh · TP.HCM","score":"9.4","text":{"vi":"Nằm trên giường ngắm được cả hoàng hôn lẫn đèn chợ đêm. Không cần đi đâu.","en":"From the bed you catch both the sunset and the night-market lights. No need to go anywhere."}}]'::jsonb,
    2,
    2,
    0,
    '{"vi":"1 giường đôi lớn, 21m2, View nhìn ra biển","en":"1 giường đôi lớn, 21m2, View nhìn ra biển"}'::jsonb,
    '{"vi":"Nhìn ra biển và sân vườn","en":"Sea and garden view"}'::jsonb,
    '{"vi":"Phòng hình Lục giác được lắp đặt bởi khung kính, khách có thể nhìn cảnh thiên nhiên xung quanh ngay tại giường, diện tích khoảng 18 m2, gồm 01 trệt , 01 lầu, có trang bị tủ áo, phòng tắm , bàn lavabo bố trí riêng biệt, 01 phòng tắm và wc. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities), truy cập wiwi miễn phí.","en":"Phòng hình Lục giác được lắp đặt bởi khung kính, khách có thể nhìn cảnh thiên nhiên xung quanh ngay tại giường, diện tích khoảng 18 m2, gồm 01 trệt , 01 lầu, có trang bị tủ áo, phòng tắm , bàn lavabo bố trí riêng biệt, 01 phòng tắm và wc. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities), truy cập wiwi miễn phí."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê ( túi lọc) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    3
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-deluxe-06',
    '{"vi":"Phòng Deluxe","en":"Phòng Deluxe"}'::jsonb,
    '{"vi":"1 giường đôi lớn, Diện tích phòng: 20m2, View nhìn ra biển và hồ bơi","en":"1 giường đôi lớn, Diện tích phòng: 20m2, View nhìn ra biển và hồ bơi"}'::jsonb,
    '20 m²',
    2,
    1776000,
    '[{"vi":"Hướng biển","en":"Sea view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Đôi","en":"Couple"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-11.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-12.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-13.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-14.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-15.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/phong-deluxe-16.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/p-6.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/p6.1.jpg","https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/p6.2.jpg"]'::jsonb,
    'couple',
    NULL,
    '[]'::jsonb,
    2,
    2,
    0,
    '{"vi":"1 giường đôi lớn, Diện tích phòng: 20m2, View nhìn ra biển và hồ bơi","en":"1 giường đôi lớn, Diện tích phòng: 20m2, View nhìn ra biển và hồ bơi"}'::jsonb,
    '{"vi":"Nhìn ra biển và chợ đêm","en":"Sea and night-market view"}'::jsonb,
    '{"vi":"Phòng có ban công chung, diện tích sàn khoảng 20 m2, bố trí 01 giường đôi, có trang bị tủ áo, bố trí 01 ghế hình trứng, C 02 phòng tắm, 02 wc , 02 bàn lavabo được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities) ,","en":"Phòng có ban công chung, diện tích sàn khoảng 20 m2, bố trí 01 giường đôi, có trang bị tủ áo, bố trí 01 ghế hình trứng, C 02 phòng tắm, 02 wc , 02 bàn lavabo được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities) ,"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, diện tích sàn khoảng 40 m2, 01 tầng trệt được bố trí 02 giường đơn, 01 gác lửng và bố trí 01 giường đôi, có trang bị tủ áo, bàn lavabo, phòng tắm, wc bố trí riêng biệt, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom), wifi miễn phí. Ngoài ra phòng ở có cửa sổ rộng, thoáng mát giúp đón ánh sáng và gió mát tự nhiên và có tầm nhìn hướng biển và hồ bơi, đặt biệt mở cửa sổ là khách có thể ngắm bình minh từ phòng.","en":"Phòng có ban công riêng, diện tích sàn khoảng 40 m2, 01 tầng trệt được bố trí 02 giường đơn, 01 gác lửng và bố trí 01 giường đôi, có trang bị tủ áo, bàn lavabo, phòng tắm, wc bố trí riêng biệt, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom), wifi miễn phí. Ngoài ra phòng ở có cửa sổ rộng, thoáng mát giúp đón ánh sáng và gió mát tự nhiên và có tầm nhìn hướng biển và hồ bơi, đặt biệt mở cửa sổ là khách có thể ngắm bình minh từ phòng."}'::jsonb,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"},{"vi":"Trà, cà phê( túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    4
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-superior-co-giuong-co-king-07',
    '{"vi":"Phòng Superior có giường cỡ King","en":"Phòng Superior có giường cỡ King"}'::jsonb,
    '{"vi":"Diện tích 53m2, Mặc định 2 người. Phụ thu 410.000đ/người. Tối đa 4 người","en":"Diện tích 53m2, Mặc định 2 người. Phụ thu 410.000đ/người. Tối đa 4 người"}'::jsonb,
    '53 m²',
    2,
    2971000,
    '[{"vi":"Nhìn hướng biển, hồ bơi","en":"Sea and pool view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Gia đình","en":"Family"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/dai-dien-2.jpg","https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/daidien-1.jpg","https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-1.jpg","https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-4.jpg","https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-5.jpg","https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-6.jpg","https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/phong-king-7.jpg"]'::jsonb,
    'family',
    410000,
    '[{"who":"Minh Trí · Cần Thơ","score":"9.5","text":{"vi":"Ngâm Jacuzzi lúc mặt trời lặn là thứ đáng tiền nhất chuyến đi.","en":"Sitting in the Jacuzzi at sunset was the best value of the whole trip."}}]'::jsonb,
    4,
    2,
    410000,
    '{"vi":"Diện tích 53m2, Mặc định 2 người. Phụ thu 410.000đ/người. Tối đa 4 người","en":"Diện tích 53m2, Mặc định 2 người. Phụ thu 410.000đ/người. Tối đa 4 người"}'::jsonb,
    '{"vi":"Nhìn hướng biển, hồ bơi","en":"Sea and pool view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, diện tích sàn khoảng 53 m2, được bố trí 02 giường đơn, 01 giường đôi, có bàn trang điểm làm từ gổ mộc tinh tế, tủ áo, 01 jacozzi, 01 bàn lavabo bố trí riêng biệt, 01 phòng tắm, 01 wc, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities) , truy cập wifi miễn phí. Ngoài ra phòng ở có cửa sổ, thoáng mát giúp đón ánh sáng và gió mát tự nhiên. Phòng 02 hướng biển, hồ bơi. Ưu điểm đật biệt của vị trí phòng là ngắm đươc cả bình minh và hoàng hôn.","en":"Phòng có ban công riêng, diện tích sàn khoảng 53 m2, được bố trí 02 giường đơn, 01 giường đôi, có bàn trang điểm làm từ gổ mộc tinh tế, tủ áo, 01 jacozzi, 01 bàn lavabo bố trí riêng biệt, 01 phòng tắm, 01 wc, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities) , truy cập wifi miễn phí. Ngoài ra phòng ở có cửa sổ, thoáng mát giúp đón ánh sáng và gió mát tự nhiên. Phòng 02 hướng biển, hồ bơi. Ưu điểm đật biệt của vị trí phòng là ngắm đươc cả bình minh và hoàng hôn."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    5
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-giuong-doi-nhin-ra-vuon-02',
    '{"vi":"Phòng giường đôi nhìn ra vườn","en":"Phòng giường đôi nhìn ra vườn"}'::jsonb,
    '{"vi":"Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View nhìn ra vườn","en":"Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View nhìn ra vườn"}'::jsonb,
    '24 m²',
    2,
    1546000,
    '[{"vi":"Hướng vườn","en":"Garden view"},{"vi":"03 khách","en":"3 guests"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/2-phong-giuong-doi-nhin-ra-vuon/nhin-ra-vuon1.jpg","https://thenamduhill.com/image/catalog/room-suite/2-phong-giuong-doi-nhin-ra-vuon/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/2-phong-giuong-doi-nhin-ra-vuon/nhin-ra-vuon2.jpg"]'::jsonb,
    'family',
    410000,
    '[]'::jsonb,
    3,
    2,
    410000,
    '{"vi":"Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View nhìn ra vườn","en":"Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View nhìn ra vườn"}'::jsonb,
    '{"vi":"Nhìn ra biển và sân vườn","en":"Sea and garden view"}'::jsonb,
    '{"vi":"Phòng có diện tích khoảng 24 m2, có trang bị tủ áo, bố trí 01 ghế hình trứng thư giãn, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ lớn giúp đón ánh sáng và khách cảm nhận không khí trong lành từ trên đồi cao khách sạn The Nam Du Hill","en":"Phòng có diện tích khoảng 24 m2, có trang bị tủ áo, bố trí 01 ghế hình trứng thư giãn, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ lớn giúp đón ánh sáng và khách cảm nhận không khí trong lành từ trên đồi cao khách sạn The Nam Du Hill"}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Tra cà phê ( túi lọc) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    6
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-gia-dinh-view-bien-09-09',
    '{"vi":"Phòng gia đình view biển (09)","en":"Phòng gia đình view biển (09)"}'::jsonb,
    '{"vi":"Phòng 2 giường đôi lớn. View nhìn ra biển","en":"Phòng 2 giường đôi lớn. View nhìn ra biển"}'::jsonb,
    '40 m²',
    4,
    3088000,
    '[{"vi":"Hướng biển","en":"Sea view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Gia đình","en":"Family"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/cover9.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.1.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.10.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.11.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.2.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.3.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.4.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.5.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.7.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.8.jpg","https://thenamduhill.com/image/catalog/room-suite/9-phong-sute-02-phong-ngu/p9.9.jpg"]'::jsonb,
    'family',
    NULL,
    '[]'::jsonb,
    4,
    4,
    0,
    '{"vi":"Phòng 2 giường đôi lớn. View nhìn ra biển","en":"Phòng 2 giường đôi lớn. View nhìn ra biển"}'::jsonb,
    '{"vi":"Nhìn ra biển và chợ đêm","en":"Sea and night-market view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, diện tích sàn khoảng 40 m2, 01 tầng trệt được bố trí 02 giường đơn, 01 gác lửng và bố trí 01 giường đôi, có trang bị tủ áo, bố trí 01 bàn, truy cập wifi miễn phí, 02 phòng tắm, 02 wc , 02 bàn lavabo được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ, thoáng mát giúp đón ánh sáng và gió mát tự nhiên và có tầm nhìn hướng biển, chợ đêm với nhiều ánh đèn lấp lánh đầy màu sắc.","en":"Phòng có ban công riêng, diện tích sàn khoảng 40 m2, 01 tầng trệt được bố trí 02 giường đơn, 01 gác lửng và bố trí 01 giường đôi, có trang bị tủ áo, bố trí 01 bàn, truy cập wifi miễn phí, 02 phòng tắm, 02 wc , 02 bàn lavabo được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ, thoáng mát giúp đón ánh sáng và gió mát tự nhiên và có tầm nhìn hướng biển, chợ đêm với nhiều ánh đèn lấp lánh đầy màu sắc."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    7
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-giuong-doi-co-san-trong-10',
    '{"vi":"Phòng giường đôi có sân trong","en":"Phòng giường đôi có sân trong"}'::jsonb,
    '{"vi":"Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View Nhìn ra vườn","en":"Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View Nhìn ra vườn"}'::jsonb,
    '',
    2,
    1776000,
    '[{"vi":"Hướng vườn","en":"Garden view"},{"vi":"03 khách","en":"3 guests"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/dai-dien.jpg","https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-1.jpg","https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-2.jpg","https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-3.jpg","https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-4.jpg"]'::jsonb,
    'family',
    410000,
    '[]'::jsonb,
    3,
    2,
    410000,
    '{"vi":"Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View Nhìn ra vườn","en":"Mặc định 2 người. Phụ thu giường phụ 410.000đ/khách. Tối đa 3 người. View Nhìn ra vườn"}'::jsonb,
    '{"vi":"Nhìn ra vườn","en":"Garden view"}'::jsonb,
    '{"vi":"Phòng đôi này cung cấp đồ dùng vệ sinh cá nhân và áo choàng tắm miễn phí, có phòng tắm riêng với vòi sen, máy sấy tóc và dép đi trong nhà. Phòng đôi có sàn lát gạch, khu vực tiếp khách, máy điều hòa, máy pha trà và cà phê cũng như tầm nhìn ra khu vườn. Phòng có 1 giường.","en":"Phòng đôi này cung cấp đồ dùng vệ sinh cá nhân và áo choàng tắm miễn phí, có phòng tắm riêng với vòi sen, máy sấy tóc và dép đi trong nhà. Phòng đôi có sàn lát gạch, khu vực tiếp khách, máy điều hòa, máy pha trà và cà phê cũng như tầm nhìn ra khu vườn. Phòng có 1 giường."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Vòi sen","en":"Vòi sen"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"},{"vi":"Nhà vệ sinh","en":"Toilet"},{"vi":"Dép","en":"Dép"},{"vi":"Máy sấy tóc","en":"Máy sấy tóc"},{"vi":"Giấy vệ sinh","en":"Toilet paper"},{"vi":"Tủ lạnh","en":"Tủ lạnh"},{"vi":"Ra trải giường","en":"Bed linen"},{"vi":"Két an toàn","en":"Két an toàn"},{"vi":"Sàn lát gạch/đá cẩm thạch","en":"Tile / marble floor"},{"vi":"Các tầng trên chỉ lên được bằng cầu thang","en":"Upper floors accessible by stairs only"},{"vi":"Ghế sofa","en":"Sofa"},{"vi":"Máy điều hòa độc lập cho từng phòng","en":"Individually controlled air conditioning"},{"vi":"Quạt máy","en":"Quạt máy"},{"vi":"Khăn tắm","en":"Towels"},{"vi":"Tủ hoặc phòng để quần áo","en":"Wardrobe or closet"},{"vi":"Khu vực tiếp khách","en":"Khu vực tiếp khách"},{"vi":"Ổ điện gần giường","en":"Socket near the bed"},{"vi":"Điều hòa không khí","en":"Air conditioning"},{"vi":"Máy pha trà/cà phê","en":"Tea / coffee maker"},{"vi":"Giá treo quần áo","en":"Clothes rack"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    8
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-gia-dinh-view-bien-11',
    '{"vi":"Phòng gia đình view biển","en":"Phòng gia đình view biển"}'::jsonb,
    '{"vi":"View nhìn ra biển - 02 giường đôi - Gia đình 4 khách","en":"View nhìn ra biển - 02 giường đôi - Gia đình 4 khách"}'::jsonb,
    '30 m²',
    4,
    3088000,
    '[{"vi":"Hướng biển","en":"Sea view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Gia đình","en":"Family"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/cover11.jpg","https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-1.jpg","https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-11.jpg","https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-12.jpg","https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-9.jpg","https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-8.jpg","https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/p11.jpg"]'::jsonb,
    'family',
    NULL,
    '[]'::jsonb,
    4,
    4,
    0,
    '{"vi":"View nhìn ra biển - 02 giường đôi - Gia đình 4 khách","en":"View nhìn ra biển - 02 giường đôi - Gia đình 4 khách"}'::jsonb,
    '{"vi":"Nhìn hướng biển","en":"Sea view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, ghế sofa, diện tích khoảng 30 m2, 02 giường đôi, có trang bị tủ áo, bố trí 01 ghế trứng mỹ thuật , truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và hướng phòng nhìn ra biển. Đặt biệt, khách có thể ngắm bình minh vào buổi sơm mai hoặc màu xanh ngọc bích của biển và màu trắng bạt của những cơn sóng sô bờ trực tiếp tại phòng của mình cảm giác thư giảng, thoải mái và rất gần rủi với thiên nhiên.","en":"Phòng có ban công riêng, ghế sofa, diện tích khoảng 30 m2, 02 giường đôi, có trang bị tủ áo, bố trí 01 ghế trứng mỹ thuật , truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và hướng phòng nhìn ra biển. Đặt biệt, khách có thể ngắm bình minh vào buổi sơm mai hoặc màu xanh ngọc bích của biển và màu trắng bạt của những cơn sóng sô bờ trực tiếp tại phòng của mình cảm giác thư giảng, thoải mái và rất gần rủi với thiên nhiên."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    9
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-giuong-doi-co-ban-cong-12',
    '{"vi":"Phòng giường đôi có ban công","en":"Phòng giường đôi có ban công"}'::jsonb,
    '{"vi":"Diện tích phòng: 19m2, View Nhìn ra biển","en":"Diện tích phòng: 19m2, View Nhìn ra biển"}'::jsonb,
    '19 m²',
    2,
    1862000,
    '[{"vi":"Hướng biển","en":"Sea view"},{"vi":"Đôi","en":"Couple"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/cover12.jpg","https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-1.jpg","https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-2.jpg","https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-3.jpg","https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-4.jpg","https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ban-cong-5.jpg","https://thenamduhill.com/image/catalog/room-suite/12-phong-giuong-doi-co-ban-cong/ghepfull.jpg"]'::jsonb,
    'couple',
    NULL,
    '[]'::jsonb,
    2,
    2,
    0,
    '{"vi":"Diện tích phòng: 19m2, View Nhìn ra biển","en":"Diện tích phòng: 19m2, View Nhìn ra biển"}'::jsonb,
    '{"vi":"Nhìn ra biển","en":"Sea view"}'::jsonb,
    '{"vi":"Phòng đôi này cung cấp đồ dùng vệ sinh cá nhân và áo choàng tắm miễn phí, có phòng tắm riêng với vòi sen, máy sấy tóc và dép đi trong nhà. Phòng đôi có sàn lát gạch, khu vực tiếp khách, máy điều hòa, máy pha trà và cà phê cũng như tầm nhìn ra khu vườn. Phòng có 1 giường.","en":"Phòng đôi này cung cấp đồ dùng vệ sinh cá nhân và áo choàng tắm miễn phí, có phòng tắm riêng với vòi sen, máy sấy tóc và dép đi trong nhà. Phòng đôi có sàn lát gạch, khu vực tiếp khách, máy điều hòa, máy pha trà và cà phê cũng như tầm nhìn ra khu vườn. Phòng có 1 giường."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Vòi sen","en":"Vòi sen"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"},{"vi":"Nhà vệ sinh","en":"Toilet"},{"vi":"Dép","en":"Dép"},{"vi":"Máy sấy tóc","en":"Máy sấy tóc"},{"vi":"Giấy vệ sinh","en":"Toilet paper"},{"vi":"Tủ lạnh","en":"Tủ lạnh"},{"vi":"Ra trải giường","en":"Bed linen"},{"vi":"Két an toàn","en":"Két an toàn"},{"vi":"Sàn lát gạch/đá cẩm thạch","en":"Tile / marble floor"},{"vi":"Các tầng trên chỉ lên được bằng cầu thang","en":"Upper floors accessible by stairs only"},{"vi":"Ghế sofa","en":"Sofa"},{"vi":"Máy điều hòa độc lập cho từng phòng","en":"Individually controlled air conditioning"},{"vi":"Quạt máy","en":"Quạt máy"},{"vi":"Khăn tắm","en":"Towels"},{"vi":"Tủ hoặc phòng để quần áo","en":"Wardrobe or closet"},{"vi":"Khu vực tiếp khách","en":"Khu vực tiếp khách"},{"vi":"Ổ điện gần giường","en":"Socket near the bed"},{"vi":"Điều hòa không khí","en":"Air conditioning"},{"vi":"Máy pha trà/cà phê","en":"Tea / coffee maker"},{"vi":"Giá treo quần áo","en":"Clothes rack"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    10
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'second-floor-family-with-sea-view-13',
    '{"vi":"Second Floor Family with Sea View","en":"Second Floor Family with Sea View"}'::jsonb,
    '{"vi":"2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 35m2","en":"2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 35m2"}'::jsonb,
    '35 m²',
    4,
    3088000,
    '[{"vi":"Nhìn hướng biển","en":"Sea view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Gia đình","en":"Family"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/cover_13.jpg","https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view9.jpg","https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view1.jpg","https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view3.jpg","https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view5.jpg","https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view7.jpg","https://thenamduhill.com/image/catalog/room-suite/13-second-floor-family-with-sea-view/sea-view8.jpg"]'::jsonb,
    'family',
    NULL,
    '[]'::jsonb,
    4,
    4,
    0,
    '{"vi":"2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 35m2","en":"2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 35m2"}'::jsonb,
    '{"vi":"Nhìn hướng biển","en":"Sea view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, ghế sofa, diện tích khoảng 35 m2, 02 giường đôi, có trang bị tủ áo, bố trí 01 ghế trứng mỹ thuật , truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và hướng phòng nhìn ra biển. Đặt biệt, khách có thể ngắm trực tiếp tại phòng của mình khi bình minh ló vạng vào buổi sớm mai hoặc màu xanh ngọc bích của biển và màu trắng bạt của những cơn sóng sô bờ như một bức tranh thủy mạc, tạo cho khách cảm giác thư giảng, thoải mái và rất an yên, trầm lăng.","en":"Phòng có ban công riêng, ghế sofa, diện tích khoảng 35 m2, 02 giường đôi, có trang bị tủ áo, bố trí 01 ghế trứng mỹ thuật , truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và hướng phòng nhìn ra biển. Đặt biệt, khách có thể ngắm trực tiếp tại phòng của mình khi bình minh ló vạng vào buổi sớm mai hoặc màu xanh ngọc bích của biển và màu trắng bạt của những cơn sóng sô bờ như một bức tranh thủy mạc, tạo cho khách cảm giác thư giảng, thoải mái và rất an yên, trầm lăng."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    11
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'rock-deluxe-room-14',
    '{"vi":"Rock Deluxe Room","en":"Rock Deluxe Room"}'::jsonb,
    '{"vi":"Diện tích phòng: 21m2 - 01 giường đôi","en":"Diện tích phòng: 21m2 - 01 giường đôi"}'::jsonb,
    '24 m²',
    2,
    1776000,
    '[{"vi":"Hướngsân vườn","en":"Garden view"},{"vi":"Đôi","en":"Couple"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/cover14.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/dai-dien.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-10.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-11.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-12.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-13.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-14.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-16.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-4.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-5.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-7.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-8.jpg","https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/rock-room-9.jpg"]'::jsonb,
    'couple',
    NULL,
    '[{"who":"Hoài Thu · Hà Nội","score":"9.6","text":{"vi":"Phòng 14 không phải phòng trang trí theo chủ đề. Đó là vách đá thật trong phòng ngủ, đêm nghe rõ tiếng suối.","en":"Room 14 is not a themed room. That is an actual cliff in the bedroom, and you can hear the stream at night."}},{"who":"Đức Anh · Đà Nẵng","score":"9.2","text":{"vi":"Ngủ trong hang đá nghe hơi lạ nhưng ấm và rất yên. Sáng dậy mở cửa là thấy vườn.","en":"Sleeping in a cave sounds odd but it is warm and very quiet. You open the door onto the garden."}}]'::jsonb,
    2,
    2,
    0,
    '{"vi":"Diện tích phòng: 21m2 - 01 giường đôi","en":"Diện tích phòng: 21m2 - 01 giường đôi"}'::jsonb,
    '{"vi":"Hướngsân vườn","en":"Garden view"}'::jsonb,
    '{"vi":"Đặt biệt phòng được thiết kế trong vách đá tự nhiên, chủ nhân cố tình giữ những tảng đá to thô cứng đễ tạo nên 01 căn phòng tinh tế , mát lạnh và gần gủi với thiên nhiên. Phòng có diện tích khoảng 24 m2, 01 giường đôi lớn được đặt trên mõm đá vững chắc, có kệ treo quần áo, bố trí 01 lòa sưởi kiểu Châu Âu, suối nước, phòng tắm , bàn lavabo, wc được bố trí trong hang đá tự nhiên, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ lớn bắng khung gổ và kính trong suốt tạo điều kiện cho khách nằm ngay tại giường ngủ có thể ngắm cây cỏ, hoa lá tự nhiên xanh mượt nhấp nhơ dưới thung lũng hoặc thỉnh thoảng bắt gặp các chú mèo hoang nằm tắm nắng trên các tảng đá to, phẳng như mặt bàn giúp khách có kỳ nghỉ đáng nhớ tại đây.","en":"Đặt biệt phòng được thiết kế trong vách đá tự nhiên, chủ nhân cố tình giữ những tảng đá to thô cứng đễ tạo nên 01 căn phòng tinh tế , mát lạnh và gần gủi với thiên nhiên. Phòng có diện tích khoảng 24 m2, 01 giường đôi lớn được đặt trên mõm đá vững chắc, có kệ treo quần áo, bố trí 01 lòa sưởi kiểu Châu Âu, suối nước, phòng tắm , bàn lavabo, wc được bố trí trong hang đá tự nhiên, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ lớn bắng khung gổ và kính trong suốt tạo điều kiện cho khách nằm ngay tại giường ngủ có thể ngắm cây cỏ, hoa lá tự nhiên xanh mượt nhấp nhơ dưới thung lũng hoặc thỉnh thoảng bắt gặp các chú mèo hoang nằm tắm nắng trên các tảng đá to, phẳng như mặt bàn giúp khách có kỳ nghỉ đáng nhớ tại đây."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Tra cà phê ( túi lọc) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    12
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-giuong-doi-15',
    '{"vi":"Phòng giường đôi","en":"Phòng giường đôi"}'::jsonb,
    '{"vi":"1 giường đôi lớn, Diện tích 18 m2","en":"1 giường đôi lớn, Diện tích 18 m2"}'::jsonb,
    '18 m²',
    2,
    1587000,
    '[{"vi":"Nhìn ra sân vườn","en":"Garden view"},{"vi":"Đôi","en":"Couple"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/cover15.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-1.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-2.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-3.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-4.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/p-15.1.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/p-15.2.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/p-15.3.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/p-15.4.jpg"]'::jsonb,
    'couple',
    NULL,
    '[]'::jsonb,
    2,
    2,
    0,
    '{"vi":"1 giường đôi lớn, Diện tích 18 m2","en":"1 giường đôi lớn, Diện tích 18 m2"}'::jsonb,
    '{"vi":"Nhìn ra sân vườn","en":"Garden view"}'::jsonb,
    '{"vi":"Phòng có diện tích khoảng 18 m2, có trang bị tủ áo, bố trí 01 ghế bật thư giãn, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí tiện lợi, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ lấy không khí từ bên ngoài, thoáng, trong lành ngay trên đồi cao của khách sạn The Nam Du Hill","en":"Phòng có diện tích khoảng 18 m2, có trang bị tủ áo, bố trí 01 ghế bật thư giãn, truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí tiện lợi, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ lấy không khí từ bên ngoài, thoáng, trong lành ngay trên đồi cao của khách sạn The Nam Du Hill"}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Tra cà phê ( túi lọc) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    13
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'first-floor-family-with-sea-view-16',
    '{"vi":"First Floor Family with Sea View","en":"First Floor Family with Sea View"}'::jsonb,
    '{"vi":"2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 31m2","en":"2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 31m2"}'::jsonb,
    '31 m²',
    4,
    2987000,
    '[{"vi":"Nhìn hướng biển","en":"Sea view"},{"vi":"Gia đình","en":"Family"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/cover-16.jpg","https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-1.jpg","https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-2.jpg","https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-3.jpg"]'::jsonb,
    'family',
    NULL,
    '[]'::jsonb,
    4,
    4,
    0,
    '{"vi":"2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 31m2","en":"2 giường đôi - 01 giường đôi trung và 1 giường đôi lớn. Diện tích 31m2"}'::jsonb,
    '{"vi":"Nhìn hướng biển","en":"Sea view"}'::jsonb,
    '{"vi":"Phòng có diện tích khoảng 31 m2, 02 giường đôi, có trang bị tủ áo, bố trí 01 ghế trứng mỹ thuật , truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên, hướng phòng nhìn ra biển/ rừng cây. Đặt biệt, phòng được trang trí bởi một bức tranh với chủ đề sóng biễn nhấp nhô cùng đàn cá được khắc từ gổ nhiều màu tạo cho khách cảm giác thư giảng và rất gần gủi với thiên nhiên.","en":"Phòng có diện tích khoảng 31 m2, 02 giường đôi, có trang bị tủ áo, bố trí 01 ghế trứng mỹ thuật , truy cập wifi miễn phí, phòng tắm , bàn lavabo, wc được bố trí chia khu riêng biệt. Vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên, hướng phòng nhìn ra biển/ rừng cây. Đặt biệt, phòng được trang trí bởi một bức tranh với chủ đề sóng biễn nhấp nhô cùng đàn cá được khắc từ gổ nhiều màu tạo cho khách cảm giác thư giảng và rất gần gủi với thiên nhiên."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    14
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-03-nguoi-huong-thung-lung-bien-17',
    '{"vi":"Phòng 03 người - Hướng thung lũng/ biển","en":"Phòng 03 người - Hướng thung lũng/ biển"}'::jsonb,
    '{"vi":"Diện tích phòng: 26 m2, hướng nhìn ra biển/ thung lũng","en":"Diện tích phòng: 26 m2, hướng nhìn ra biển/ thung lũng"}'::jsonb,
    '26 m²',
    3,
    2411000,
    '[{"vi":"Hướng thung lũng / biển","en":"Valley / sea view"},{"vi":"03 khách","en":"3 guests"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/cover-17.jpg","https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-7.jpg","https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-8.jpg","https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-1.jpg","https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-10.jpg","https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-2.jpg","https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-3.jpg","https://thenamduhill.com/image/catalog/room-suite/17-phong-03-nguoi-view-bien/view-bien-5.jpg"]'::jsonb,
    'family',
    NULL,
    '[]'::jsonb,
    3,
    3,
    0,
    '{"vi":"Diện tích phòng: 26 m2, hướng nhìn ra biển/ thung lũng","en":"Diện tích phòng: 26 m2, hướng nhìn ra biển/ thung lũng"}'::jsonb,
    '{"vi":"Nhìn ra biển và sân vườn","en":"Sea and garden view"}'::jsonb,
    '{"vi":"Phòng có diện tích khoảng 26 m2, có trang bị tủ áo, phòng tắm, wc, bàn lavabo bố trí riêng biệt, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn đón ánh sáng tự nhiên và thoáng mát, trong lành.","en":"Phòng có diện tích khoảng 26 m2, có trang bị tủ áo, phòng tắm, wc, bàn lavabo bố trí riêng biệt, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn đón ánh sáng tự nhiên và thoáng mát, trong lành."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Trà, cà phê (túi lộc) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    15
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'phong-03-nguoi-co-ban-cong-18',
    '{"vi":"Phòng 03 người - Có ban công","en":"Phòng 03 người - Có ban công"}'::jsonb,
    '{"vi":"Diện tích phòng: 32 m2 / Ban công rộng/ Hướng thung lũng/ Biển","en":"Diện tích phòng: 32 m2 / Ban công rộng/ Hướng thung lũng/ Biển"}'::jsonb,
    '32 m²',
    3,
    2411000,
    '[{"vi":"Hướng thung lũng / biển","en":"Valley / sea view"},{"vi":"Ban công","en":"Balcony"},{"vi":"03 khách","en":"3 guests"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/cover-18.jpg","https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-1.jpg","https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-10.jpg","https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-2.jpg","https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-3.jpg","https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-4.jpg","https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-5.jpg","https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ban-cong-9.jpg","https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/ghepfull.jpg","https://thenamduhill.com/image/catalog/room-suite/18-phong-03-nguoi-co-ban-cong/p18.jpg"]'::jsonb,
    'family',
    NULL,
    '[]'::jsonb,
    3,
    3,
    0,
    '{"vi":"Diện tích phòng: 32 m2 / Ban công rộng/ Hướng thung lũng/ Biển","en":"Diện tích phòng: 32 m2 / Ban công rộng/ Hướng thung lũng/ Biển"}'::jsonb,
    '{"vi":"Nhìn ra biển và thung lũng","en":"Sea and valley view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, sofa, ghế nằm ngoài trời, diện tích khoảng 32 m2, có trang bị tủ áo, phòng tắm , bàn lavabo, wc, bàn lavabo bố trí riêng biệt, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và nhìn từ trên đồi cao xuống thung lủng là một mảng rừng cây xanh hòa huyện cùng những bồn hoa trồng xung quanh tạo cho khách cảm giác thư giảng, thoải mái và rất gần gủi với thiên nhiên.","en":"Phòng có ban công riêng, sofa, ghế nằm ngoài trời, diện tích khoảng 32 m2, có trang bị tủ áo, phòng tắm , bàn lavabo, wc, bàn lavabo bố trí riêng biệt, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có nhiều khung cửa sổ lớn giúp đón ánh sáng và gió mát tự nhiên và nhìn từ trên đồi cao xuống thung lủng là một mảng rừng cây xanh hòa huyện cùng những bồn hoa trồng xung quanh tạo cho khách cảm giác thư giảng, thoải mái và rất gần gủi với thiên nhiên."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Trà, cà phê ( túi lọc) miễng phí","en":"Free tea and coffee (sachets)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    16
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'suite-02-phong-ngu-08-khach-08-09',
    '{"vi":"Suite 02 phòng ngủ (08 khách)","en":"Suite 02 phòng ngủ (08 khách)"}'::jsonb,
    '{"vi":"02 Phòng ngủ: gồm 04 giường đơn - 2 giường đôi cực lớn","en":"02 Phòng ngủ: gồm 04 giường đơn - 2 giường đôi cực lớn"}'::jsonb,
    '70 m²',
    8,
    5662000,
    '[{"vi":"Hướng biển, trung tâm, chợ đêm","en":"Sea, town and night-market view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Nhóm lớn","en":"Large group"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/cover-809.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-5.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/p89.1.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/p89.3.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/p89.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-1.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-10.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-11.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-12.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-14.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-15.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-16.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-17.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-18.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-20.jpg","https://thenamduhill.com/image/catalog/room-suite/8-9-suite-02-phong-ngu-8-khach/suite-phong-ngu-89-21.jpg"]'::jsonb,
    'suite',
    NULL,
    '[{"who":"Gia đình Bảo Long · Rạch Giá","score":"9.0","text":{"vi":"Nhà tôi 8 người ở vừa đủ, không phải thuê 3 phòng rời.","en":"Eight of us fitted comfortably instead of renting three separate rooms."}}]'::jsonb,
    8,
    8,
    0,
    '{"vi":"02 Phòng ngủ: gồm 04 giường đơn - 2 giường đôi cực lớn","en":"02 Phòng ngủ: gồm 04 giường đơn - 2 giường đôi cực lớn"}'::jsonb,
    '{"vi":"Hướng biển, trung tâm, chợ đêm","en":"Sea, town and night-market view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, diện tích sàn khoảng 70 m2, bố trí 02 phòng ngủ riêng biệt, mỗi phòng có 01 tầng trệt và 01 tầng lửng, tầng trệt đặt 02 giường đơn , tầng lửng được bố trí 01 giường đôi cực lớn, 02 tủ áo, 02 bàn, 04 wc và bàn lavabo được bố trí khu riêng biệt, 04 phòng tắm, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ, thoáng mát, đón ánh sáng tự nhiên, không khí rất trong lành, tầm nhìn hướng biển, trung tâm đảo, chợ đêm.","en":"Phòng có ban công riêng, diện tích sàn khoảng 70 m2, bố trí 02 phòng ngủ riêng biệt, mỗi phòng có 01 tầng trệt và 01 tầng lửng, tầng trệt đặt 02 giường đơn , tầng lửng được bố trí 01 giường đôi cực lớn, 02 tủ áo, 02 bàn, 04 wc và bàn lavabo được bố trí khu riêng biệt, 04 phòng tắm, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có cửa sổ, thoáng mát, đón ánh sáng tự nhiên, không khí rất trong lành, tầm nhìn hướng biển, trung tâm đảo, chợ đêm."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    17
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'suite-02-phong-ngu-06-khach-10-11',
    '{"vi":"Suite 02 phòng ngủ (06 khách)","en":"Suite 02 phòng ngủ (06 khách)"}'::jsonb,
    '{"vi":"Gồm 02 phòng ngủ, 3 giường đôi /view biển","en":"Gồm 02 phòng ngủ, 3 giường đôi /view biển"}'::jsonb,
    '50 m²',
    6,
    4287000,
    '[{"vi":"Hướng biển","en":"Sea view"},{"vi":"Ban công","en":"Balcony"},{"vi":"Nhóm lớn","en":"Large group"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/10-11-suite-6-khach/cover.jpg","https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/dai-dien.jpg","https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-3.jpg","https://thenamduhill.com/image/catalog/room-suite/10-phong-giuong-doi-co-san-trong/san-trong-4.jpg","https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-12.jpg","https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-1.jpg","https://thenamduhill.com/image/catalog/room-suite/11-phong-gia-dinh-view-bien/phong-view-bien-11.jpg","https://thenamduhill.com/image/catalog/room-suite/10-11-suite-6-khach/p10_11.1.jpg"]'::jsonb,
    'suite',
    NULL,
    '[]'::jsonb,
    6,
    6,
    0,
    '{"vi":"Gồm 02 phòng ngủ, 3 giường đôi /view biển","en":"Gồm 02 phòng ngủ, 3 giường đôi /view biển"}'::jsonb,
    '{"vi":"Nhìn hướng biển","en":"Sea view"}'::jsonb,
    '{"vi":"Phòng có ban công riêng, ghế sofa, diện tích khoảng 50 m2, 02 phòng ngủ ,phòng 01 bố trí 02 giường đôi, phòng 02 bố trí 01 giường đôi lớn. Gồm 02 tủ áo, 02 ghế trứng mỹ thuật, 02 wc,02 bàn lavabo được bố trí khu riêng biệt, 02 phòng tắm, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ trực diện hướng biển giúp phòng thông thoáng, mát, lấy ánh sáng tự nhiên. Ưu điểm của phòng này là ôm trọn hướng biển, khách có thể ngắm bình minh vào buổi sớm mai hoặc màu xanh ngọc bích của biển và màu trắng bạt của những cơn sóng sô bờ trực tiếp tại phòng của mình cảm giác thư giảng, thoải mái và rất gần rủi với thiên nhiên.","en":"Phòng có ban công riêng, ghế sofa, diện tích khoảng 50 m2, 02 phòng ngủ ,phòng 01 bố trí 02 giường đôi, phòng 02 bố trí 01 giường đôi lớn. Gồm 02 tủ áo, 02 ghế trứng mỹ thuật, 02 wc,02 bàn lavabo được bố trí khu riêng biệt, 02 phòng tắm, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ trực diện hướng biển giúp phòng thông thoáng, mát, lấy ánh sáng tự nhiên. Ưu điểm của phòng này là ôm trọn hướng biển, khách có thể ngắm bình minh vào buổi sớm mai hoặc màu xanh ngọc bích của biển và màu trắng bạt của những cơn sóng sô bờ trực tiếp tại phòng của mình cảm giác thư giảng, thoải mái và rất gần rủi với thiên nhiên."}'::jsonb,
    NULL,
    '[{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    18
);
INSERT INTO public.room_types (
    id, name, description, area, guests, base_price, tags, images, "group",
    extra_bed_fee, reviews, max_guests, default_guests, extra_bed, bed, view,
    long_desc, long_desc_2, amenities, conditions, sort_order
) VALUES (
    'suite-02-phong-ngu-06-khach-15-16',
    '{"vi":"Suite 02 phòng ngủ (06 khách)","en":"Suite 02 phòng ngủ (06 khách)"}'::jsonb,
    '{"vi":"Gồm 03 giường đôi - 02 phòng phòng ngủ / view vườn","en":"Gồm 03 giường đôi - 02 phòng phòng ngủ / view vườn"}'::jsonb,
    '50 m²',
    6,
    4287000,
    '[{"vi":"Hướng vườn","en":"Garden view"},{"vi":"Nhóm lớn","en":"Large group"}]'::jsonb,
    '["https://thenamduhill.com/image/catalog/room-suite/15-16-suite-6-khach/cover-15-16.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-3.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-4.jpg","https://thenamduhill.com/image/catalog/room-suite/15-phong-giuong-doi/giuong-doi-1.jpg","https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-1.jpg","https://thenamduhill.com/image/catalog/room-suite/16-first-floor-family-with-sea-view/sea-view-2.jpg","https://thenamduhill.com/image/catalog/room-suite/15-16-suite-6-khach/p15_161.jpg"]'::jsonb,
    'suite',
    NULL,
    '[]'::jsonb,
    6,
    6,
    0,
    '{"vi":"Gồm 03 giường đôi - 02 phòng phòng ngủ / view vườn","en":"Gồm 03 giường đôi - 02 phòng phòng ngủ / view vườn"}'::jsonb,
    '{"vi":"Nhìn hướng vườn","en":"Garden view"}'::jsonb,
    '{"vi":"Diện tích phòng khoảng 50 m2, được bố trí 02 phòng ngủ. Phòng 01 bố trí 02 giường đôi, phòng 02 bố trí 01 giường đôi lớn. Gồm 02 tủ áo, 01 ghế trứng mỹ thuật và 01 ghế bập bênh, 02 wc, 02 bàn lavabo được bố trí riêng, 02 phòng tắm, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ hướng biển giúp phòng thông thoáng, mát và lấy ánh sáng tự nhiên","en":"Diện tích phòng khoảng 50 m2, được bố trí 02 phòng ngủ. Phòng 01 bố trí 02 giường đôi, phòng 02 bố trí 01 giường đôi lớn. Gồm 02 tủ áo, 01 ghế trứng mỹ thuật và 01 ghế bập bênh, 02 wc, 02 bàn lavabo được bố trí riêng, 02 phòng tắm, vòi tắm hoa sen kết hợp với bộ dùng tiện ích đa dạng trong phòng tắm ( bathroom amenities). Ngoài ra phòng ở có khung cửa sổ hướng biển giúp phòng thông thoáng, mát và lấy ánh sáng tự nhiên"}'::jsonb,
    NULL,
    '[{"vi":"Truy cập wifi miễn phí","en":"Free wifi"},{"vi":"Đồ vệ sinh cá nhân miễn phí","en":"Free toiletries"},{"vi":"Sử dụng hồ bơi và bida","en":"Pool and billiards access"},{"vi":"Có máy điều hòa","en":"Air conditioning"},{"vi":"Trang bị két sắt an toàn","en":"In-room safe"},{"vi":"Mini bar( có tính phí)","en":"Mini bar (chargeable)"},{"vi":"Dép mang trong nhà","en":"Indoor slippers"},{"vi":"Ấm đun nước","en":"Electric kettle"},{"vi":"Trà, cà phê(túi lọc ) miễn phí","en":"Free tea and coffee (sachets)"},{"vi":"Máy sấy tóc","en":"Hair dryer"},{"vi":"Áo choàng tắm","en":"Áo choàng tắm"}]'::jsonb,
    '[{"vi":"Không hút thuốc","en":"No smoking"}]'::jsonb,
    19
);

-- ---------------------------------------------------------------------------
-- 3. room_units — 120 phòng vật lý (MANUAL.md M8: số phòng thật chờ khách cấp)
-- ---------------------------------------------------------------------------

INSERT INTO public.room_units (id, code, room_type_id, floor, status) VALUES
    ('b2538854-9a17-4a59-8407-432a4e5bedb7'::uuid, 'A01', 'phong-gia-dinh-nhin-ra-bien-01', NULL, 'available'),
    ('b5538d0d-9717-45a0-8307-41974f5bef4a'::uuid, 'A02', 'phong-gia-dinh-nhin-ra-bien-01', NULL, 'available'),
    ('b4538b7a-9817-4733-8207-4004505bf0dd'::uuid, 'A03', 'phong-gia-dinh-nhin-ra-bien-01', NULL, 'available'),
    ('af53839b-9d17-4f12-8107-3e71495be5d8'::uuid, 'A04', 'phong-gia-dinh-nhin-ra-bien-01', NULL, 'available'),
    ('ae538208-9e17-40a5-8007-3cde4a5be76b'::uuid, 'A05', 'phong-gia-dinh-nhin-ra-bien-01', NULL, 'available'),
    ('b15386c1-9b17-4bec-8f07-3b4b4b5be8fe'::uuid, 'A06', 'phong-gia-dinh-nhin-ra-bien-01', NULL, 'available'),
    ('e1b974f2-5912-4bbf-858d-da2cf4aa3ff9'::uuid, 'B01', 'phong-gia-dinh-view-bien-08-08', NULL, 'available'),
    ('e0b9735f-5a12-4d52-888d-dee5f1aa3b40'::uuid, 'B02', 'phong-gia-dinh-view-bien-08-08', NULL, 'available'),
    ('dfb971cc-5b12-4ee5-878d-dd52f2aa3cd3'::uuid, 'B03', 'phong-gia-dinh-view-bien-08-08', NULL, 'available'),
    ('deb97039-5412-43e0-828d-d573f7aa44b2'::uuid, 'B04', 'phong-gia-dinh-view-bien-08-08', NULL, 'available'),
    ('ddb96ea6-5512-4573-818d-d3e0f8aa4645'::uuid, 'B05', 'phong-gia-dinh-view-bien-08-08', NULL, 'available'),
    ('dcb96d13-5612-4706-848d-d899f5aa418c'::uuid, 'B06', 'phong-gia-dinh-view-bien-08-08', NULL, 'available'),
    ('370532c1-959c-4c56-8bcb-3d0316aa19d8'::uuid, 'C01', 'phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', NULL, 'available'),
    ('34052e08-949c-4ac3-8ccb-3e9619aa1e91'::uuid, 'C02', 'phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', NULL, 'available'),
    ('35052f9b-939c-4930-8dcb-402918aa1cfe'::uuid, 'C03', 'phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', NULL, 'available'),
    ('3a05377a-9a9c-4435-8ecb-41bc1baa21b7'::uuid, 'C04', 'phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', NULL, 'available'),
    ('3b05390d-999c-42a2-8fcb-434f1aaa2024'::uuid, 'C05', 'phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', NULL, 'available'),
    ('38053454-989c-410f-80cb-44e21daa24dd'::uuid, 'C06', 'phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', NULL, 'available'),
    ('d032c1fa-78c1-4ec9-850f-ddb08d63b3cf'::uuid, 'D01', 'phong-tieu-chuan-giuong-doi-luc-giac-05', NULL, 'available'),
    ('cf32c067-75c1-4a10-880f-e2698e63b562'::uuid, 'D02', 'phong-tieu-chuan-giuong-doi-luc-giac-05', NULL, 'available'),
    ('ce32bed4-76c1-4ba3-870f-e0d68f63b6f5'::uuid, 'D03', 'phong-tieu-chuan-giuong-doi-luc-giac-05', NULL, 'available'),
    ('cd32bd41-7bc1-4382-8a0f-e58f8863abf0'::uuid, 'D04', 'phong-tieu-chuan-giuong-doi-luc-giac-05', NULL, 'available'),
    ('cc32bbae-7cc1-4515-890f-e3fc8963ad83'::uuid, 'D05', 'phong-tieu-chuan-giuong-doi-luc-giac-05', NULL, 'available'),
    ('cb32ba1b-79c1-405c-8c0f-e8b58a63af16'::uuid, 'D06', 'phong-tieu-chuan-giuong-doi-luc-giac-05', NULL, 'available'),
    ('f71ac9c4-6a56-4bc3-8cf9-fb7e076fa4cd'::uuid, 'E01', 'phong-deluxe-06', NULL, 'available'),
    ('fa1ace7d-6b56-4d56-8bf9-f9eb046fa014'::uuid, 'E02', 'phong-deluxe-06', NULL, 'available'),
    ('f91accea-6c56-4ee9-8af9-f858056fa1a7'::uuid, 'E03', 'phong-deluxe-06', NULL, 'available'),
    ('f41ac50b-6d56-407c-81fa-035d026f9cee'::uuid, 'E04', 'phong-deluxe-06', NULL, 'available'),
    ('f31ac378-6e56-420f-80fa-01ca036f9e81'::uuid, 'E05', 'phong-deluxe-06', NULL, 'available'),
    ('f61ac831-6f56-43a2-8ffa-0037006f99c8'::uuid, 'E06', 'phong-deluxe-06', NULL, 'available'),
    ('9e59402b-7a79-4750-84f3-6da9beb17e1e'::uuid, 'F01', 'phong-superior-co-giuong-co-king-07', NULL, 'available'),
    ('9f5941be-7d79-4c09-81f3-68f0bdb17c8b'::uuid, 'F02', 'phong-superior-co-giuong-co-king-07', NULL, 'available'),
    ('a0594351-7c79-4a76-82f3-6a83bcb17af8'::uuid, 'F03', 'phong-superior-co-giuong-co-king-07', NULL, 'available'),
    ('a15944e4-7f79-4f2f-87f3-7262c3b185fd'::uuid, 'F04', 'phong-superior-co-giuong-co-king-07', NULL, 'available'),
    ('a2594677-7e79-4d9c-88f3-73f5c2b1846a'::uuid, 'F05', 'phong-superior-co-giuong-co-king-07', NULL, 'available'),
    ('a359480a-8179-4255-85f3-6f3cc1b182d7'::uuid, 'F06', 'phong-superior-co-giuong-co-king-07', NULL, 'available'),
    ('c9c83346-db62-41b3-8820-e07823d3f5c5'::uuid, 'G01', 'phong-giuong-doi-nhin-ra-vuon-02', NULL, 'available'),
    ('c8c831b3-dc62-4346-8b20-e53120d3f10c'::uuid, 'G02', 'phong-giuong-doi-nhin-ra-vuon-02', NULL, 'available'),
    ('c7c83020-dd62-44d9-8a20-e39e21d3f29f'::uuid, 'G03', 'phong-giuong-doi-nhin-ra-vuon-02', NULL, 'available'),
    ('cec83b25-de62-466c-8d20-e8571ed3ede6'::uuid, 'G04', 'phong-giuong-doi-nhin-ra-vuon-02', NULL, 'available'),
    ('cdc83992-df62-47ff-8c20-e6c41fd3ef79'::uuid, 'G05', 'phong-giuong-doi-nhin-ra-vuon-02', NULL, 'available'),
    ('ccc837ff-e062-4992-8f20-eb7d1cd3eac0'::uuid, 'G06', 'phong-giuong-doi-nhin-ra-vuon-02', NULL, 'available'),
    ('fb84436c-0a37-4dfd-8a8b-6d369ad61847'::uuid, 'H01', 'phong-gia-dinh-view-bien-09-09', NULL, 'available'),
    ('fe844825-0737-4944-898b-6ba39bd619da'::uuid, 'H02', 'phong-gia-dinh-view-bien-09-09', NULL, 'available'),
    ('fd844692-0837-4ad7-888b-6a109cd61b6d'::uuid, 'H03', 'phong-gia-dinh-view-bien-09-09', NULL, 'available'),
    ('f8843eb3-0537-461e-8f8b-751595d61068'::uuid, 'H04', 'phong-gia-dinh-view-bien-09-09', NULL, 'available'),
    ('f7843d20-0637-47b1-8e8b-738296d611fb'::uuid, 'H05', 'phong-gia-dinh-view-bien-09-09', NULL, 'available'),
    ('fa8441d9-0337-42f8-8d8b-71ef97d6138e'::uuid, 'H06', 'phong-gia-dinh-view-bien-09-09', NULL, 'available'),
    ('edcdc909-9474-4ba0-89a0-4267b1389a7e'::uuid, 'I01', 'phong-giuong-doi-co-san-trong-10', NULL, 'available'),
    ('eacdc450-9774-4059-8aa0-43fab03898eb'::uuid, 'I02', 'phong-giuong-doi-co-san-trong-10', NULL, 'available'),
    ('ebcdc5e3-9674-4ec6-8ba0-458daf389758'::uuid, 'I03', 'phong-giuong-doi-co-san-trong-10', NULL, 'available'),
    ('f0cdcdc2-9974-437f-84a0-3a88b638a25d'::uuid, 'I04', 'phong-giuong-doi-co-san-trong-10', NULL, 'available'),
    ('f1cdcf55-9874-41ec-85a0-3c1bb538a0ca'::uuid, 'I05', 'phong-giuong-doi-co-san-trong-10', NULL, 'available'),
    ('eecdca9c-9b74-46a5-86a0-3daeb4389f37'::uuid, 'I06', 'phong-giuong-doi-co-san-trong-10', NULL, 'available'),
    ('98cb9add-98de-453e-8253-cef36a279a54'::uuid, 'J01', 'phong-gia-dinh-view-bien-11', NULL, 'available'),
    ('95cb9624-97de-43ab-8353-d0866d279f0d'::uuid, 'J02', 'phong-gia-dinh-view-bien-11', NULL, 'available'),
    ('96cb97b7-96de-4218-8453-d2196c279d7a'::uuid, 'J03', 'phong-gia-dinh-view-bien-11', NULL, 'available'),
    ('93cb92fe-9dde-4d1d-8553-d3ac6727959b'::uuid, 'J04', 'phong-gia-dinh-view-bien-11', NULL, 'available'),
    ('94cb9491-9cde-4b8a-8653-d53f66279408'::uuid, 'J05', 'phong-gia-dinh-view-bien-11', NULL, 'available'),
    ('91cb8fd8-9bde-49f7-8753-d6d2692798c1'::uuid, 'J06', 'phong-gia-dinh-view-bien-11', NULL, 'available'),
    ('94bee8e1-828e-4fce-88f2-d467576ee88c'::uuid, 'K01', 'phong-giuong-doi-co-ban-cong-12', NULL, 'available'),
    ('91bee428-818e-4e3b-89f2-d5fa5a6eed45'::uuid, 'K02', 'phong-giuong-doi-co-ban-cong-12', NULL, 'available'),
    ('92bee5bb-808e-4ca8-8af2-d78d596eebb2'::uuid, 'K03', 'phong-giuong-doi-co-ban-cong-12', NULL, 'available'),
    ('97beed9a-878e-47ad-83f2-cc88546ee3d3'::uuid, 'K04', 'phong-giuong-doi-co-ban-cong-12', NULL, 'available'),
    ('98beef2d-868e-461a-84f2-ce1b536ee240'::uuid, 'K05', 'phong-giuong-doi-co-ban-cong-12', NULL, 'available'),
    ('95beea74-858e-4487-85f2-cfae566ee6f9'::uuid, 'K06', 'phong-giuong-doi-co-ban-cong-12', NULL, 'available'),
    ('842fce1f-54d8-4282-8f31-10ad6bcbcbf8'::uuid, 'L01', 'second-floor-family-with-sea-view-13', NULL, 'available'),
    ('852fcfb2-53d8-40ef-8c31-0bf46ecbd0b1'::uuid, 'L02', 'second-floor-family-with-sea-view-13', NULL, 'available'),
    ('862fd145-52d8-4f5c-8d31-0d876dcbcf1e'::uuid, 'L03', 'second-floor-family-with-sea-view-13', NULL, 'available'),
    ('7f2fc640-51d8-4dc9-8a31-08ce70cbd3d7'::uuid, 'L04', 'second-floor-family-with-sea-view-13', NULL, 'available'),
    ('802fc7d3-50d8-4c36-8b31-0a616fcbd244'::uuid, 'L05', 'second-floor-family-with-sea-view-13', NULL, 'available'),
    ('812fc966-4fd8-4aa3-8831-05a872cbd6fd'::uuid, 'L06', 'second-floor-family-with-sea-view-13', NULL, 'available'),
    ('a60bb07a-fa5e-42b1-896c-2b28c16ace97'::uuid, 'M01', 'rock-deluxe-room-14', NULL, 'available'),
    ('a50baee7-f75e-4df8-8c6c-2fe1c26ad02a'::uuid, 'M02', 'rock-deluxe-room-14', NULL, 'available'),
    ('a40bad54-f85e-4f8b-8b6c-2e4ec36ad1bd'::uuid, 'M03', 'rock-deluxe-room-14', NULL, 'available'),
    ('a30babc1-fd5e-476a-8e6c-3307bc6ac6b8'::uuid, 'M04', 'rock-deluxe-room-14', NULL, 'available'),
    ('a20baa2e-fe5e-48fd-8d6c-3174bd6ac84b'::uuid, 'M05', 'rock-deluxe-room-14', NULL, 'available'),
    ('a10ba89b-fb5e-4444-806c-362dbe6ac9de'::uuid, 'M06', 'rock-deluxe-room-14', NULL, 'available'),
    ('fa36dd8f-3b1f-49f8-8acf-2699686b4d82'::uuid, 'N01', 'phong-giuong-doi-15', NULL, 'available'),
    ('fb36df22-3e1f-4eb1-87cf-21e0676b4bef'::uuid, 'N02', 'phong-giuong-doi-15', NULL, 'available'),
    ('fc36e0b5-3d1f-4d1e-88cf-2373666b4a5c'::uuid, 'N03', 'phong-giuong-doi-15', NULL, 'available'),
    ('f536d5b0-401f-41d7-8dcf-2b52656b48c9'::uuid, 'N04', 'phong-giuong-doi-15', NULL, 'available'),
    ('f636d743-3f1f-4044-8ecf-2ce5646b4736'::uuid, 'N05', 'phong-giuong-doi-15', NULL, 'available'),
    ('f736d8d6-421f-44fd-8bcf-282c636b45a3'::uuid, 'N06', 'phong-giuong-doi-15', NULL, 'available'),
    ('3c5bf3d8-8563-4a8f-8cf6-11362589acdd'::uuid, 'O01', 'first-floor-family-with-sea-view-16', NULL, 'available'),
    ('3f5bf891-8663-4c22-8bf6-0fa32289a824'::uuid, 'O02', 'first-floor-family-with-sea-view-16', NULL, 'available'),
    ('3e5bf6fe-8763-4db5-8af6-0e102389a9b7'::uuid, 'O03', 'first-floor-family-with-sea-view-16', NULL, 'available'),
    ('415bfbb7-8063-42b0-81f6-19152089a4fe'::uuid, 'O04', 'first-floor-family-with-sea-view-16', NULL, 'available'),
    ('405bfa24-8163-4443-80f6-17822189a691'::uuid, 'O05', 'first-floor-family-with-sea-view-16', NULL, 'available'),
    ('435bfedd-8263-45d6-8ff6-15ef1e89a1d8'::uuid, 'O06', 'first-floor-family-with-sea-view-16', NULL, 'available'),
    ('aefde400-e9f6-4c4f-8ceb-10de622d0345'::uuid, 'P01', 'phong-03-nguoi-huong-thung-lung-bien-17', NULL, 'available'),
    ('b1fde8b9-eaf6-4de2-8beb-0f4b5f2cfe8c'::uuid, 'P02', 'phong-03-nguoi-huong-thung-lung-bien-17', NULL, 'available'),
    ('b0fde726-ebf6-4f75-8aeb-0db8602d001f'::uuid, 'P03', 'phong-03-nguoi-huong-thung-lung-bien-17', NULL, 'available'),
    ('b3fdebdf-e4f6-4470-81eb-18bd5d2cfb66'::uuid, 'P04', 'phong-03-nguoi-huong-thung-lung-bien-17', NULL, 'available'),
    ('b2fdea4c-e5f6-4603-80eb-172a5e2cfcf9'::uuid, 'P05', 'phong-03-nguoi-huong-thung-lung-bien-17', NULL, 'available'),
    ('b5fdef05-e6f6-4796-8feb-15975b2cf840'::uuid, 'P06', 'phong-03-nguoi-huong-thung-lung-bien-17', NULL, 'available'),
    ('7ae2326b-ae3e-46d4-83e2-bb39e1d878d2'::uuid, 'Q01', 'phong-03-nguoi-co-ban-cong-18', NULL, 'available'),
    ('7be233fe-b13e-4b8d-80e2-b680e0d8773f'::uuid, 'Q02', 'phong-03-nguoi-co-ban-cong-18', NULL, 'available'),
    ('7ce23591-b03e-49fa-81e2-b813dfd875ac'::uuid, 'Q03', 'phong-03-nguoi-co-ban-cong-18', NULL, 'available'),
    ('7de23724-ab3e-421b-86e2-bff2ded87419'::uuid, 'Q04', 'phong-03-nguoi-co-ban-cong-18', NULL, 'available'),
    ('7ee238b7-aa3e-4088-87e2-c185ddd87286'::uuid, 'Q05', 'phong-03-nguoi-co-ban-cong-18', NULL, 'available'),
    ('7fe23a4a-ad3e-4541-84e2-bcccdcd870f3'::uuid, 'Q06', 'phong-03-nguoi-co-ban-cong-18', NULL, 'available'),
    ('43812942-0a35-40a1-8308-4150edec0cbf'::uuid, 'R01', 'suite-02-phong-ngu-08-khach-08-09', NULL, 'available'),
    ('428127af-0735-4be8-8608-4609eeec0e52'::uuid, 'R02', 'suite-02-phong-ngu-08-khach-08-09', NULL, 'available'),
    ('4181261c-0835-4d7b-8508-4476efec0fe5'::uuid, 'R03', 'suite-02-phong-ngu-08-khach-08-09', NULL, 'available'),
    ('40812489-0d35-455a-8808-492fe8ec04e0'::uuid, 'R04', 'suite-02-phong-ngu-08-khach-08-09', NULL, 'available'),
    ('3f8122f6-0e35-46ed-8708-479ce9ec0673'::uuid, 'R05', 'suite-02-phong-ngu-08-khach-08-09', NULL, 'available'),
    ('3e812163-0b35-4234-8a08-4c55eaec0806'::uuid, 'R06', 'suite-02-phong-ngu-08-khach-08-09', NULL, 'available'),
    ('0626b466-2e2e-44e9-8bff-ed70f62da4d3'::uuid, 'S01', 'suite-02-phong-ngu-06-khach-10-11', NULL, 'available'),
    ('0526b2d3-2b2e-4030-8eff-f229f72da666'::uuid, 'S02', 'suite-02-phong-ngu-06-khach-10-11', NULL, 'available'),
    ('0426b140-2c2e-41c3-8dff-f096f82da7f9'::uuid, 'S03', 'suite-02-phong-ngu-06-khach-10-11', NULL, 'available'),
    ('0b26bc45-312e-49a2-80ff-f54ff92da98c'::uuid, 'S04', 'suite-02-phong-ngu-06-khach-10-11', NULL, 'available'),
    ('0a26bab2-322e-4b35-8fff-f3bcfa2dab1f'::uuid, 'S05', 'suite-02-phong-ngu-06-khach-10-11', NULL, 'available'),
    ('0926b91f-2f2e-467c-82ff-f875fb2dacb2'::uuid, 'S06', 'suite-02-phong-ngu-06-khach-10-11', NULL, 'available'),
    ('cd36e596-b72e-4a05-8af6-dffcd7bd6f03'::uuid, 'T01', 'suite-02-phong-ngu-06-khach-15-16', NULL, 'available'),
    ('cc36e403-b42e-454c-8df6-e4b5d8bd7096'::uuid, 'T02', 'suite-02-phong-ngu-06-khach-15-16', NULL, 'available'),
    ('cb36e270-b52e-46df-8cf6-e322d9bd7229'::uuid, 'T03', 'suite-02-phong-ngu-06-khach-15-16', NULL, 'available'),
    ('d236ed75-b22e-4226-87f6-db43dabd73bc'::uuid, 'T04', 'suite-02-phong-ngu-06-khach-15-16', NULL, 'available'),
    ('d136ebe2-b32e-43b9-86f6-d9b0dbbd754f'::uuid, 'T05', 'suite-02-phong-ngu-06-khach-15-16', NULL, 'available'),
    ('d036ea4f-b02e-4f00-89f6-de69dcbd76e2'::uuid, 'T06', 'suite-02-phong-ngu-06-khach-15-16', NULL, 'available');

-- ---------------------------------------------------------------------------
-- 4. seasons — 5 mùa vụ
-- ---------------------------------------------------------------------------

INSERT INTO public.seasons (id, name, date_from, date_to, multiplier, weekend_multiplier, priority)
VALUES ('low', '{"vi":"Mùa thấp điểm","en":"Low season"}'::jsonb, '2026-09-01', '2026-11-30', 0.8, 0.9, 30);
INSERT INTO public.seasons (id, name, date_from, date_to, multiplier, weekend_multiplier, priority)
VALUES ('high-summer', '{"vi":"Cao điểm hè","en":"Summer peak"}'::jsonb, '2026-06-01', '2026-08-31', 1.25, 1.45, 20);
INSERT INTO public.seasons (id, name, date_from, date_to, multiplier, weekend_multiplier, priority)
VALUES ('high-winter', '{"vi":"Cao điểm khô","en":"Dry season peak"}'::jsonb, '2026-12-01', '2027-04-30', 1.2, 1.4, 20);
INSERT INTO public.seasons (id, name, date_from, date_to, multiplier, weekend_multiplier, priority)
VALUES ('holiday-30-4', '{"vi":"Lễ 30/4 – 1/5","en":"Reunification & Labour Day"}'::jsonb, '2027-04-29', '2027-05-03', 1.8, NULL, 10);
INSERT INTO public.seasons (id, name, date_from, date_to, multiplier, weekend_multiplier, priority)
VALUES ('holiday-2-9', '{"vi":"Lễ Quốc khánh 2/9","en":"National Day"}'::jsonb, '2026-08-31', '2026-09-03', 1.7, NULL, 10);

-- ---------------------------------------------------------------------------
-- 5. rate_plans — 3 gói giá (cancellation_rules: MANUAL.md M7 chờ khách chốt)
-- ---------------------------------------------------------------------------

INSERT INTO public.rate_plans (
    id, name, description, adjust_percent, includes_breakfast, refundable,
    cancellation_rules, deposit_percent, room_type_ids
) VALUES (
    'standard',
    '{"vi":"Tiêu chuẩn","en":"Standard"}'::jsonb,
    '{"vi":"Huỷ miễn phí trước 7 ngày. Cọc 30%, còn lại trả tại quầy.","en":"Free cancellation up to 7 days before arrival. 30% deposit, balance on arrival."}'::jsonb,
    0, TRUE, TRUE,
    '[{"daysBeforeCheckIn":7,"refundPercent":100},{"daysBeforeCheckIn":3,"refundPercent":50},{"daysBeforeCheckIn":0,"refundPercent":0}]'::jsonb, 30, '[]'::jsonb
);
INSERT INTO public.rate_plans (
    id, name, description, adjust_percent, includes_breakfast, refundable,
    cancellation_rules, deposit_percent, room_type_ids
) VALUES (
    'saver',
    '{"vi":"Tiết kiệm","en":"Saver"}'::jsonb,
    '{"vi":"Rẻ hơn 15% nhưng không hoàn tiền. Thanh toán đủ khi đặt.","en":"15% cheaper, non-refundable. Full payment on booking."}'::jsonb,
    -15, FALSE, FALSE,
    '[]'::jsonb, 100, '[]'::jsonb
);
INSERT INTO public.rate_plans (
    id, name, description, adjust_percent, includes_breakfast, refundable,
    cancellation_rules, deposit_percent, room_type_ids
) VALUES (
    'full-board',
    '{"vi":"Trọn gói ăn uống","en":"Full board"}'::jsonb,
    '{"vi":"Bao gồm ăn sáng, trưa và tối tại nhà hàng. Huỷ miễn phí trước 7 ngày.","en":"Includes breakfast, lunch and dinner. Free cancellation up to 7 days before arrival."}'::jsonb,
    35, TRUE, TRUE,
    '[{"daysBeforeCheckIn":7,"refundPercent":100},{"daysBeforeCheckIn":3,"refundPercent":50},{"daysBeforeCheckIn":0,"refundPercent":0}]'::jsonb, 50, '[]'::jsonb
);

-- ---------------------------------------------------------------------------
-- 6. addons — 6 dịch vụ thêm. Đưa đón tàu Rạch Giá sort_order=0 (§B6)
-- ---------------------------------------------------------------------------

INSERT INTO public.addons (id, name, price, unit, sort_order)
VALUES ('addon-ferry', '{"vi":"Vé tàu cao tốc khứ hồi","en":"Return speedboat ticket"}'::jsonb, 450000, '{"vi":"khách","en":"guest"}'::jsonb, 0);
INSERT INTO public.addons (id, name, price, unit, sort_order)
VALUES ('addon-extrabed', '{"vi":"Giường phụ","en":"Extra bed"}'::jsonb, 450000, '{"vi":"khách / đêm","en":"guest / night"}'::jsonb, 1);
INSERT INTO public.addons (id, name, price, unit, sort_order)
VALUES ('addon-bike', '{"vi":"Thuê xe máy vòng đảo","en":"Motorbike rental"}'::jsonb, 150000, '{"vi":"xe / ngày","en":"bike / day"}'::jsonb, 2);
INSERT INTO public.addons (id, name, price, unit, sort_order)
VALUES ('addon-bbq', '{"vi":"Set BBQ hải sản","en":"Seafood BBQ set"}'::jsonb, 320000, '{"vi":"khách","en":"guest"}'::jsonb, 3);
INSERT INTO public.addons (id, name, price, unit, sort_order)
VALUES ('addon-tour', '{"vi":"Tour lặn ngắm san hô","en":"Snorkelling tour"}'::jsonb, 400000, '{"vi":"khách","en":"guest"}'::jsonb, 4);
INSERT INTO public.addons (id, name, price, unit, sort_order)
VALUES ('addon-pickup', '{"vi":"Đưa đón bến tàu Bãi Chệt","en":"Bai Chet pier transfer"}'::jsonb, 0, '{"vi":"miễn phí","en":"free"}'::jsonb, 5);

-- ---------------------------------------------------------------------------
-- 7. promotions — 7 khuyến mãi, phủ đủ 7 kiểu
-- ---------------------------------------------------------------------------

INSERT INTO public.promotions (
    id, code, name, description, type, value, conditions, stackable, priority,
    max_discount, usage_limit, usage_count, per_customer_limit, active
) VALUES (
    'early-bird-30', NULL,
    '{"vi":"Đặt sớm 30 ngày","en":"Early bird 30 days"}'::jsonb,
    '{"vi":"Giảm 15% khi đặt trước ngày nhận phòng ít nhất 30 ngày.","en":"Save 15% when booking at least 30 days before arrival."}'::jsonb,
    'early-bird', 15, '{"daysBeforeCheckIn":30,"channels":["web"]}'::jsonb, TRUE, 10,
    NULL, NULL, 0, NULL, TRUE
);
INSERT INTO public.promotions (
    id, code, name, description, type, value, conditions, stackable, priority,
    max_discount, usage_limit, usage_count, per_customer_limit, active
) VALUES (
    'last-minute', NULL,
    '{"vi":"Đặt sát ngày","en":"Last minute"}'::jsonb,
    '{"vi":"Giảm 20% khi đặt trong vòng 3 ngày trước khi nhận phòng.","en":"Save 20% when booking within 3 days of arrival."}'::jsonb,
    'last-minute', 20, '{"daysBeforeCheckIn":3,"channels":["web"]}'::jsonb, TRUE, 15,
    800000, NULL, 0, NULL, TRUE
);
INSERT INTO public.promotions (
    id, code, name, description, type, value, conditions, stackable, priority,
    max_discount, usage_limit, usage_count, per_customer_limit, active
) VALUES (
    'long-stay', NULL,
    '{"vi":"Ở dài ngày","en":"Long stay"}'::jsonb,
    '{"vi":"Ở từ 3 đêm giảm 10%, từ 5 đêm giảm 15%.","en":"Stay 3+ nights save 10%, 5+ nights save 15%."}'::jsonb,
    'long-stay', 0, '{"tiers":[{"minNights":3,"percent":10},{"minNights":5,"percent":15}]}'::jsonb, TRUE, 20,
    NULL, NULL, 0, NULL, TRUE
);
INSERT INTO public.promotions (
    id, code, name, description, type, value, conditions, stackable, priority,
    max_discount, usage_limit, usage_count, per_customer_limit, active
) VALUES (
    'fourth-night-free', NULL,
    '{"vi":"Đêm thứ 4 miễn phí","en":"4th night free"}'::jsonb,
    '{"vi":"Ở 4 đêm trở lên được tặng một đêm.","en":"Stay 4 nights or more and get one night free."}'::jsonb,
    'nth-night-free', 4, '{"minNights":4,"stayFrom":"2026-09-01","stayTo":"2026-11-30"}'::jsonb, FALSE, 90,
    NULL, NULL, 0, NULL, TRUE
);
INSERT INTO public.promotions (
    id, code, name, description, type, value, conditions, stackable, priority,
    max_discount, usage_limit, usage_count, per_customer_limit, active
) VALUES (
    'code-namdu10', 'NAMDU10',
    '{"vi":"Mã NAMDU10","en":"Code NAMDU10"}'::jsonb,
    '{"vi":"Giảm 10% cho mọi hạng phòng, tối đa 500.000đ.","en":"Save 10% on any room type, up to 500,000₫."}'::jsonb,
    'percent', 10, '{"minAmount":1000000}'::jsonb, TRUE, 30,
    500000, 200, 47, 1, TRUE
);
INSERT INTO public.promotions (
    id, code, name, description, type, value, conditions, stackable, priority,
    max_discount, usage_limit, usage_count, per_customer_limit, active
) VALUES (
    'code-welcome', 'WELCOME',
    '{"vi":"Khách mới","en":"First-time guest"}'::jsonb,
    '{"vi":"Giảm ngay 200.000đ cho lần đặt đầu tiên.","en":"Get 200,000₫ off your first booking."}'::jsonb,
    'fixed', 200000, '{"channels":["web"]}'::jsonb, TRUE, 35,
    NULL, NULL, 12, 1, TRUE
);
INSERT INTO public.promotions (
    id, code, name, description, type, value, conditions, stackable, priority,
    max_discount, usage_limit, usage_count, per_customer_limit, active
) VALUES (
    'free-ferry', NULL,
    '{"vi":"Tặng vé tàu Rạch Giá","en":"Free Rach Gia ferry"}'::jsonb,
    '{"vi":"Tặng đưa đón tàu cao tốc khứ hồi khi ở từ 3 đêm.","en":"Complimentary return speedboat transfer for stays of 3+ nights."}'::jsonb,
    'free-addon', 700000, '{"minNights":3,"freeAddonIds":["ferry"]}'::jsonb, TRUE, 25,
    NULL, NULL, 0, NULL, FALSE
);

-- ---------------------------------------------------------------------------
-- 8. accounts — 4 tài khoản nhân viên đủ 4 vai trò nội bộ
-- Mật khẩu thô nằm ở MANUAL.md M12; file này CHỈ chứa hash bcryptjs cost 12.
-- Danh sách nhân viên thật: MANUAL.md M9.
-- ---------------------------------------------------------------------------

INSERT INTO public.accounts (id, role, full_name, phone, email, password_hash)
VALUES ('4db0988d-dc4d-438a-8dcc-38ab89fb0638'::uuid, 'owner', 'Chủ cơ sở (demo)', '0900000001', 'owner@namduhill.demo', '$2b$12$P05okENXesBnhhU2I/0/Y.Z1y5tZtucG7jALWJbqF/zbuKCFf9ff2');
INSERT INTO public.accounts (id, role, full_name, phone, email, password_hash)
VALUES ('45246de9-f7d7-4eb6-8d05-5ec3fe4596e0'::uuid, 'manager', 'Quản lý (demo)', '0900000002', 'manager@namduhill.demo', '$2b$12$Ul.MwHOsOuNQv.M54gk1y.eIWW7tGrW4sKpTwN3A16ePfqEij6Tlu');
INSERT INTO public.accounts (id, role, full_name, phone, email, password_hash)
VALUES ('31379bb9-9220-4258-803a-6707489fe7de'::uuid, 'receptionist', 'Lễ tân (demo)', '0900000003', 'receptionist@namduhill.demo', '$2b$12$4Bli7scwoSB/xyIXmNnj5OZE3YQJ.AXBU75W2KFL6WeOGjTig3A.K');
INSERT INTO public.accounts (id, role, full_name, phone, email, password_hash)
VALUES ('12b7b8e3-fee9-4ff2-80f8-be35731a2e04'::uuid, 'editor', 'Biên tập nội dung (demo)', '0900000004', 'editor@namduhill.demo', '$2b$12$YOeaH8HYrxWarKdYCvxwaOkK5KiIHU4ZAOH7DydR3YJ4crrf11Wd.');

-- ---------------------------------------------------------------------------
-- 9. Nội dung marketing (bản demo — MANUAL.md M2/M6)
-- ---------------------------------------------------------------------------

INSERT INTO public.dining (id, name, description, note, image, sort_order)
VALUES ('dining-cafe', '{"vi":"Nam Du Hill Coffee","en":"Nam Du Hill Coffee"}'::jsonb, '{"vi":"Cà phê phin, trà đảo và mocktail trên tầng cao nhìn thẳng ra biển.","en":"Vietnamese drip coffee, island teas and mocktails on the rooftop."}'::jsonb, '{"vi":"06:30 – 22:00","en":"06:30 – 22:00"}'::jsonb, '/uploads/nha-hang-view-bien.jpg', 0);
INSERT INTO public.dining (id, name, description, note, image, sort_order)
VALUES ('dining-bbq', '{"vi":"BBQ hải sản ngoài trời","en":"Outdoor Seafood BBQ"}'::jsonb, '{"vi":"Cá xương xanh nướng giấy bạc, nhum nướng mỡ hành, ghẹ xanh hấp bia.","en":"Foil-grilled needlefish, sea urchin with scallion oil, beer-steamed crab."}'::jsonb, '{"vi":"Từ 320.000đ / khách","en":"From 320,000₫ per guest"}'::jsonb, '/uploads/hoang-hon.jpg', 1);
INSERT INTO public.dining (id, name, description, note, image, sort_order)
VALUES ('dining-hotpot', '{"vi":"Lẩu cá bớp Nam Du","en":"Nam Du Cobia Hotpot"}'::jsonb, '{"vi":"Cá bớp nuôi lồng bè Hòn Ngang, nấu cùng rau rừng và me chua.","en":"Cobia raised in Hon Ngang floating pens, cooked with island greens."}'::jsonb, '{"vi":"Phục vụ theo nhóm 4–8 khách","en":"Serves 4–8 guests"}'::jsonb, '/uploads/hero-1.jpg', 2);
INSERT INTO public.dining (id, name, description, note, image, sort_order)
VALUES ('dining-bar', '{"vi":"Sunset Bar & Karaoke","en":"Sunset Bar & Karaoke"}'::jsonb, '{"vi":"Cocktail đảo, bia lạnh và phòng karaoke riêng cho nhóm.","en":"Island cocktails, cold beer and a private karaoke room."}'::jsonb, '{"vi":"17:00 – 24:00","en":"17:00 – 24:00"}'::jsonb, '/uploads/hero-4.png', 3);
INSERT INTO public.tours (id, code, name, summary, price, days, sort_order)
VALUES ('tour-2n1d', '2N1Đ', '{"vi":"Nam Du 2 ngày 1 đêm","en":"Nam Du 2 days 1 night"}'::jsonb, '{"vi":"Nén chặt các điểm cốt lõi, tối ưu cho cuối tuần.","en":"Core highlights, ideal for a weekend."}'::jsonb, 2590000, '[{"label":{"vi":"Ngày 1 · Rạch Giá → Nam Du","en":"Day 1 · Rach Gia → Nam Du"},"items":[{"vi":"06:00 — Đến cảng Rạch Giá, ăn sáng và làm thủ tục lên tàu cao tốc.","en":"06:00 — Arrive at Rach Gia port, breakfast and ferry check-in."},{"vi":"08:00 — Tàu cao tốc ra Hòn Củ Tron (2–3 giờ). Nhận phòng tại resort.","en":"08:00 — Speedboat to Hon Cu Tron (2–3 hrs). Check in at the resort."},{"vi":"13:30 — Tàu gỗ khám phá Hòn Mấu, Hòn Dầu, Hòn Hai Bờ Đập; lặn ngắm san hô.","en":"13:30 — Wooden boat to Hon Mau, Hon Dau, Hon Hai Bo Dap; snorkelling."},{"vi":"18:30 — BBQ hải sản tại resort, karaoke và ngắm sao.","en":"18:30 — Seafood BBQ at the resort, karaoke and stargazing."}]},{"label":{"vi":"Ngày 2 · Vòng đảo → về đất liền","en":"Day 2 · Island loop → mainland"},"items":[{"vi":"06:00 — Ngắm bình minh, cà phê trên tầng cao.","en":"06:00 — Sunrise and rooftop coffee."},{"vi":"07:30 — Xe máy vòng cung đường 11 km: Bãi Cây Mến, Bãi Ngự, Hải đăng Nam Du.","en":"07:30 — Motorbike the 11 km loop: Bai Cay Men, Bai Ngu, Nam Du lighthouse."},{"vi":"11:00 — Trả phòng, ăn trưa hải sản tại Bãi Chệt.","en":"11:00 — Check out, seafood lunch at Bai Chet."},{"vi":"13:00 — Tàu cao tốc về Rạch Giá, kết thúc hành trình.","en":"13:00 — Ferry back to Rach Gia, end of trip."}]}]'::jsonb, 0);
INSERT INTO public.tours (id, code, name, summary, price, days, sort_order)
VALUES ('tour-3n2d', '3N2Đ', '{"vi":"Nam Du 3 ngày 2 đêm","en":"Nam Du 3 days 2 nights"}'::jsonb, '{"vi":"Nhịp độ thong thả, đi sâu vào đời sống làng chài.","en":"A slower pace, deeper into fishing-village life."}'::jsonb, 3890000, '[{"label":{"vi":"Ngày 1 · Làm quen Hòn Lớn","en":"Day 1 · Getting to know Hon Lon"},"items":[{"vi":"08:00 — Tàu cao tốc Rạch Giá → Nam Du, nhận phòng và nghỉ trưa.","en":"08:00 — Ferry Rach Gia → Nam Du, check in and rest."},{"vi":"15:00 — Tắm biển Bãi Cây Mến dưới hàng dừa 70–80 năm tuổi.","en":"15:00 — Swim at Bai Cay Men under 70–80-year-old coconut palms."},{"vi":"18:00 — Chợ hải sản Bãi Chệt, ăn tối tại làng chài.","en":"18:00 — Bai Chet seafood market, dinner in the village."}]},{"label":{"vi":"Ngày 2 · Tour 4 đảo","en":"Day 2 · Four-island tour"},"items":[{"vi":"07:30 — Tàu gỗ đi Hòn Mấu (5 bãi biển), Hòn Ngang, Hòn Dầu, Hòn Hai Bờ Đập.","en":"07:30 — Wooden boat to Hon Mau (5 beaches), Hon Ngang, Hon Dau, Hon Hai Bo Dap."},{"vi":"11:30 — Ăn trưa trên nhà bè nổi Hòn Ngang, thưởng thức cá bớp tươi.","en":"11:30 — Lunch on a floating raft house at Hon Ngang."},{"vi":"14:00 — Lặn ngắm san hô và chèo SUP tại Hòn Hai Bờ Đập.","en":"14:00 — Snorkelling and SUP at Hon Hai Bo Dap."},{"vi":"19:00 — Cháo nhum và BBQ tại resort.","en":"19:00 — Sea-urchin porridge and BBQ at the resort."}]},{"label":{"vi":"Ngày 3 · Văn hóa & mua sắm","en":"Day 3 · Culture & shopping"},"items":[{"vi":"06:30 — Lên Hải đăng Nam Du (hơn 300m) ngắm toàn cảnh 21 hòn đảo.","en":"06:30 — Climb Nam Du lighthouse (300m+) for the full 21-island view."},{"vi":"09:00 — Dinh Ông Nam Hải và Miếu Bà Chúa Xứ.","en":"09:00 — Dinh Ong Nam Hai and Mieu Ba Chua Xu."},{"vi":"11:00 — Mua khô mực một nắng, khô cá xương xanh, nước mắm Nam Du.","en":"11:00 — Buy dried squid, dried needlefish and Nam Du fish sauce."},{"vi":"13:00 — Tàu cao tốc về Rạch Giá.","en":"13:00 — Ferry back to Rach Gia."}]}]'::jsonb, 1);
INSERT INTO public.places (id, name, tag, description, image, sort_order)
VALUES ('place-cay-men', '{"vi":"Bãi Cây Mến","en":"Bai Cay Men"}'::jsonb, '{"vi":"Bãi tắm","en":"Beach"}'::jsonb, '{"vi":"Vịnh kín gió, cát trắng mịn, hàng dừa cổ thụ 70–80 năm tuổi nghiêng bóng ra biển.","en":"A wind-sheltered bay with fine white sand and 70–80-year-old coconut palms."}'::jsonb, '/uploads/du-lich-bai-cay-men-nam-du.jpg', 0);
INSERT INTO public.places (id, name, tag, description, image, sort_order)
VALUES ('place-bai-ngu', '{"vi":"Bãi Ngự & Giếng Ngự","en":"Bai Ngu & the King''s Well"}'::jsonb, '{"vi":"Lịch sử","en":"History"}'::jsonb, '{"vi":"Nơi vua Gia Long từng dừng chân; giếng nước ngọt sát biển không bao giờ cạn.","en":"Where King Gia Long once sheltered; a freshwater well by the sea that never runs dry."}'::jsonb, '/uploads/hero-2.jpg', 1);
INSERT INTO public.places (id, name, tag, description, image, sort_order)
VALUES ('place-hai-dang', '{"vi":"Hải đăng Nam Du","en":"Nam Du Lighthouse"}'::jsonb, '{"vi":"Ngắm toàn cảnh","en":"Viewpoint"}'::jsonb, '{"vi":"Trên đỉnh đồi hơn 300m — một trong những hải đăng cao nhất Việt Nam, thu trọn 21 hòn đảo.","en":"On a 300m+ hilltop, one of Vietnam''s highest lighthouses, overlooking all 21 islands."}'::jsonb, '/uploads/hai-dang-Ke-Ga-2.jpg', 2);
INSERT INTO public.places (id, name, tag, description, image, sort_order)
VALUES ('place-hon-mau', '{"vi":"Hòn Mấu","en":"Hon Mau"}'::jsonb, '{"vi":"Đảo vệ tinh","en":"Satellite island"}'::jsonb, '{"vi":"Năm bãi biển khác biệt: Bãi Chướng, Bãi Nam cát trắng; Bãi Bắc và Bãi Đá Đen đá cuội bóng.","en":"Five distinct beaches: white sand at Bai Chuong and Bai Nam, black pebbles at Bai Da Den."}'::jsonb, '/uploads/du-lich-hon-mau.jpg', 3);
INSERT INTO public.places (id, name, tag, description, image, sort_order)
VALUES ('place-hai-bo-dap', '{"vi":"Hòn Hai Bờ Đập","en":"Hon Hai Bo Dap"}'::jsonb, '{"vi":"Lặn san hô","en":"Snorkelling"}'::jsonb, '{"vi":"\"Maldives thu nhỏ\" của Nam Du — hai đảo nối nhau bằng dải đá tự nhiên, nước nông và trong.","en":"Nam Du''s \"mini Maldives\" — two islets joined by a natural stone spit, shallow and clear."}'::jsonb, '/uploads/honhaibodap.jpg', 4);
INSERT INTO public.places (id, name, tag, description, image, sort_order)
VALUES ('place-hon-dau', '{"vi":"Hòn Dầu","en":"Hon Dau"}'::jsonb, '{"vi":"Check-in","en":"Photo spot"}'::jsonb, '{"vi":"Hơn 90% diện tích là rừng nguyên sinh; rặng dừa ngả ra biển và xích đu gỗ trên nước.","en":"Over 90% primary forest; palms leaning over the water and a wooden swing in the sea."}'::jsonb, '/uploads/lan-ngan-san-ho.jpg', 5);
INSERT INTO public.places (id, name, tag, description, image, sort_order)
VALUES ('place-hon-ngang', '{"vi":"Hòn Ngang","en":"Hon Ngang"}'::jsonb, '{"vi":"Làng bè","en":"Floating village"}'::jsonb, '{"vi":"Vùng biển êm nhất quần đảo, trung tâm nuôi hải sản lồng bè — ăn cá bớp ngay trên bè.","en":"The calmest water in the archipelago and its aquaculture hub — eat cobia on the raft."}'::jsonb, '/uploads/ho-boi.jpg', 6);
INSERT INTO public.places (id, name, tag, description, image, sort_order)
VALUES ('place-bai-chet', '{"vi":"Bãi Chệt","en":"Bai Chet"}'::jsonb, '{"vi":"Chợ & bến tàu","en":"Market & pier"}'::jsonb, '{"vi":"Bến tàu chính, chợ hải sản tươi sống và trung tâm dịch vụ sầm uất nhất trên đảo.","en":"The main pier, the fresh seafood market and the island''s busiest service hub."}'::jsonb, '/uploads/nha-hang-view-bien.jpg', 7);
INSERT INTO public.gallery_items (id, title, subtitle, image, sort_order)
VALUES ('gallery-beach', '{"vi":"Bãi biển riêng","en":"Private Beach"}'::jsonb, '{"vi":"Yên bình & tĩnh lặng","en":"Peaceful & Pristine"}'::jsonb, '/uploads/hoang-hon.jpg', 0);
INSERT INTO public.gallery_items (id, title, subtitle, image, sort_order)
VALUES ('gallery-pool', '{"vi":"Hồ bơi vô cực","en":"Infinity Pool"}'::jsonb, '{"vi":"View biển 360°","en":"360° Ocean Panorama"}'::jsonb, '/uploads/ho-boi.jpg', 1);
INSERT INTO public.gallery_items (id, title, subtitle, image, sort_order)
VALUES ('gallery-dining', '{"vi":"Nhà hàng view biển","en":"Oceanfront Dining"}'::jsonb, '{"vi":"Ẩm thực hải sản tươi sống","en":"Fresh Island Seafood"}'::jsonb, '/uploads/nha-hang-view-bien.jpg', 2);
INSERT INTO public.gallery_items (id, title, subtitle, image, sort_order)
VALUES ('gallery-diving', '{"vi":"Lặn ngắm san hô","en":"Coral Reef Diving"}'::jsonb, '{"vi":"Khám phá đại dương","en":"Underwater Discovery"}'::jsonb, '/uploads/lan-ngan-san-ho.jpg', 3);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-pool', 'waves', '{"vi":"Hồ bơi vô cực","en":"Infinity Pool"}'::jsonb, '{"vi":"View biển","en":"Sea view"}'::jsonb, 0);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-restaurant', 'utensils', '{"vi":"Nhà hàng","en":"Restaurant"}'::jsonb, '{"vi":"Ẩm thực đa dạng","en":"Diverse cuisine"}'::jsonb, 1);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-wifi', 'wifi', '{"vi":"Wi-Fi miễn phí","en":"Free Wi-Fi"}'::jsonb, '{"vi":"Tốc độ cao","en":"High speed"}'::jsonb, 2);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-transfer', 'bus', '{"vi":"Đưa đón","en":"Transfer"}'::jsonb, '{"vi":"Xe đưa đón tận nơi","en":"Door-to-door shuttle"}'::jsonb, 3);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-pier-transfer', 'car', '{"vi":"Đón tiễn bến tàu miễn phí","en":"Free pier transfer"}'::jsonb, NULL, 4);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-bike', 'bike', '{"vi":"Thuê xe máy","en":"Motorbike rental"}'::jsonb, '{"vi":"Khám phá đảo","en":"Explore the island"}'::jsonb, 5);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-event', 'sparkles', '{"vi":"Tổ chức sự kiện","en":"Event organizing"}'::jsonb, '{"vi":"Hội nghị, tiệc cưới","en":"Conferences, weddings"}'::jsonb, 6);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-canoe', 'anchor', '{"vi":"Tour cano lặn ngắm san hô","en":"Private canoe & snorkeling"}'::jsonb, NULL, 7);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-breakfast', 'utensils', '{"vi":"Bữa sáng ngắm biển","en":"Seaview breakfast"}'::jsonb, NULL, 8);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-billiards', 'gamepad', '{"vi":"Bàn bida & giải trí","en":"Billiards & games"}'::jsonb, NULL, 9);
INSERT INTO public.amenities (id, icon, label, description, sort_order)
VALUES ('amenity-support', 'headphones', '{"vi":"Hỗ trợ 24/7","en":"24/7 support"}'::jsonb, NULL, 10);
INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES ('review-ngoc-anh', 'Ngọc Anh', '{"vi":"TP.HCM","en":"Ho Chi Minh City"}'::jsonb, '2026-08-06', 5, '{"vi":"Chủ nhà nhắn tin trước một ngày hỏi chuyến tàu mấy giờ, rồi có người chờ sẵn ở bến. Đi đảo mà không phải lo khâu nào.","en":"The host messaged a day ahead to ask which ferry we were on, then someone was waiting at the pier. Nothing left for us to arrange."}'::jsonb, NULL, 0);
INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES ('review-minh-tri', 'Minh Trí', '{"vi":"Cần Thơ","en":"Can Tho"}'::jsonb, '2026-08-06', 5, '{"vi":"Dậy sớm ngồi ngoài hiên xem mặt trời lên khỏi mặt biển. Hai đêm ở đây đáng giá hơn cả tuần nghỉ ở chỗ đông người.","en":"We got up early and watched the sun come off the water from the terrace. Two nights here beat a whole week somewhere crowded."}'::jsonb, NULL, 1);
INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES ('review-thu-ha', 'Thu Hà', '{"vi":"Hà Nội","en":"Hanoi"}'::jsonb, '2026-08-06', 5, '{"vi":"Phòng nhìn thẳng ra vịnh, sáng mở cửa là thấy biển. Đúng như ảnh, không có chuyện ảnh một đằng phòng một nẻo.","en":"The room looks straight onto the bay — you open the door in the morning and there it is. Exactly like the photos, no surprises."}'::jsonb, NULL, 2);
INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES ('review-quoc-bao', 'Quốc Bảo', '{"vi":"Đà Nẵng","en":"Da Nang"}'::jsonb, '2026-08-06', 5, '{"vi":"Đi bốn người, thuê xe máy ngay tại resort rồi chạy vòng đảo. Chủ nhà chỉ đường tới mấy bãi vắng mà Google Maps không có.","en":"Four of us rented bikes right at the resort and rode around the island. The host pointed us to quiet beaches Google Maps does not show."}'::jsonb, NULL, 3);
INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES ('review-lan-phuong', 'Lan Phương', '{"vi":"Bình Dương","en":"Binh Duong"}'::jsonb, '2026-08-06', 5, '{"vi":"Bữa sáng ăn ngoài nhà hàng nhìn ra biển, cá mới đánh về nên ngọt. Bé nhà mình ăn hết cả phần người lớn.","en":"Breakfast at the seaside restaurant, with fish caught that morning. Our little one finished an adult portion."}'::jsonb, NULL, 4);
INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES ('review-duc-huy', 'Đức Huy', '{"vi":"Nha Trang","en":"Nha Trang"}'::jsonb, '2026-08-06', 4, '{"vi":"Hồ bơi vắng, chiều nào cũng gần như của riêng mình. Buổi tối ra bàn bi-a ngồi với mấy nhóm khách khác, vui.","en":"The pool was quiet — most afternoons we had it to ourselves. Evenings we played pool with the other guests."}'::jsonb, NULL, 5);
INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES ('review-kim-oanh', 'Kim Oanh', '{"vi":"Rạch Giá","en":"Rach Gia"}'::jsonb, '2026-08-06', 5, '{"vi":"Lần đầu ra đảo nên khá lo. Nhắn gì cũng được trả lời trong vài phút, kể cả lúc mười giờ đêm hỏi chuyện tàu về.","en":"It was our first island trip and we were nervous. Every message got an answer within minutes, even asking about the return ferry at ten at night."}'::jsonb, NULL, 6);
INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES ('review-thanh-tung', 'Thanh Tùng', '{"vi":"Vũng Tàu","en":"Vung Tau"}'::jsonb, '2026-08-06', 5, '{"vi":"Đưa cả nhà ba thế hệ đi, ông bà đi lại thoải mái vì phòng gần khu ăn uống. Chuyện nhỏ nhưng chỗ khác ít khi tính tới.","en":"We came as three generations. My parents got around easily because the rooms sit close to the dining area — a small thing most places overlook."}'::jsonb, NULL, 7);
INSERT INTO public.reviews (id, name, from_place, date, rating, comment, avatar, sort_order)
VALUES ('review-hai-yen', 'Hải Yến', '{"vi":"Huế","en":"Hue"}'::jsonb, '2026-08-06', 5, '{"vi":"Đi lặn ngắm san hô theo tour chủ nhà giới thiệu, nước trong tới mức nhìn thấy đáy. Về tới nơi đã có nước ấm sẵn để tắm.","en":"We joined the snorkelling trip the host recommended — the water was clear to the bottom. Hot water was ready for us when we got back."}'::jsonb, NULL, 8);
INSERT INTO public.explore_spots (id, name, dist, text, tip, sort_order)
VALUES ('caymen', '{"vi":"Bãi Cây Mến","en":"Cay Men Beach"}'::jsonb, '{"vi":"4 phút xe","en":"4 min ride"}'::jsonb, '{"vi":"Bãi tắm đẹp nhất Nam Du, nằm trong vịnh kín gió. Cát trắng mịn, nước xanh lơ và hàng dừa cổ thụ 70–80 năm tuổi nghiêng bóng xuống mặt nước.","en":"The prettiest beach on Nam Du, tucked into a sheltered bay. Fine white sand, pale blue water and 70–80-year-old coconut palms leaning over it."}'::jsonb, '{"vi":"Nước êm, hợp bơi và bắt ốc ở gờ đá","en":"Calm water; good for swimming and rock-pooling"}'::jsonb, 0);
INSERT INTO public.explore_spots (id, name, dist, text, tip, sort_order)
VALUES ('haidang', '{"vi":"Hải đăng Nam Du","en":"Nam Du Lighthouse"}'::jsonb, '{"vi":"309 m","en":"309 m"}'::jsonb, '{"vi":"Một trong những ngọn hải đăng cao nhất Việt Nam. Từ trên đỉnh thu trọn cả 21 hòn đảo vào tầm mắt giữa biển trời mênh mông.","en":"One of the highest lighthouses in Vietnam. From the top you take in all 21 islands at once."}'::jsonb, '{"vi":"Đi lúc 16:30 để kịp hoàng hôn trên đường về","en":"Go at 16:30 to catch sunset on the way down"}'::jsonb, 1);
INSERT INTO public.explore_spots (id, name, dist, text, tip, sort_order)
VALUES ('baingu', '{"vi":"Bãi Ngự & Giếng Vua","en":"Bai Ngu & the King’s Well"}'::jsonb, '{"vi":"Phía Tây đảo","en":"West side"}'::jsonb, '{"vi":"Nơi vua Gia Long từng dừng chân lánh nạn. Giếng Ngự là giếng nước ngọt tự nhiên sát bờ biển nhưng chưa bao giờ cạn, kể cả những mùa khô khốc liệt nhất.","en":"Where Emperor Gia Long once sheltered. The King’s Well is a natural freshwater well beside the sea that has never run dry."}'::jsonb, '{"vi":"Ghé kèm khi chạy vòng đảo buổi sáng","en":"Fold into the morning island loop"}'::jsonb, 2);
INSERT INTO public.explore_spots (id, name, dist, text, tip, sort_order)
VALUES ('baichet', '{"vi":"Bãi Chệt & chợ hải sản","en":"Bai Chet & the fish market"}'::jsonb, '{"vi":"Bến tàu chính","en":"Main pier"}'::jsonb, '{"vi":"Trung tâm giao thương của đảo: bến tàu chính, chợ hải sản tươi sống, quán ăn và dịch vụ. Tên gọi bắt nguồn từ truyền thuyết giao chiến thương thuyền thế kỷ 16.","en":"The island’s trading centre: main pier, live seafood market, eateries and services."}'::jsonb, '{"vi":"Mua hải sản chiều rồi mang lên đồi nướng","en":"Buy your catch here and grill it up at the resort"}'::jsonb, 3);
INSERT INTO public.explore_spots (id, name, dist, text, tip, sort_order)
VALUES ('dinhong', '{"vi":"Dinh Ông Nam Hải","en":"Dinh Ong Nam Hai shrine"}'::jsonb, '{"vi":"Ven biển","en":"Coastal"}'::jsonb, '{"vi":"Nơi thờ và bảo tồn bộ xương cá Ông dài hơn 15 m do ngư dân phát hiện dạt vào bờ. Cạnh đó là Miếu Bà Chúa Xứ, chốn tâm linh của cư dân đảo.","en":"Home to a 15-metre whale skeleton found washed ashore by fishermen, beside the Ba Chua Xu shrine."}'::jsonb, '{"vi":"Đi cùng buổi sáng ngày cuối trước khi rời đảo","en":"Good for the last morning before the boat"}'::jsonb, 4);
INSERT INTO public.explore_spots (id, name, dist, text, tip, sort_order)
VALUES ('chodem', '{"vi":"Chợ đêm Nam Du","en":"Nam Du night market"}'::jsonb, '{"vi":"Dưới chân đồi","en":"Below the hill"}'::jsonb, '{"vi":"Hải sản nướng xiên, mực một nắng, đồ lưu niệm. Từ sân hiên resort nhìn thẳng xuống thấy cả dãy đèn chợ sáng lên lúc 19 giờ.","en":"Grilled skewers, one-sun-dried squid, souvenirs. From the resort terrace you look straight down on its lights coming on at seven."}'::jsonb, '{"vi":"Đi bộ xuống mất 8 phút, lên dốc thì gọi xe","en":"8 minutes downhill; call for a ride back up"}'::jsonb, 5);
INSERT INTO public.satellite_islands (id, name, badge, text, sort_order)
VALUES ('haibodap', '{"vi":"Hòn Hai Bờ Đập","en":"Hon Hai Bo Dap"}'::jsonb, '{"vi":"MALDIVES THU NHỎ","en":"MINI MALDIVES"}'::jsonb, '{"vi":"Hai đảo nhỏ nối nhau bằng dải đá tự nhiên vắt ngang biển. Nước nông và trong, tàu thả neo cho khách lặn ngắm san hô và chèo SUP.","en":"Two islets joined by a natural stone causeway. Shallow, clear water — boats anchor here for snorkelling and SUP."}'::jsonb, 0);
INSERT INTO public.satellite_islands (id, name, badge, text, sort_order)
VALUES ('honmau', '{"vi":"Hòn Mấu","en":"Hon Mau"}'::jsonb, '{"vi":"5 BÃI BIỂN","en":"FIVE BEACHES"}'::jsonb, '{"vi":"Hơn 120 hộ dân sống bằng nghề lưới ghẹ. Năm bãi mỗi bãi một kiểu: Bãi Chướng và Bãi Nam cát trắng, Bãi Đá Đen phủ đá cuội đen bóng.","en":"A crab-netting village of 120 households. Five beaches, each different — white sand at Bai Chuong, polished black pebbles at Bai Da Den."}'::jsonb, 1);
INSERT INTO public.satellite_islands (id, name, badge, text, sort_order)
VALUES ('hondau', '{"vi":"Hòn Dầu","en":"Hon Dau"}'::jsonb, '{"vi":"90% RỪNG NGUYÊN SINH","en":"90% PRIMARY FOREST"}'::jsonb, '{"vi":"Hoang sơ, hơn 90% diện tích là rừng nguyên sinh. Rặng dừa ngả ra biển, xích đu gỗ trên nước và tổ chim bằng rễ cây là những góc chụp quen thuộc.","en":"Almost untouched, over 90% primary forest. Palms leaning over the water, a wooden swing and a nest woven from roots."}'::jsonb, 2);
INSERT INTO public.satellite_islands (id, name, badge, text, sort_order)
VALUES ('honngang', '{"vi":"Hòn Ngang","en":"Hon Ngang"}'::jsonb, '{"vi":"LÀNG BÈ NỔI","en":"FLOATING FARMS"}'::jsonb, '{"vi":"Vùng biển êm nhất quần đảo, nơi neo đậu tàu thuyền và nuôi hải sản lồng bè. Lên nhà bè ăn cá mú hấp, tôm hùm, nhum nướng ngay trên mặt nước.","en":"The calmest water in the archipelago, full of floating fish farms. Eat steamed grouper and grilled urchin right on the water."}'::jsonb, 3);
INSERT INTO public.trip_plans (key, name, legs, costs, total, sort_order)
VALUES ('d2', '{"vi":"2 ngày 1 đêm","en":"2 days · 1 night"}'::jsonb, '[{"day":{"vi":"ĐÊM 1","en":"Night 1"},"time":"22:00 – 06:00","title":{"vi":"Xe giường nằm TP.HCM → Rạch Giá","en":"Overnight coach HCMC → Rach Gia"},"text":{"vi":"Bắt xe từ Bến xe Miền Tây, ngủ trên xe. Phương Trang ~230.000₫, Kumho ~210.000₫.","en":"Depart Mien Tay station and sleep on board. Around 210,000–230,000 VND."}},{"day":{"vi":"NGÀY 1","en":"Day 1"},"time":"06:00 – 11:00","title":{"vi":"Tàu cao tốc ra đảo, nhận phòng","en":"Speedboat out, check in"},"text":{"vi":"Ăn sáng ở Rạch Giá, lên tàu 07:30. Cập bến Củ Tron 10:30 — xe resort đón sẵn. Gửi đồ, ăn trưa hải sản.","en":"Breakfast in Rach Gia, boat at 07:30, ashore by 10:30 where our car is waiting."}},{"day":{"vi":"NGÀY 1","en":"Day 1"},"time":"13:00 – 17:30","title":{"vi":"Tàu gỗ đi 3 đảo nhỏ","en":"Wooden boat, three islands"},"text":{"vi":"Hòn Dầu chụp rặng dừa → Hòn Mấu tắm Bãi Chướng → Hòn Hai Bờ Đập lặn san hô, chèo SUP, ăn cháo nhum nóng trên tàu.","en":"Hon Dau for the palms, Hon Mau to swim, Hon Hai Bo Dap to snorkel and paddle."}},{"day":{"vi":"NGÀY 1","en":"Day 1"},"time":"18:30 – 21:30","title":{"vi":"BBQ hải sản trên đồi","en":"Seafood BBQ on the hill"},"text":{"vi":"Ghẹ hấp, cá xương xanh nướng, nhum mỡ hành. Sau đó tự do dạo chợ đêm ngay dưới chân đồi.","en":"Steamed crab, grilled needlefish, urchin with spring onion, then the night market below."}},{"day":{"vi":"NGÀY 2","en":"Day 2"},"time":"06:00 – 11:30","title":{"vi":"Bình minh, rồi vòng quanh Hòn Lớn","en":"Sunrise, then the island loop"},"text":{"vi":"Cà phê trên sân hiên lúc mặt trời lên. Xe máy đi Miếu Bà Chúa Xứ, Ba Hòn Nồm, Bãi Ngự, Giếng Vua, tắm Bãi Cây Mến, ghé Dinh Ông.","en":"Coffee on the terrace at sunrise, then the 11 km loop by scooter."}},{"day":{"vi":"NGÀY 2","en":"Day 2"},"time":"11:30 – 18:00","title":{"vi":"Trả phòng và về bờ","en":"Check out and head back"},"text":{"vi":"Cơm trưa, mua khô cá xương xanh làm quà. Tàu 14:00 về Rạch Giá, 16:30 cập bến, lên xe về TP.HCM.","en":"Lunch, buy dried fish, 14:00 boat, ashore 16:30, coach home."}}]'::jsonb, '[{"label":{"vi":"Xe khách khứ hồi TP.HCM – Rạch Giá","en":"Return coach HCMC – Rach Gia"},"val":"460 – 500K"},{"label":{"vi":"Tàu cao tốc khứ hồi","en":"Return speedboat"},"val":"450 – 500K"},{"label":{"vi":"Xe máy + tàu gỗ đi đảo","en":"Scooter + island boat"},"val":"250 – 350K"},{"label":{"vi":"Lưu trú","en":"Accommodation"},"val":"250 – 500K"},{"label":{"vi":"Ăn uống & tiệc BBQ","en":"Food and the BBQ"},"val":"600 – 800K"},{"label":{"vi":"Vé tham quan, dụng cụ lặn","en":"Entry fees, snorkel gear"},"val":"100 – 150K"}]'::jsonb, '2.110.000 – 2.800.000₫', 0);
INSERT INTO public.trip_plans (key, name, legs, costs, total, sort_order)
VALUES ('d3', '{"vi":"3 ngày 2 đêm","en":"3 days · 2 nights"}'::jsonb, '[{"day":{"vi":"ĐÊM 1","en":"Night 1"},"time":"23:00 – 06:00","title":{"vi":"Xe giường nằm TP.HCM → Rạch Giá","en":"Overnight coach HCMC → Rach Gia"},"text":{"vi":"Ngủ trên xe, sáng có mặt ở cảng Rạch Giá.","en":"Sleep on board, arrive at Rach Gia port in the morning."}},{"day":{"vi":"NGÀY 1","en":"Day 1"},"time":"06:30 – 11:00","title":{"vi":"Ra đảo, nhận phòng, ăn trưa","en":"Out to the island, check in"},"text":{"vi":"Tàu cao tốc ra Nam Du, xe resort đón tại bến Củ Tron. Nhận phòng, cơm trưa hải sản.","en":"Speedboat out, our car meets you at the pier, then a seafood lunch."}},{"day":{"vi":"NGÀY 1","en":"Day 1"},"time":"14:00 – 17:30","title":{"vi":"Chinh phục Hòn Lớn","en":"The main island"},"text":{"vi":"Lên hải đăng 309 m ngắm toàn cảnh 21 đảo. Bãi Ngự, Giếng Vua, tắm Bãi Cây Mến, hoàng hôn ở Sunset Bar.","en":"Up to the 309 m lighthouse, then Bai Ngu, the King’s Well, a swim at Cay Men and sunset at the bar."}},{"day":{"vi":"NGÀY 2","en":"Day 2"},"time":"08:00 – 17:00","title":{"vi":"Trọn ngày trên tàu, bốn hòn đảo","en":"A full day at sea, four islands"},"text":{"vi":"08:00 Hòn Mấu tắm Bãi Chướng · 10:30 Hòn Dầu rừng nguyên sinh · 12:00 Hòn Ngang ăn trưa trên bè nổi · 14:00 Hòn Hai Bờ Đập lặn san hô, chèo SUP, cháo nhum trên đường về.","en":"Hon Mau, Hon Dau, lunch on a floating farm at Hon Ngang, then snorkelling at Hon Hai Bo Dap."}},{"day":{"vi":"NGÀY 2","en":"Day 2"},"time":"18:30 – 22:00","title":{"vi":"BBQ ngoài trời & lửa trại","en":"Outdoor BBQ and a fire"},"text":{"vi":"Tiệc nướng hải sản trên đỉnh đồi, karaoke và lửa trại bên bờ biển.","en":"Seafood on the grill up on the hill, karaoke, and a fire by the water."}},{"day":{"vi":"NGÀY 3","en":"Day 3"},"time":"06:00 – 11:00","title":{"vi":"Bình minh và phần văn hoá","en":"Sunrise and the cultural half-day"},"text":{"vi":"Đón bình minh ở Bãi Sỏi. Viếng Dinh Ông xem bộ xương cá Ông, thắp nhang Miếu Bà. Ghé chợ Bãi Chệt mua khô hải sản.","en":"Sunrise at Bai Soi, the whale shrine, then the market for dried seafood."}},{"day":{"vi":"NGÀY 3","en":"Day 3"},"time":"11:30 – 17:30","title":{"vi":"Trả phòng và về bờ","en":"Check out and head back"},"text":{"vi":"Cơm trưa, trả phòng, 13:30 ra cảng. Tàu 14:00 về Rạch Giá, xe đón về TP.HCM.","en":"Lunch, check out, 14:00 boat, coach home from Rach Gia."}}]'::jsonb, '[{"label":{"vi":"Xe khách khứ hồi TP.HCM – Rạch Giá","en":"Return coach HCMC – Rach Gia"},"val":"460 – 500K"},{"label":{"vi":"Tàu cao tốc khứ hồi","en":"Return speedboat"},"val":"450 – 500K"},{"label":{"vi":"Xe máy + tàu gỗ đi đảo","en":"Scooter + island boat"},"val":"350 – 450K"},{"label":{"vi":"Lưu trú 2 đêm","en":"Two nights’ accommodation"},"val":"500K – 1tr"},{"label":{"vi":"Ăn uống & tiệc BBQ","en":"Food and the BBQ"},"val":"900K – 1,3tr"},{"label":{"vi":"Vé tham quan, dụng cụ lặn","en":"Entry fees, snorkel gear"},"val":"150 – 250K"}]'::jsonb, '2.810.000 – 4.000.000₫', 1);
INSERT INTO public.menu_categories (key, name, items, sort_order)
VALUES ('coffee', '{"vi":"Cà phê Việt Nam","en":"Vietnamese Coffee"}'::jsonb, '[{"id":1,"name":{"vi":"Cà phê đen pha phin","en":"Vietnamese Black Coffee (Filtered)"},"price":35000},{"id":2,"name":{"vi":"Cà phê đen pha máy","en":"Black Coffee (Espresso)"},"price":35000},{"id":3,"name":{"vi":"Cà phê sữa pha phin","en":"Vietnamese Coffee with Condensed Milk"},"price":40000},{"id":4,"name":{"vi":"Cà phê sữa pha máy","en":"Coffee with Condensed Milk (Espresso)"},"price":40000},{"id":5,"name":{"vi":"Cà phê trứng","en":"Egg Coffee"},"price":69000},{"id":6,"name":{"vi":"Bạc xỉu","en":"White Coffee (Condensed Milk)"},"price":55000},{"id":7,"name":{"vi":"Cold brew latte","en":"Cold Brew Latte"},"price":55000},{"id":8,"name":{"vi":"Cold brew cam vàng","en":"Cold Brew Orange"},"price":55000},{"id":9,"name":{"vi":"Miss Nam Du Hill Island","en":"Miss Nam Du Hill Island"},"price":69000},{"id":10,"name":{"vi":"Sparkling berries coffee","en":"Sparkling Berries Coffee"},"price":69000},{"id":11,"name":{"vi":"Latte (nóng / lạnh)","en":"Latte (Hot / Iced)"},"price":55000},{"id":12,"name":{"vi":"Cappuccino","en":"Cappuccino"},"price":55000},{"id":13,"name":{"vi":"Americano (nóng / lạnh)","en":"Americano (Hot / Iced)"},"price":50000},{"id":14,"name":{"vi":"Baileys coffee","en":"Baileys Coffee"},"price":69000},{"id":15,"name":{"vi":"Cà phê muối","en":"Salted Coffee"},"price":69000}]'::jsonb, 0);
INSERT INTO public.menu_categories (key, name, items, sort_order)
VALUES ('tea', '{"vi":"Trà đá & trà trái cây","en":"Iced & Fruit Tea"}'::jsonb, '[{"id":25,"name":{"vi":"Matcha Latte","en":"Matcha Latte"},"price":55000},{"id":26,"name":{"vi":"Trà Nam Du Hill","en":"Nam Du Hill Tea"},"price":55000},{"id":27,"name":{"vi":"Trà ổi hồng","en":"Pink Guava Tea"},"price":55000},{"id":28,"name":{"vi":"Trà đào cam sả","en":"Peach Orange Lemongrass Tea"},"price":55000},{"id":29,"name":{"vi":"Trà sả tắc hạt chia","en":"Lemongrass Kumquat Chia Tea"},"price":55000},{"id":30,"name":{"vi":"Trà lài kiwi","en":"Jasmine Kiwi Tea"},"price":55000},{"id":31,"name":{"vi":"Trà sả tắc xí muội","en":"Lemongrass Kumquat Plum Tea"},"price":55000},{"id":32,"name":{"vi":"Trà hoa đậu biếc mật ong","en":"Butterfly Pea Flower Honey Tea"},"price":55000},{"id":33,"name":{"vi":"Trà Atiso hạt chia mật ong","en":"Artichoke Chia Honey Tea"},"price":55000},{"id":34,"name":{"vi":"Nam Du Island (Welcome drink)","en":"Nam Du Island (Welcome drink)"},"price":55000},{"id":35,"name":{"vi":"Nam Du Tropical","en":"Nam Du Tropical"},"price":69000},{"id":36,"name":{"vi":"Trà sữa lài","en":"Jasmine Milk Tea"},"price":55000}]'::jsonb, 1);
INSERT INTO public.menu_categories (key, name, items, sort_order)
VALUES ('hot', '{"vi":"Trà nóng","en":"Hot Tea"}'::jsonb, '[{"id":37,"name":{"vi":"Trà gừng mật ong","en":"Ginger Honey Tea"},"price":45000},{"id":38,"name":{"vi":"Trà táo đỏ hoa cúc","en":"Red Date Chrysanthemum Tea"},"price":55000},{"id":39,"name":{"vi":"Trà bạc hà cam sả","en":"Mint Orange Lemongrass Tea"},"price":55000},{"id":40,"name":{"vi":"Trà hoa cúc","en":"Chrysanthemum Tea"},"price":45000}]'::jsonb, 2);
INSERT INTO public.blog_posts (
    id, category, title, lede, author, role, published_date, read_min,
    hero_slot, hero_caption, tags, blocks, sort_order
) VALUES (
    'tau-ra-nam-du',
    '{"vi":"DI CHUYỂN","en":"GETTING THERE"}'::jsonb,
    '{"vi":"Đi tàu ra Nam Du: chuyến nào, giá bao nhiêu, say sóng thì làm sao","en":"The boat to Nam Du: which run, what it costs, and what to do about seasickness"}'::jsonb,
    '{"vi":"Từ bến Rạch Giá ra Củ Tron mất khoảng 2 giờ 15 phút. Đây là những gì chúng tôi dặn khách trước mỗi chuyến, sau bảy năm đón khách ở bến tàu.","en":"Rach Gia pier to Cu Tron takes about 2 hours 15 minutes. This is what we tell guests before every trip, after seven years of meeting them at the pier."}'::jsonb,
    '{"vi":"Trần Minh Hải","en":"Hai Tran"}'::jsonb,
    '{"vi":"Quản lý khu nghỉ","en":"Resort manager"}'::jsonb,
    '2026-08-06',
    8,
    'ndh-blog-tau-ra-nam-du-hero',
    '{"vi":"Bến tàu Rạch Giá lúc 7h sáng, chuyến đầu tiên trong ngày.","en":"Rach Gia pier at 7am, the first run of the day."}'::jsonb,
    '[{"vi":"Tàu cao tốc","en":"Speedboat"},{"vi":"Rạch Giá","en":"Rach Gia"},{"vi":"Say sóng","en":"Seasickness"},{"vi":"Lịch trình","en":"Schedule"}]'::jsonb,
    '[{"kind":"h","text":{"vi":"Chọn chuyến nào","en":"Which run to take"}},{"kind":"p","text":{"vi":"Mỗi ngày có ba chuyến từ Rạch Giá: 7h15, 9h30 và 12h45. Chuyến sáng sớm gần như luôn êm nhất vì biển chưa nổi gió. Nếu bạn đi cuối tuần trong mùa cao điểm từ tháng 4 đến tháng 8, hãy đặt vé trước ít nhất hai ngày — chuyến 7h15 thường hết sạch từ chiều hôm trước.","en":"There are three runs a day from Rach Gia: 7:15, 9:30 and 12:45. The early one is almost always the calmest, before the wind picks up. If you are travelling on a weekend between April and August, book at least two days ahead — the 7:15 usually sells out the afternoon before."}},{"kind":"l","items":[{"vi":"Ngồi giữa thân tàu, hàng ghế thấp — ít xóc nhất","en":"Sit mid-hull in a lower row — the least motion"},{"vi":"Uống thuốc chống say 30 phút trước giờ khởi hành","en":"Take motion-sickness tablets 30 minutes before departure"},{"vi":"Mang theo một chai nước và ít bánh mặn","en":"Bring water and something salty to nibble"},{"vi":"Đừng đọc điện thoại trong 20 phút đầu ra khơi","en":"Do not look at your phone for the first 20 minutes"}]},{"kind":"q","text":{"vi":"Khách hay hỏi có nên đi chuyến trưa cho thong thả. Câu trả lời của chúng tôi là không — biển chiều ở vùng này khác hẳn biển sáng.","en":"Guests often ask about the midday run so they can sleep in. Our answer is no — the afternoon sea here is a different sea."}},{"kind":"i","slotId":"ndh-blog-tau-ra-nam-du-b4","text":{"vi":"Bên trong khoang tàu cao tốc","en":"Inside the speedboat cabin"},"caption":{"vi":"Khoang ghế của tàu Superdong, hàng ghế giữa thân là chỗ êm nhất.","en":"Superdong cabin — the mid-hull rows ride the softest."}},{"kind":"h","text":{"vi":"Đến đảo rồi thì sao","en":"Once you land"}},{"kind":"p","text":{"vi":"Tàu cập bến Củ Tron, xe của khu nghỉ đợi ngay đầu cầu cảng — bạn không cần đặt trước, chỉ cần nhắn giờ tàu vào Zalo trước một ngày. Đường lên đồi dài 1,8 km, dốc và hẹp, nên chúng tôi khuyên khách đừng tự thuê xe máy trong ngày đầu tiên khi chưa quen đường.","en":"The boat docks at Cu Tron and our car waits at the head of the pier — no booking needed, just send your boat time over Zalo the day before. The hill road is 1.8 km, steep and narrow, so we suggest not renting a motorbike on your first day."}},{"kind":"p","text":{"vi":"Nếu tàu bị huỷ vì thời tiết — chuyện xảy ra vài lần mỗi năm vào mùa gió chướng — tiền cọc phòng của bạn được hoàn đủ, không cần giải thích gì thêm.","en":"If the boat is cancelled for weather — which happens a few times a year in the monsoon months — your deposit is refunded in full, no explanation needed."}}]'::jsonb,
    0
);
INSERT INTO public.blog_posts (
    id, category, title, lede, author, role, published_date, read_min,
    hero_slot, hero_caption, tags, blocks, sort_order
) VALUES (
    'phong-hang-da',
    '{"vi":"HẬU TRƯỜNG","en":"BEHIND THE SCENES"}'::jsonb,
    '{"vi":"Chúng tôi đã xây phòng quanh một vách đá như thế nào","en":"How we built a room around a cliff"}'::jsonb,
    '{"vi":"Phòng 14 mất mười bốn tháng để hoàn thành, phần lớn thời gian là để tìm cách không chạm vào tảng đá.","en":"Room 14 took fourteen months, most of it spent working out how not to touch the rock."}'::jsonb,
    '{"vi":"Nguyễn Thu Vân","en":"Van Nguyen"}'::jsonb,
    '{"vi":"Đồng sáng lập","en":"Co-founder"}'::jsonb,
    '2026-08-06',
    6,
    'ndh-room-14',
    '{"vi":"Vách đá nguyên khối trong phòng ngủ số 14.","en":"The untouched cliff face inside room 14."}'::jsonb,
    '[{"vi":"Phòng 14","en":"Room 14"},{"vi":"Kiến trúc","en":"Architecture"},{"vi":"Hang đá","en":"Cave"},{"vi":"Xây dựng","en":"Construction"}]'::jsonb,
    '[{"kind":"p","text":{"vi":"Khi dọn nền cho khối phòng phía đông, chúng tôi gặp một mỏm đá granite cao gần bốn mét chạy chéo qua đúng chỗ định đặt giường. Phương án đầu tiên của nhà thầu là phá bỏ. Chúng tôi đã dừng công trình hai tháng để nghĩ lại.","en":"Clearing the ground for the east block, we hit a granite outcrop nearly four metres tall running diagonally through exactly where the bed was meant to go. The contractor proposed removing it. We stopped work for two months instead."}},{"kind":"h","text":{"vi":"Không phá, thì phải đo","en":"If you do not cut, you measure"}},{"kind":"p","text":{"vi":"Toàn bộ mặt đá được đo thủ công theo lưới 20 cm, rồi dựng lại trên bản vẽ. Tường phòng bám theo đường viền đá thay vì cắt qua nó, nên không có bức tường nào trong phòng 14 thật sự thẳng. Phòng tắm nằm lọt trong khe đá tự nhiên phía sau — chúng tôi chỉ thêm sàn, thoát nước và một ô cửa kính.","en":"The whole rock face was measured by hand on a 20 cm grid, then redrawn. The walls follow the stone rather than cut through it, so no wall in room 14 is truly straight. The bathroom sits inside the natural cleft behind it — we added a floor, drainage and one pane of glass."}},{"kind":"q","text":{"vi":"Đá không nứt vì mình xây quanh nó. Đá nứt vì mình ép nó thẳng.","en":"Rock does not crack because you build around it. It cracks because you force it straight."}},{"kind":"i","slotId":"ndh-blog-phong-hang-da-b4","text":{"vi":"Phòng tắm trong hang đá","en":"Bathroom inside the rock cleft"},"caption":{"vi":"Phòng tắm nằm trong khe đá tự nhiên, chỉ thêm sàn và thoát nước.","en":"The bathroom inside the natural cleft — only floor and drainage were added."}},{"kind":"p","text":{"vi":"Con suối chảy qua nền đá vẫn còn nguyên. Về đêm khách nghe rõ tiếng nước, và đó là lý do phòng 14 luôn kín trước các phòng khác ba tuần.","en":"The stream running under the rock is still there. At night you hear it clearly, and that is why room 14 books out three weeks ahead of every other room."}}]'::jsonb,
    1
);
INSERT INTO public.blog_posts (
    id, category, title, lede, author, role, published_date, read_min,
    hero_slot, hero_caption, tags, blocks, sort_order
) VALUES (
    'an-gi-o-nam-du',
    '{"vi":"ẨM THỰC","en":"FOOD"}'::jsonb,
    '{"vi":"Ăn gì ở Nam Du: chín món và ba nơi khách hay bỏ lỡ","en":"Eating on Nam Du: nine dishes and three places most guests miss"}'::jsonb,
    '{"vi":"Chợ đêm chỉ là phần dễ thấy. Những bữa ngon nhất trên đảo thường nằm ở nơi không có biển hiệu.","en":"The night market is the obvious part. The best meals on the island tend to have no sign out front."}'::jsonb,
    '{"vi":"Lê Quốc Bảo","en":"Bao Le"}'::jsonb,
    '{"vi":"Bếp trưởng","en":"Head chef"}'::jsonb,
    '2026-08-06',
    7,
    'ndh-dish-goica',
    '{"vi":"Nhum biển nướng mỡ hành, món chỉ ngon từ tháng 3 đến tháng 7.","en":"Grilled sea urchin — only worth ordering March to July."}'::jsonb,
    '[{"vi":"Chợ đêm","en":"Night market"},{"vi":"Hải sản","en":"Seafood"},{"vi":"Nhum biển","en":"Sea urchin"},{"vi":"BBQ","en":"BBQ"}]'::jsonb,
    '[{"kind":"h","text":{"vi":"Món theo mùa, không phải theo thực đơn","en":"Order by season, not by menu"}},{"kind":"p","text":{"vi":"Nhum biển ngon nhất từ tháng 3 đến tháng 7. Ngoài khoảng đó, hàng quán vẫn bán nhưng là hàng đông lạnh chở từ đất liền ra, và bạn sẽ trả giá tươi cho món không tươi. Cá bớp thì ngược lại — mùa gió chướng cá chắc thịt hơn hẳn.","en":"Sea urchin is at its best March to July. Outside that window it is still sold, but frozen and shipped from the mainland — you pay fresh prices for something that is not. Cobia is the opposite: it firms up in the windy months."}},{"kind":"l","items":[{"vi":"Nhum nướng mỡ hành — chỉ gọi trong mùa","en":"Grilled sea urchin with scallion oil — in season only"},{"vi":"Cá bớp nấu ngót, ăn buổi trưa","en":"Cobia in clear sour broth, best at lunch"},{"vi":"Ốc giác hấp gừng ở dãy quán cuối chợ đêm","en":"Steamed sea snail with ginger at the far end of the market"},{"vi":"Bánh canh ghẹ ở quán không tên gần trạm y tế","en":"Crab noodle soup at the unnamed stall near the clinic"}]},{"kind":"i","slotId":"ndh-dish-lau","text":{"vi":"Chợ đêm Nam Du buổi tối","en":"Nam Du night market"},"caption":{"vi":"Chợ đêm bắt đầu đông từ 18h30, quán ngon nhất nằm ở dãy trong cùng.","en":"The market fills from 6:30pm; the best stalls are in the back row."}},{"kind":"p","text":{"vi":"Trên đồi, bếp của chúng tôi mua cá trực tiếp từ ba chiếc ghe quen mỗi sáng. Nếu hôm đó biển động và ghe không ra, thực đơn tối sẽ đổi — chúng tôi không nhập hàng đông lạnh để giữ đúng thực đơn in sẵn.","en":"Up on the hill, our kitchen buys from the same three boats each morning. If the sea is rough and they do not go out, the evening menu changes — we do not bring in frozen fish to keep a printed menu honest."}}]'::jsonb,
    2
);
INSERT INTO public.blog_posts (
    id, category, title, lede, author, role, published_date, read_min,
    hero_slot, hero_caption, tags, blocks, sort_order
) VALUES (
    'ba-ngay-o-dao',
    '{"vi":"SỰ KIỆN","en":"EVENT"}'::jsonb,
    '{"vi":"Ba ngày ở Nam Du mà không phải chạy đua","en":"Three days on Nam Du without rushing"}'::jsonb,
    '{"vi":"Đảo nhỏ, nhưng đường đi lại chậm. Đây là lịch trình chúng tôi thật sự khuyên khách, không phải lịch trình nhồi đủ mười điểm check-in.","en":"The island is small but slow to move around. This is the itinerary we actually recommend, not the one that fits ten photo stops."}'::jsonb,
    '{"vi":"Trần Minh Hải","en":"Hai Tran"}'::jsonb,
    '{"vi":"Quản lý khu nghỉ","en":"Resort manager"}'::jsonb,
    '2026-08-06',
    9,
    'ndh-spot-haidang',
    '{"vi":"Bãi Mến lúc chiều muộn, thời điểm ít người nhất trong ngày.","en":"Bai Men in late afternoon, the emptiest hour of the day."}'::jsonb,
    '[{"vi":"Lịch trình","en":"Itinerary"},{"vi":"Bãi Mến","en":"Bai Men"},{"vi":"Hòn Mấu","en":"Hon Mau"},{"vi":"Hải đăng","en":"Lighthouse"}]'::jsonb,
    '[{"kind":"h","text":{"vi":"Ngày 1 — đừng đi đâu cả","en":"Day 1 — go nowhere"}},{"kind":"p","text":{"vi":"Chuyến tàu sáng thả bạn xuống đảo lúc gần 10h. Nhận phòng, ăn trưa, ngủ một giấc. Chiều muộn đi bộ xuống Bãi Mến, cách khu nghỉ 900 m — đây là khung giờ bãi vắng nhất và nước trong nhất trong ngày.","en":"The morning boat puts you on the island around 10. Check in, eat, sleep. Late afternoon, walk down to Bai Men, 900 m from the resort — the emptiest and clearest hour of the day."}},{"kind":"h","text":{"vi":"Ngày 2 — ra các hòn nhỏ","en":"Day 2 — the outer islets"}},{"kind":"p","text":{"vi":"Thuê ghe đi Hòn Mấu và Hòn Ngang từ sáng sớm, về trước 14h để tránh gió chiều. Hòn Mấu có hai bãi nằm sát nhau nhưng khác hẳn: một bên cát trắng mịn, một bên toàn đá cuội tròn.","en":"Hire a boat to Hon Mau and Hon Ngang early, and be back before 2pm to beat the afternoon wind. Hon Mau has two beaches side by side that could not be less alike: fine white sand on one, round pebbles on the other."}},{"kind":"q","text":{"vi":"Nếu chỉ có một buổi để chọn, hãy chọn buổi sáng ở Hòn Mấu thay vì buổi chiều ở bất cứ đâu.","en":"If you only get one outing, take a morning at Hon Mau over an afternoon anywhere else."}},{"kind":"i","slotId":"ndh-island-honmau","text":{"vi":"Hòn Mấu nhìn từ ghe","en":"Hon Mau from the boat"},"caption":{"vi":"Hòn Mấu nhìn từ ghe, khoảng 25 phút từ Củ Tron.","en":"Hon Mau from the boat, about 25 minutes from Cu Tron."}},{"kind":"h","text":{"vi":"Ngày 3 — hải đăng rồi về","en":"Day 3 — the lighthouse, then home"}},{"kind":"p","text":{"vi":"Lên hải đăng vào sáng sớm khi trời còn mát, mất khoảng 40 phút đi bộ từ khu nghỉ. Từ trên đó nhìn thấy toàn bộ quần đảo trong một khung hình. Xuống núi kịp ăn trưa rồi ra bến cho chuyến 12h45.","en":"Walk up to the lighthouse early while it is still cool, about 40 minutes from the resort. From the top the whole archipelago fits in one frame. Back down in time for lunch and the 12:45 boat."}}]'::jsonb,
    3
);
INSERT INTO public.blog_posts (
    id, category, title, lede, author, role, published_date, read_min,
    hero_slot, hero_caption, tags, blocks, sort_order
) VALUES (
    'tau-lan-bien-ngu-dao',
    '{"vi":"TRẢI NGHIỆM","en":"EXPERIENCES"}'::jsonb,
    '{"vi":"Trải nghiệm đi tàu – lặn biển – ngủ đảo khi du lịch Nam Du","en":"Boat rides, snorkelling and a night on the island in Nam Du"}'::jsonb,
    '{"vi":"Ba trải nghiệm làm nên một chuyến Nam Du trọn vẹn: chuyến tàu ra đảo, buổi lặn ngắm san hô và một đêm ngủ lại giữa biển.","en":"Three things make a Nam Du trip complete: the crossing, a morning among the coral, and one night spent out on the island."}'::jsonb,
    '{"vi":"The Nam Du Hill Resort","en":"The Nam Du Hill Resort"}'::jsonb,
    '{"vi":"Đội ngũ khu nghỉ","en":"Resort team"}'::jsonb,
    '2026-08-06',
    6,
    'ndh-blog-tau-ra-nam-du-hero',
    '{"vi":"Chuyến tàu sáng rời bến Rạch Giá ra quần đảo Nam Du.","en":"The morning boat leaving Rach Gia for the Nam Du archipelago."}'::jsonb,
    '[{"vi":"Lặn biển","en":"Snorkelling"},{"vi":"Tàu cao tốc","en":"Speedboat"},{"vi":"Ngủ đảo","en":"Island stay"}]'::jsonb,
    '[{"kind":"h","text":{"vi":"Chuyến tàu ra đảo","en":"The crossing"}},{"kind":"p","text":{"vi":"Hành trình bắt đầu từ bến Rạch Giá, mất khoảng hai giờ mười lăm phút để tới Củ Tron. Đây là quãng thời gian đẹp nhất để nhìn quần đảo hiện dần lên phía chân trời — nên chọn chuyến sáng sớm khi biển còn êm.","en":"The trip starts at Rach Gia pier and takes about two hours fifteen to reach Cu Tron. It is the best window to watch the archipelago rise on the horizon — take an early run, while the sea is still calm."}},{"kind":"h","text":{"vi":"Lặn ngắm san hô","en":"Among the coral"}},{"kind":"p","text":{"vi":"Đội ngũ khu nghỉ hỗ trợ sắp xếp ghe ra các hòn nhỏ, nơi nước trong và rạn san hô còn nguyên vẹn. Buổi sáng là thời điểm nước lặng và tầm nhìn dưới mặt nước rõ nhất trong ngày.","en":"Our team arranges boats out to the smaller islets, where the water is clear and the reefs are still intact. Mornings bring the flattest water and the best visibility below the surface."}},{"kind":"h","text":{"vi":"Một đêm ngủ lại đảo","en":"A night on the island"}},{"kind":"p","text":{"vi":"Điều khiến Nam Du khác với một chuyến đi trong ngày là buổi tối. Khi tàu cuối cùng rời bến, đảo trở nên rất yên — chỉ còn tiếng sóng và bầu trời sao gần như không bị ánh đèn thành phố che khuất.","en":"What separates Nam Du from a day trip is the evening. Once the last boat leaves, the island goes quiet — just the surf and a sky almost untouched by city light."}}]'::jsonb,
    4
);
INSERT INTO public.blog_posts (
    id, category, title, lede, author, role, published_date, read_min,
    hero_slot, hero_caption, tags, blocks, sort_order
) VALUES (
    'trai-nghiem-nam-du-lan-dau',
    '{"vi":"TRẢI NGHIỆM","en":"EXPERIENCES"}'::jsonb,
    '{"vi":"Trải nghiệm không thể bỏ lỡ khi du lịch đảo Nam Du lần đầu","en":"What not to miss on your first trip to Nam Du"}'::jsonb,
    '{"vi":"Lần đầu ra Nam Du thường chỉ có hai đến ba ngày. Đây là những gì chúng tôi khuyên khách nên ưu tiên, và những gì có thể để dành cho lần sau.","en":"A first trip to Nam Du usually means two or three days. Here is what we suggest putting first, and what can wait for next time."}'::jsonb,
    '{"vi":"The Nam Du Hill Resort","en":"The Nam Du Hill Resort"}'::jsonb,
    '{"vi":"Đội ngũ khu nghỉ","en":"Resort team"}'::jsonb,
    '2026-08-06',
    5,
    'ndh-spot-haidang',
    '{"vi":"Đường lên hải đăng, điểm nhìn cao nhất quần đảo.","en":"The lighthouse road, the highest viewpoint in the archipelago."}'::jsonb,
    '[{"vi":"Lần đầu","en":"First visit"},{"vi":"Hải đăng","en":"Lighthouse"},{"vi":"Bãi Mến","en":"Bai Men"}]'::jsonb,
    '[{"kind":"h","text":{"vi":"Lên hải đăng một lần","en":"Climb to the lighthouse once"}},{"kind":"p","text":{"vi":"Ở độ cao 309 m, đây là điểm duy nhất nhìn thấy toàn bộ quần đảo trong một khung hình. Đi vào sáng sớm khi trời còn mát, mất khoảng 40 phút đi bộ từ khu nghỉ.","en":"At 309 m this is the only place the whole archipelago fits in one frame. Go early while it is still cool — about 40 minutes on foot from the resort."}},{"kind":"h","text":{"vi":"Đi vòng quanh đảo","en":"Ride the coastal loop"}},{"kind":"p","text":{"vi":"Đường ven biển dài khoảng 11 km, chạy hết chưa tới một buổi. Nên đi ngược chiều kim đồng hồ để mặt trời không chiếu thẳng vào mắt lúc chiều muộn.","en":"The coastal road runs about 11 km and takes less than half a day. Go anticlockwise so the late sun stays out of your eyes."}},{"kind":"h","text":{"vi":"Để dành cho lần sau","en":"Save it for next time"}},{"kind":"p","text":{"vi":"Đừng cố đi hết các hòn nhỏ trong một chuyến. Chọn một hòn và ở lại đó lâu hơn — Nam Du là nơi càng đi chậm càng đáng đi.","en":"Do not try to reach every islet in one trip. Pick one and stay longer — Nam Du rewards the slower pace."}}]'::jsonb,
    5
);
INSERT INTO public.blog_posts (
    id, category, title, lede, author, role, published_date, read_min,
    hero_slot, hero_caption, tags, blocks, sort_order
) VALUES (
    'nam-du-thien-duong-hoang-so',
    '{"vi":"TRẢI NGHIỆM","en":"EXPERIENCES"}'::jsonb,
    '{"vi":"Trải nghiệm du lịch đảo Nam Du: thiên đường biển hoang sơ đáng đi nhất miền Tây","en":"Nam Du: the most worthwhile untouched island in the Mekong Delta"}'::jsonb,
    '{"vi":"Quần đảo 21 hòn nằm cách bờ 90 km, vẫn giữ được nhịp sống chậm và những bãi biển chưa bị lấp đầy bởi hàng quán.","en":"Twenty-one islands lying 90 km offshore, still holding on to a slow rhythm and beaches not yet crowded out by concessions."}'::jsonb,
    '{"vi":"The Nam Du Hill Resort","en":"The Nam Du Hill Resort"}'::jsonb,
    '{"vi":"Đội ngũ khu nghỉ","en":"Resort team"}'::jsonb,
    '2026-08-06',
    7,
    'ndh-island-honmau',
    '{"vi":"Một trong các hòn vệ tinh của quần đảo Nam Du.","en":"One of the satellite islets in the Nam Du archipelago."}'::jsonb,
    '[{"vi":"Nam Du","en":"Nam Du"},{"vi":"Biển hoang sơ","en":"Untouched coast"},{"vi":"Miền Tây","en":"Mekong Delta"}]'::jsonb,
    '[{"kind":"h","text":{"vi":"Vì sao Nam Du còn hoang sơ","en":"Why Nam Du is still quiet"}},{"kind":"p","text":{"vi":"Khoảng cách chính là thứ giữ cho đảo yên tĩnh. Không có sân bay, không có cầu — mọi người đến đây đều phải đi tàu, và điều đó tự nó lọc bớt lượng khách.","en":"Distance is what keeps the island quiet. There is no airport and no bridge — everyone arrives by boat, and that alone thins the crowd."}},{"kind":"h","text":{"vi":"Mùa nào nên đi","en":"When to come"}},{"kind":"p","text":{"vi":"Từ tháng 12 đến tháng 3 là khoảng đẹp nhất: biển lặng, trời trong và ít mưa. Mùa gió chướng biển động hơn, tàu có thể huỷ chuyến vài lần mỗi năm.","en":"December to March is the best stretch: calm sea, clear sky, little rain. In the monsoon months the water is rougher and boats are cancelled a few times a year."}},{"kind":"h","text":{"vi":"Đi rồi nên làm gì","en":"What to do once there"}},{"kind":"p","text":{"vi":"Lặn ngắm san hô ở các hòn nhỏ, chạy vòng đường ven biển, lên hải đăng, và dành ít nhất một buổi chiều không có kế hoạch gì cả. Khu nghỉ hỗ trợ sắp xếp ghe, tour đảo và đón tàu tại bến Củ Tron.","en":"Snorkel around the islets, ride the coastal loop, climb to the lighthouse — and leave at least one afternoon with nothing planned. We help arrange boats, island tours and pier pickup at Cu Tron."}}]'::jsonb,
    6
);
INSERT INTO public.faqs (id, question, answer, sort_order)
VALUES ('faq-01', '{"vi":"Đi Nam Du thời điểm nào đẹp nhất?","en":"When is the best time to visit Nam Du?"}'::jsonb, '{"vi":"Mùa khô từ tháng 12 đến tháng 3: biển êm, nước trong, ít say sóng và thuận lợi cho lặn ngắm san hô.","en":"The dry season from December to March: calm sea, clear water, less seasickness and ideal snorkelling."}'::jsonb, 0);
INSERT INTO public.faqs (id, question, answer, sort_order)
VALUES ('faq-02', '{"vi":"Cần mang giấy tờ gì?","en":"What documents do I need?"}'::jsonb, '{"vi":"Bắt buộc mang CCCD hoặc giấy phép lái xe để làm thủ tục lên tàu. Khách quốc tế cần tìm hiểu trước quy định khu vực biên giới biển.","en":"You must carry a valid ID or driving licence for ferry check-in. International guests should check border-area regulations in advance."}'::jsonb, 1);
INSERT INTO public.faqs (id, question, answer, sort_order)
VALUES ('faq-03', '{"vi":"Resort có hỗ trợ đặt vé tàu không?","en":"Can the resort book ferry tickets?"}'::jsonb, '{"vi":"Có. Chúng tôi giữ vé khứ hồi và đón khách tại bến tàu Bãi Chệt khi bạn đặt combo trọn gói.","en":"Yes. We hold return tickets and meet you at Bai Chet pier when you book a bundle."}'::jsonb, 2);
INSERT INTO public.faqs (id, question, answer, sort_order)
VALUES ('faq-04', '{"vi":"Nếu biển động thì sao?","en":"What if the sea gets rough?"}'::jsonb, '{"vi":"Khi gió vượt cấp 6, tàu tuyến Rạch Giá – Nam Du tạm dừng. Chúng tôi hỗ trợ đổi ngày miễn phí trong trường hợp này.","en":"Ferries stop when winds exceed force 6. We reschedule your stay free of charge in that case."}'::jsonb, 3);
INSERT INTO public.faqs (id, question, answer, sort_order)
VALUES ('faq-05', '{"vi":"Trên đảo có ATM không?","en":"Are there ATMs on the island?"}'::jsonb, '{"vi":"Hệ thống ATM còn hạn chế, bạn nên mang đủ tiền mặt cho chi phí ăn uống và thuê xe.","en":"ATMs are limited — bring enough cash for food and motorbike rental."}'::jsonb, 4);
