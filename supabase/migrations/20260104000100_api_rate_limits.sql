-- Migration: bộ đếm rate limit DÙNG CHUNG giữa các instance (Ticket 390-03)
--
-- ─── VÌ SAO KHÔNG DÙNG BỘ ĐẾM IN-MEMORY ĐANG CÓ ────────────────────────────
--
--   `src/lib/api/rate-limit.ts` giữ `Map<ip, {count, resetTime}>` trong RAM của
--   tiến trình. Chính file đó đã tự ghi chú: "Multi-instance deployments do not
--   share this in-memory state".
--
--   Trên Vercel mỗi lời gọi có thể rơi vào một lambda khác nhau, mỗi lambda một
--   `Map` rỗng ⇒ người dò chỉ cần gọi đủ nhanh là gần như không bao giờ chạm
--   ngưỡng. Với `/api/availability/search` (chỉ trả giá phòng công khai) thì đó
--   là phiền toái; với `/api/bookings/lookup` — route công khai DUY NHẤT chạm
--   dữ liệu đơn của khách — thì đó là cửa dò số điện thoại khách hàng.
--
-- ─── VÌ SAO POSTGRES CHỨ KHÔNG REDIS/UPSTASH ───────────────────────────────
--
--   Postgres đã có sẵn, đã có connection pool, đã có backup, đã nằm trong hợp
--   đồng vận hành. Thêm Redis nghĩa là thêm một nhà cung cấp, thêm một secret,
--   thêm một thứ có thể chết lúc 2 giờ sáng — cho một bộ đếm vài chục dòng.
--   Chi phí: một round-trip DB (~5ms trong cùng vùng) mỗi lời gọi lookup.
--
--   Nếu sau này lượng truy cập công khai tăng tới mức round-trip đó thành vấn
--   đề, đổi sang Redis chỉ cần viết lại thân `consumeRateLimit()` — chữ ký hàm
--   không đổi, route không phải sửa dòng nào.
--
-- BE7: file MỚI, không sửa migration đã chạy.
-- BE3: RLS bật + KHÔNG policy nào ⇒ `anon`/`authenticated` không đọc/ghi được.
--      Bộ đếm chỉ đi qua `service_role` trong Route Handler (service_role bỏ
--      qua RLS). Bảng này lưu IP khách — để lộ ra client là tự tạo thêm một
--      đường rò dữ liệu ngay trong thứ sinh ra để chống rò dữ liệu.

BEGIN;

CREATE TABLE IF NOT EXISTS public.api_rate_limits (
    -- `<bucket>:<định danh>` — ví dụ `booking-lookup:113.161.0.7`. Gộp bucket
    -- vào khoá để một IP bị chặn ở lookup vẫn tra được phòng trống bình thường.
    key           TEXT PRIMARY KEY,
    count         INT NOT NULL DEFAULT 0,
    -- Thời điểm cửa sổ hiện tại hết hạn. Quá mốc này thì đếm lại từ đầu.
    window_ends_at TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dọn hàng hết hạn theo lô (cron hoặc lời gọi cơ hội). Không có index này thì
-- câu DELETE quét toàn bảng.
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window
    ON public.api_rate_limits (window_ends_at);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

/*
 * Tiêu thụ MỘT lượt của cửa sổ hiện tại, trả về trạng thái sau khi tiêu thụ.
 *
 * ─── VÌ SAO LÀ HÀM SQL CHỨ KHÔNG PHẢI 2 CÂU TỪ TẦNG ỨNG DỤNG ──────────────
 *
 * "SELECT rồi UPDATE" từ Node là hai round-trip và có khe hở: hai request đến
 * cùng lúc cùng đọc `count = 59`, cùng ghi `60`, và cả hai đều được cho qua.
 * `INSERT ... ON CONFLICT DO UPDATE` là MỘT câu nguyên tử — Postgres khoá hàng
 * trong lúc cập nhật nên hai request đồng thời ra `60` và `61`, đúng một cái
 * bị chặn. Cùng họ lý do với `SELECT FOR UPDATE` của `create_booking_atomic`.
 *
 * `allowed` được tính SAU khi cộng: lượt thứ `p_limit` vẫn qua, lượt thứ
 * `p_limit + 1` bị chặn.
 */
CREATE OR REPLACE FUNCTION public.consume_rate_limit(
    p_key        TEXT,
    p_limit      INT,
    p_window_sec INT
)
RETURNS TABLE (allowed BOOLEAN, retry_after_sec INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_count    INT;
    v_ends_at  TIMESTAMPTZ;
BEGIN
    INSERT INTO public.api_rate_limits AS r (key, count, window_ends_at)
    VALUES (p_key, 1, NOW() + make_interval(secs => p_window_sec))
    ON CONFLICT (key) DO UPDATE
        SET count = CASE
                        -- Cửa sổ cũ đã hết hạn ⇒ mở cửa sổ mới, đếm lại từ 1.
                        WHEN r.window_ends_at <= NOW() THEN 1
                        ELSE r.count + 1
                    END,
            window_ends_at = CASE
                        WHEN r.window_ends_at <= NOW()
                            THEN NOW() + make_interval(secs => p_window_sec)
                        ELSE r.window_ends_at
                    END,
            updated_at = NOW()
    RETURNING r.count, r.window_ends_at INTO v_count, v_ends_at;

    RETURN QUERY SELECT
        (v_count <= p_limit),
        GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_ends_at - NOW())))::INT);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(TEXT, INT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(TEXT, INT, INT) TO service_role;

/*
 * Dọn hàng đã hết hạn. Gọi từ cron `release-holds` hoặc chạy tay.
 * Không gọi thì bảng phình theo số IP đã từng gọi — không sai kết quả, chỉ tốn
 * dung lượng.
 */
CREATE OR REPLACE FUNCTION public.purge_expired_rate_limits()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_removed INT;
BEGIN
    DELETE FROM public.api_rate_limits WHERE window_ends_at < NOW() - INTERVAL '1 hour';
    GET DIAGNOSTICS v_removed = ROW_COUNT;
    RETURN v_removed;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_rate_limits() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purge_expired_rate_limits() TO service_role;

COMMIT;
