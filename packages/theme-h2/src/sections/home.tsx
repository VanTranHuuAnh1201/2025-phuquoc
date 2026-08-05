import {
    AboutSection,
    DiningSection,
    PlacesSection,
    PracticalSection,
    RoomsSection,
    type AboutSectionProps,
    type DiningSectionProps,
    type PlacesSectionProps,
    type PracticalSectionProps,
    type RoomsSectionProps,
} from '@repo/domain-hotel'

import { ui } from '../strings'
import { SECTION_HEADINGS } from './headings'

/**
 * Section trang chủ mang sẵn bản sắc của mẫu 02.
 *
 * Bố cục thật sự sống ở `@repo/domain-hotel` — nhiều mẫu của domain lưu trú
 * dùng chung, chép sang từng theme là đúng thứ luật R1 cấm. Năm hàm dưới đây
 * chỉ là lớp vỏ nạp sẵn hai thứ THUỘC VỀ MẪU: bộ nhãn `ui` (giọng văn) và bộ
 * class tiêu đề `SECTION_HEADINGS` (bản sắc thị giác).
 *
 * Nhờ lớp vỏ này, nơi gọi bên ngoài — `apps/2026-thenamduhillresort`, app một
 * mẫu không tiền tố đường dẫn — dùng đúng như trước mà không phải biết tới hai
 * prop đó.
 *
 * `slug` KHÔNG được nạp sẵn: app resort truyền chuỗi rỗng (không tiền tố), hub
 * truyền `h2`. Cũng cố ý không có giá trị mặc định — mặc định sai làm mọi link
 * trỏ nhầm mẫu mà build vẫn xanh.
 */

export function H2About(props: AboutSectionProps) {
    return <AboutSection {...props} />
}

export function H2Rooms(props: Omit<RoomsSectionProps, 'ui' | 'headingClass'>) {
    return <RoomsSection {...props} ui={ui} headingClass={SECTION_HEADINGS} />
}

export function H2Dining(props: Omit<DiningSectionProps, 'headingClass'>) {
    return <DiningSection {...props} headingClass={SECTION_HEADINGS} />
}

export function H2Places(props: Omit<PlacesSectionProps, 'headingClass'>) {
    return <PlacesSection {...props} headingClass={SECTION_HEADINGS} />
}

export function H2Practical(props: Omit<PracticalSectionProps, 'ui'>) {
    return <PracticalSection {...props} ui={ui} />
}
