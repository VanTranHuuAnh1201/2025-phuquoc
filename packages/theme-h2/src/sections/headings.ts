import type { SectionHeadingClasses } from '@repo/domain-hotel'

/**
 * Class tiêu đề section — BẢN SẮC của mẫu 02.
 *
 * VÌ SAO TÁCH RA: các section "một dải nội dung" (Rooms, Dining, Places,
 * Gallery, Booking) đều là cùng một vai trò thị giác. Trước đây mỗi file chép
 * lại nguyên chuỗi class, và Booking đã trôi lệch (14px/0.06em thay vì
 * 15px/0.07em) mà không ai nhận ra. Đổi cỡ chữ tiêu đề lẽ ra là sửa một chỗ,
 * không phải năm chỗ (luật R12).
 *
 * VÌ SAO Ở LẠI THEME dù các section đã lên `@repo/domain-hotel`: chữ hoa, giãn
 * chữ rộng, đậm là *hình thức* — mẫu khác có ngôn ngữ thị giác riêng. Domain
 * chỉ giữ HÌNH DẠNG của hợp đồng (`SectionHeadingClasses`); giá trị cụ thể do
 * mẫu này cấp và truyền xuống qua prop `headingClass`. Tầng nền (`ui`) lại
 * càng không được mang bản sắc thương hiệu (luật R3/R15).
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
 * Bộ class mà mẫu 02 truyền cho các section dùng chung của `@repo/domain-hotel`.
 * Cùng một nguồn với `SECTION_HEADING` để section trong theme và section ở
 * domain không bao giờ trôi lệch nhau.
 */
export const SECTION_HEADINGS: SectionHeadingClasses = {
    section: SECTION_HEADING,
}

/**
 * Tiêu đề BÊN TRONG một thẻ (khối đánh giá, khối phụ) — nhỏ hơn một bậc so với
 * tiêu đề dải để giữ đúng thứ bậc thị giác. Cố ý khác `SECTION_HEADING`, không
 * phải trôi lệch.
 */
export const CARD_HEADING =
    'mt-0 mb-4 text-[14px] font-bold tracking-[0.06em] text-text-primary uppercase'
