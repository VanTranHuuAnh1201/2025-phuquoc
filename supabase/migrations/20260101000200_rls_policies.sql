-- =============================================================================
-- 20260101000200_rls_policies.sql
--
-- Ticket 000-02 §6.3 / §6.4 — Row Level Security cho toàn bộ schema `public`.
--
-- BỐI CẢNH QUAN TRỌNG — đọc trước khi sửa:
--
--   Dự án TỰ QUẢN JWT, KHÔNG dùng Supabase Auth (`auth.users`).
--   Vì vậy `auth.uid()` KHÔNG dùng được: nó đọc claim `sub` của JWT do GoTrue
--   ký, còn JWT của ta ký bằng `JWT_SECRET` riêng nên PostgREST không chấp nhận.
--   Policy viết theo `auth.uid()` sẽ LUÔN TRẢ RỖNG — im lặng và rất khó truy.
--
--   Danh tính lấy từ GUC `app.current_account_id`, do Route Handler đặt bằng
--   `SET LOCAL` SAU KHI đã verify chữ ký JWT ở server. Client không tự khai được.
--
--   ⚠️ Tài liệu `resources/docs/briefs/ndh-schema-mapping.md §11` viết
--   `USING (customer_id = auth.uid())`. Dòng đó SAI sau quyết định 000-02 §6.3;
--   file này thắng. Nợ T8 đã ghi nhận để đính chính tài liệu ở giai đoạn 300.
--
-- HAI ĐƯỜNG TRUY CẬP DB, KHÔNG TRỘN:
--
--   A — service role  : mọi Route Handler ĐÃ qua requirePermission(). BỎ QUA RLS.
--   B — anon + GUC    : đọc dữ liệu công khai, và đọc dữ liệu của chính khách.
--
--   Đường A là đường chính của v1.0.0 cho mọi bảng nhạy cảm. RLS ở đây là
--   LỚP PHÒNG THỦ THỨ BA, không phải lớp duy nhất (luật BE3 / A3).
--
-- Phụ thuộc: 20260101000100_core_tables.sql (ticket 200-01) phải chạy trước.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Hàm đọc danh tính từ phiên
-- -----------------------------------------------------------------------------

-- Tham số thứ hai `TRUE` của current_setting là BẮT BUỘC (missing_ok):
-- thiếu nó thì truy vấn NÉM LỖI khi GUC chưa đặt (khách vãng lai duyệt trang
-- công khai), thay vì trả NULL và để policy lọc rỗng một cách bình thường.
CREATE OR REPLACE FUNCTION public.current_account_id() RETURNS uuid
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(current_setting('app.current_account_id', TRUE), '')::uuid
$$;

COMMENT ON FUNCTION public.current_account_id() IS
    'Danh tính do Route Handler đặt bằng SET LOCAL sau khi verify JWT ở server. '
    'Không phải claim của client. Trả NULL khi chưa đăng nhập.';


-- -----------------------------------------------------------------------------
-- 2. Bật RLS cho MỌI bảng trong public
--
--    Kể cả bảng công khai. Bảng bật RLS mà không có policy nào = từ chối tất cả
--    — đó là mặc định an toàn đúng. Quên bật một bảng nguy hiểm hơn nhiều so với
--    bật thừa một bảng.
-- -----------------------------------------------------------------------------

-- nghiệp vụ
ALTER TABLE public.property_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_units          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_plans          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addons              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_promotions  ENABLE ROW LEVEL SECURITY;

-- nội dung marketing
ALTER TABLE public.dining              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_spots       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satellite_islands   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_plans          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs                ENABLE ROW LEVEL SECURITY;


-- -----------------------------------------------------------------------------
-- 3. Nhóm CÔNG KHAI — chỉ SELECT, cho `anon` và `authenticated`
--
--    Không viết policy INSERT/UPDATE/DELETE cho hai vai trò này ở BẤT KỲ bảng
--    nào. Mọi ghi đi qua đường A (service role) sau requirePermission().
-- -----------------------------------------------------------------------------

-- Chỉ lộ hàng đang bán: `active = TRUE`.
CREATE POLICY room_types_public_read ON public.room_types
    FOR SELECT TO anon, authenticated USING (active = TRUE);

CREATE POLICY addons_public_read ON public.addons
    FOR SELECT TO anon, authenticated USING (active = TRUE);

CREATE POLICY rate_plans_public_read ON public.rate_plans
    FOR SELECT TO anon, authenticated USING (active = TRUE);

-- Mùa không có cột `active` — bảng tra giá, lộ toàn bộ là bình thường.
CREATE POLICY seasons_public_read ON public.seasons
    FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY property_settings_public_read ON public.property_settings
    FOR SELECT TO anon, authenticated USING (TRUE);

-- inventory: đọc công khai vì màn tra phòng trống cần nó (F2 bước 1).
-- Số phòng còn lại là thông tin khách phải thấy để quyết định (P10 — cấm bịa
-- khan hiếm nghĩa là phải hiện SỐ THẬT).
CREATE POLICY inventory_public_read ON public.inventory
    FOR SELECT TO anon, authenticated USING (TRUE);

