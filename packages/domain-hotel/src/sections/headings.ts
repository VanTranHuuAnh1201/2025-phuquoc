/**
 * Bộ class tiêu đề mà các section dùng chung của domain lưu trú nhận vào.
 *
 * VÌ SAO TÁCH RA: các section "một dải nội dung" (Rooms, Dining, Places,
 * Gallery, Booking) đều có cùng một vai trò thị giác — tiêu đề dải. Trước đây
 * mỗi file chép lại nguyên chuỗi class, và Booking đã trôi lệch (14px/0.06em
 * thay vì 15px/0.07em) mà không ai nhận ra. Đổi cỡ chữ tiêu đề lẽ ra là sửa
 * một chỗ, không phải năm chỗ (luật R12).
 *
 * VÌ SAO CHUỖI CLASS *KHÔNG* SỐNG Ở ĐÂY: `text-[15px]`, `tracking-[0.07em]`,
 * `uppercase` là quyết định HÌNH THỨC — bản sắc của một mẫu, không phải nghiệp
 * vụ lưu trú. Mẫu khác có ngôn ngữ thị giác riêng. Vì thế `domain-hotel` chỉ
 * giữ *hình dạng* của hợp đồng (`SectionHeadingClasses`) cùng một bộ TRUNG
 * TÍNH làm mặc định; mỗi theme truyền bộ của chính nó xuống qua prop
 * `headingClass`. Đây đúng là cách cắt của luật R15: domain nhận giá trị
 * nguyên thuỷ, theme quyết định giá trị đó là gì.
 *
 * VÌ SAO KHÔNG ĐẨY LÊN `ui`: tầng nền không được biết section `rooms`,
 * `dining`… tồn tại (luật R15), và cũng không được mang bản sắc thương hiệu
 * (luật R3).
 */

/** Hợp đồng class tiêu đề mà theme cấp cho section dùng chung. */
export interface SectionHeadingClasses {
    /**
     * Tiêu đề dải nội dung, đứng chung hàng với nút/link.
     *
     * Bộ nào cũng nên có `mr-auto`: nó đẩy phần còn lại của header (nút cuộn,
     * link "Xem tất cả") về sát mép phải. Dùng nó thay `justify-between` vì
     * header có BA phần tử — `justify-between` sẽ dàn đều và ném cụm nút ra
     * giữa.
     */
    section: string
}

/**
 * Bộ mặc định — cố ý TRUNG TÍNH: chỉ khai thứ bậc (cỡ chữ theo thang token,
 * đậm, màu chữ chính) và không khai bản sắc (không `uppercase`, không giãn
 * chữ). Theme nào không truyền `headingClass` vẫn đọc được, nhưng sẽ nhìn ra
 * ngay là chưa khai bộ riêng.
 */
export const DEFAULT_SECTION_HEADINGS: SectionHeadingClasses = {
    section: 'mr-auto text-lg leading-[1.25] font-bold text-text-primary',
}
