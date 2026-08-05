import type { SectionHeadingClasses } from '@repo/domain-hotel'

/**
 * Bộ class tiêu đề của mẫu 03 — cấp cho các section dùng chung của
 * `@repo/domain-hotel` qua prop `headingClass`.
 *
 * VÌ SAO KHÁC MẪU 02: mẫu 02 dùng tiêu đề CHỮ HOA giãn rộng
 * (`uppercase tracking-[0.07em]`) — giọng marketing, gọi mời. Mẫu 03 là navy
 * trầm, tiêu đề chữ thường cỡ lớn hơn theo kiểu editorial. Đây đúng là chỗ
 * khác biệt giữa hai mẫu được phép sống (luật P1 — mỗi mẫu một Design DNA),
 * và cũng là lý do chuỗi class KHÔNG nằm ở `domain-hotel`.
 *
 * `mr-auto` là bắt buộc trong hợp đồng: nó đẩy nút cuộn và link "Xem tất cả"
 * về sát mép phải. Dùng `justify-between` thay nó sẽ dàn đều ba phần tử của
 * header và ném cụm nút ra giữa.
 *
 * `SectionHeading.tsx` của mẫu này dựng tiêu đề cho bốn section RIÊNG (Hero,
 * HostService, Panorama, Gallery). File này phục vụ các section DÙNG CHUNG.
 * Hai nơi cùng đọc một thang cỡ chữ nên nhìn vẫn là một mẫu.
 */
export const SECTION_HEADINGS: SectionHeadingClasses = {
    section:
        'mr-auto text-[19px] leading-[1.2] font-bold tracking-[-0.01em] text-text-primary min-[960px]:text-[22px]',
}
