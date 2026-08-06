-- =============================================================================
-- 20260101000000_extensions_and_domains.sql
--
-- Ticket 200-01 §6.1 — Extension, domain song ngữ, trigger dùng chung, sequence
-- mã đơn. Chạy TRƯỚC mọi file khác.
--
-- Nguồn sự thật: resources/docs/briefs/ndh-schema-mapping.md §9.1 + §9.7.1.
-- =============================================================================


CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- -----------------------------------------------------------------------------
-- 1. Domain song ngữ — luật R6/C7: mọi chuỗi khách thấy đều có {vi, en}
--
--    ⚠️ Dùng `jsonb_exists(VALUE,'vi')` chứ KHÔNG dùng `VALUE ? 'vi'`.
--    Toán tử `?` là placeholder của node-postgres/postgres-js; cùng câu SQL
--    chạy qua driver Node sẽ bị nuốt mất và lỗi rất khó truy
--    (schema-mapping §2, bẫy #1 của ticket §6.7).
--
--    Giới hạn đã biết: domain CHECK chỉ kiểm khi gán vào CỘT kiểu domain.
--    I18nText lồng trong jsonb tự do (bookings.price_lines[].label,
--    notifications.payload) do ứng dụng bảo đảm — cấm `as any` khi ghi (C1).
-- -----------------------------------------------------------------------------

CREATE DOMAIN public.i18n_text AS jsonb CHECK (
    jsonb_exists(VALUE, 'vi') AND jsonb_exists(VALUE, 'en')
    AND jsonb_typeof(VALUE -> 'vi') = 'string'
    AND jsonb_typeof(VALUE -> 'en') = 'string'
    AND length(VALUE ->> 'vi') > 0
    AND length(VALUE ->> 'en') > 0
);

COMMENT ON DOMAIN public.i18n_text IS
    'I18nText = Record<Locale,string>. Bắt buộc đủ vi + en, không rỗng (luật R6).';

-- ⚠️ SỬA SO VỚI schema-mapping §9.1: bản trong tài liệu dùng
--    `NOT EXISTS (SELECT 1 FROM jsonb_array_elements(VALUE) …)`.
--    Postgres TỪ CHỐI thẳng: "cannot use subquery in check constraint"
--    (CHECK phải là biểu thức immutable, không truy vấn). Đã kiểm chứng bằng
--    cách chạy thật trên postgres:15 — migration đổ ngay ở câu lệnh này.
--
--    Thay bằng hàm phụ trợ IMMUTABLE: cùng ngữ nghĩa, hợp lệ trong CHECK.
--    Ghi nhận để 300-* đính chính tài liệu (cùng nhóm với nợ T8).
CREATE OR REPLACE FUNCTION public.is_i18n_text_array(value jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT jsonb_typeof(value) = 'array'
       AND NOT EXISTS (
           SELECT 1 FROM jsonb_array_elements(value) AS e
           WHERE NOT (
               jsonb_exists(e, 'vi') AND jsonb_exists(e, 'en')
               AND jsonb_typeof(e -> 'vi') = 'string'
               AND jsonb_typeof(e -> 'en') = 'string'
           )
       )
$$;

CREATE DOMAIN public.i18n_text_array AS jsonb
    CHECK (public.is_i18n_text_array(VALUE));

COMMENT ON DOMAIN public.i18n_text_array IS
    'I18nText[] — mảng jsonb, mỗi phần tử đủ vi + en.';


-- -----------------------------------------------------------------------------
-- 2. Trigger cập nhật updated_at (yêu cầu BE7: mọi bảng có id/created_at/updated_at)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;


-- -----------------------------------------------------------------------------
-- 3. Mã đơn — sequence ở DB, KHÔNG đếm ở ứng dụng (ticket §6.4)
--
--    Sequence KHÔNG rollback khi transaction fail → số nhảy cóc. Đó là CỐ Ý và
--    chấp nhận được: mã đơn phải DUY NHẤT, không cần liên tục.
--    Cấm `SELECT max(code)+1` — hai request đồng thời sẽ sinh trùng mã.
--
--    Format `ĐH-2026-0042` theo booking-lifecycle.ts:146 formatBookingCode()
--    (schema-mapping §9.7.1). Cột `bookings.code` là TEXT nên chứa được 'Đ';
--    cấm VARCHAR(50) + CHECK regex ASCII (bẫy #2 của ticket §6.7).
-- -----------------------------------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS public.booking_code_seq;

CREATE OR REPLACE FUNCTION public.next_booking_code() RETURNS text
LANGUAGE sql
VOLATILE
AS $$
    SELECT 'ĐH-' || EXTRACT(YEAR FROM NOW())::int || '-'
           || lpad(nextval('public.booking_code_seq')::text, 4, '0')
$$;

COMMENT ON FUNCTION public.next_booking_code() IS
    'Sinh mã đơn ĐH-YYYY-NNNN. Dùng ở 200-03. Sequence không rollback — số có '
    'thể nhảy cóc, đó là chủ đích: mã phải duy nhất, không cần liên tục.';
