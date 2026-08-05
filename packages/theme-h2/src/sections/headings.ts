/**
 * Class dùng chung cho tiêu đề section của mẫu 07.
 *
 * VÌ SAO TÁCH RA: năm section (Rooms, Dining, Places, Gallery, Booking) đều
 * là "tiêu đề một dải nội dung" — cùng một vai trò thị giác. Trước đây mỗi
 * file chép lại nguyên chuỗi class, và Booking đã trôi lệch (14px/0.06em thay
 * vì 15px/0.07em) mà không ai nhận ra. Đổi cỡ chữ tiêu đề lẽ ra là sửa một
 * chỗ, không phải năm chỗ (luật R12).
 *
 * VÌ SAO KHÔNG ĐẨY LÊN `ui`: đây là *bản sắc* của mẫu 07 — chữ hoa, giãn chữ
 * rộng, đậm. Mẫu khác có ngôn ngữ riêng. Tầng nền không được mang bản sắc
 * thương hiệu (luật R3).
 */

/**
 * Tiêu đề dải nội dung — chữ hoa, giãn chữ, đậm.
 *
 * `mr-auto` đẩy phần còn lại của header (nút cuộn, link "Xem tất cả") về sát
 * mép phải. Dùng nó thay `justify-between` vì header có BA phần tử —
 * `justify-between` sẽ dàn đều và ném cụm nút ra giữa.
 */
export const SECTION_HEADING =
    'mr-auto text-[15px] font-bold tracking-[0.07em] text-text-primary uppercase min-[960px]:text-[16px]'

/**
 * Bản không có `mr-auto` — dùng khi tiêu đề đứng một mình, không chia hàng với
 * nút hay link nào.
 */
export const SECTION_HEADING_SOLO =
    'text-[15px] font-bold tracking-[0.07em] text-text-primary uppercase min-[960px]:text-[16px]'

/**
 * Tiêu đề BÊN TRONG một thẻ (khối đánh giá, khối phụ) — nhỏ hơn một bậc so với
 * tiêu đề dải để giữ đúng thứ bậc thị giác. Cố ý khác `SECTION_HEADING`, không
 * phải trôi lệch.
 */
export const CARD_HEADING =
    'mt-0 mb-4 text-[14px] font-bold tracking-[0.06em] text-text-primary uppercase'
