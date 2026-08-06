-- =============================================================================
-- 20260101000500_harden_function_search_path.sql
--
-- Vá cảnh báo bảo mật `0011_function_search_path_mutable` của Supabase advisor.
--
-- Hàm không cố định `search_path` có thể bị chiếm quyền: kẻ tấn công tạo một
-- schema giả đứng trước `public` trong search_path của phiên, đặt vào đó một
-- hàm/bảng trùng tên, thì thân hàm của ta gọi nhầm sang đồ của họ. Với
-- `current_account_id()` — hàm mà MỌI policy RLS đang dựa vào để xác định danh
-- tính — đây là lỗ hổng leo thang quyền, không phải cảnh báo hình thức.
--
-- Áp cho cả 4 hàm do 2 migration trước tạo ra. Không đổi thân hàm, chỉ gắn
-- thuộc tính, nên không ảnh hưởng hành vi đang chạy.
--
-- Kiểm chứng: chạy lại `get_advisors type=security`, 4 WARN phải biến mất.
-- =============================================================================

ALTER FUNCTION public.is_i18n_text_array(jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.touch_updated_at()        SET search_path = public, pg_temp;
ALTER FUNCTION public.next_booking_code()       SET search_path = public, pg_temp;
ALTER FUNCTION public.current_account_id()      SET search_path = public, pg_temp;