-- Nội dung marketing.
CREATE POLICY dining_public_read ON public.dining
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY tours_public_read ON public.tours
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY places_public_read ON public.places
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY gallery_items_public_read ON public.gallery_items
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY amenities_public_read ON public.amenities
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY reviews_public_read ON public.reviews
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY explore_spots_public_read ON public.explore_spots
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY satellite_islands_public_read ON public.satellite_islands
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY trip_plans_public_read ON public.trip_plans
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY menu_categories_public_read ON public.menu_categories
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY blog_posts_public_read ON public.blog_posts
    FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY faqs_public_read ON public.faqs
    FOR SELECT TO anon, authenticated USING (active = TRUE);

-- Khuyến mãi: CHỈ lộ chương trình tự động (`code IS NULL`) đang chạy.
-- Lộ cả `code` là ai cũng đọc được mọi mã giảm giá bí mật của resort.
CREATE POLICY promotions_public_read ON public.promotions
    FOR SELECT TO anon, authenticated
    USING (active = TRUE AND code IS NULL);

-- room_units KHÔNG có policy đọc công khai — số phòng vật lý, tình trạng dọn
-- dẹp là dữ liệu vận hành nội bộ. Chỉ đường A (service role) đọc được.


-- -----------------------------------------------------------------------------
-- 4. Nhóm NHẠY CẢM — chỉ chủ sở hữu đọc được, xác định qua current_account_id()
--
--    `current_account_id()` trả NULL khi chưa đăng nhập → mọi so sánh thành
--    NULL → policy loại hàng. Không cần thêm nhánh `IS NOT NULL`, nhưng vẫn
--    viết rõ ở accounts để ý định đọc được bằng mắt.
-- -----------------------------------------------------------------------------

-- Khách chỉ đọc được đơn của CHÍNH MÌNH (tiêu chí chấp nhận 000-02 §5).
CREATE POLICY bookings_own_read ON public.bookings
    FOR SELECT TO anon, authenticated
    USING (customer_id = public.current_account_id());

-- Hồ sơ của chính mình. Không lộ `password_hash` bằng cách hạn cột — RLS lọc
-- theo HÀNG, không theo cột; Route Handler phải SELECT đúng cột cần trả về.
CREATE POLICY accounts_own_read ON public.accounts
    FOR SELECT TO anon, authenticated
    USING (
        public.current_account_id() IS NOT NULL
        AND id = public.current_account_id()
    );

-- Lịch sử thanh toán: join qua đơn để biết ai là chủ.
CREATE POLICY payments_own_read ON public.payments
    FOR SELECT TO anon, authenticated
    USING (EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = payments.booking_id
          AND b.customer_id = public.current_account_id()
    ));

CREATE POLICY notifications_own_read ON public.notifications
    FOR SELECT TO anon, authenticated
    USING (account_id = public.current_account_id());

CREATE POLICY booking_promotions_own_read ON public.booking_promotions
    FOR SELECT TO anon, authenticated
    USING (EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = booking_promotions.booking_id
          AND b.customer_id = public.current_account_id()
    ));

-- activity_logs: KHÔNG có policy nào cho anon/authenticated.
-- RLS đã bật ở §2 → mặc định từ chối tất cả. Nhật ký là dữ liệu vận hành nội
-- bộ, chỉ đường A đọc được.


-- -----------------------------------------------------------------------------
-- 5. `activity_logs` BẤT BIẾN (luật BE5)
--
--    REVOKE cả `service_role` là CỐ Ý: nó chặn luôn lỗi lập trình của chính ta,
--    không chỉ chặn client. Nhật ký sửa được thì không còn là bằng chứng khi
--    tranh chấp với khách.
--    Ai đó thật sự cần xoá (GDPR) phải mở migration mới — đó là chủ đích.
-- -----------------------------------------------------------------------------

REVOKE UPDATE, DELETE ON public.activity_logs FROM anon, authenticated, service_role;

COMMENT ON TABLE public.activity_logs IS
    'BẤT BIẾN (BE5). UPDATE/DELETE đã bị REVOKE khỏi mọi vai trò kể cả service_role. '
    'Chỉ INSERT và SELECT.';


-- -----------------------------------------------------------------------------
-- 6. Chốt chặn cấp GRANT — không dựa hoàn toàn vào policy
--
--    Policy chỉ có tác dụng khi vai trò còn quyền bảng. Thu hồi thẳng quyền ghi
--    của anon/authenticated trên nhóm nhạy cảm để một policy viết sai trong
--    tương lai cũng không mở được đường ghi.
-- -----------------------------------------------------------------------------

REVOKE INSERT, UPDATE, DELETE ON
    public.bookings,
    public.accounts,
    public.payments,
    public.notifications,
    public.booking_promotions,
    public.inventory,
    public.room_types,
    public.room_units,
    public.promotions,
    public.rate_plans,
    public.seasons,
    public.addons,
    public.property_settings
FROM anon, authenticated;
