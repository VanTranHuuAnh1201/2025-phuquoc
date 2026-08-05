import { pick, telHref, type Brand, type Locale } from '@repo/core'

import { H4 } from '../strings'
import { Container, Rule, Section, SectionHeading, primaryButtonClass } from './primitives'

/**
 * Section `contact` — ba cam kết + lối vào đặt phòng cuối trang.
 *
 * VÌ SAO KHÔNG PHẢI BADGE "BEST!" "#1":
 * P11 "Confidence" nói thẳng: rải badge tự khen là dấu hiệu thiếu tự tin. Ba
 * mục dưới đây đều là SỰ THẬT KIỂM CHỨNG ĐƯỢC — chính chủ, giữ vé tàu, dời
 * ngày miễn phí khi biển động. Chúng giải quyết đúng ba nỗi lo có thật của
 * người đi Nam Du, chứ không phải trang trí.
 *
 * KHÔNG BỊA KHAN HIẾM: không có "chỉ còn 3 phòng" ở đây. `Room.remaining` là
 * dữ liệu tuỳ chọn và bản demo chưa nối tồn kho thật — hiện số bịa là dark
 * pattern mà P10 cấm thẳng.
 *
 * Icon là SVG, không emoji (luật D5).
 */

export interface AssuranceProps {
    locale: Locale
    brand: Brand
    /** Đích của CTA cuối trang. */
    bookHref: string
}

function IconHouse() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M9.5 20v-6h5v6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function IconBoat() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M3 17.5c1.6 0 1.6 1.5 3.2 1.5s1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5 1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5M4.5 14 12 4l7.5 10M12 4v10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function IconCalendar() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M4 6.5h16v14H4zM4 10.5h16M8.5 3.5v4M15.5 3.5v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function Assurance({ locale, brand, bookHref }: AssuranceProps) {
    const items = [
        { icon: <IconHouse />, title: H4.trustOwner, desc: H4.trustOwnerDesc },
        { icon: <IconBoat />, title: H4.trustBoat, desc: H4.trustBoatDesc },
        { icon: <IconCalendar />, title: H4.trustWeather, desc: H4.trustWeatherDesc },
    ]

    return (
        <Section id="contact" tone="base">
            <Container>
                <SectionHeading
                    eyebrow={pick(H4.trustEyebrow, locale)}
                    title={pick(H4.trustTitle, locale)}
                />

                <div className="mt-[var(--space-6)] grid gap-[var(--space-5)] md:grid-cols-3">
                    {items.map((item) => (
                        <div key={item.title.vi} className="flex flex-col gap-4">
                            <Rule />
                            <span className="text-brand">{item.icon}</span>
                            <h3 className="m-0 text-lg leading-[1.35] font-medium text-balance text-text-primary">
                                {pick(item.title, locale)}
                            </h3>
                            <p className="m-0 text-base leading-[var(--line-height-base)] text-text-secondary">
                                {pick(item.desc, locale)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Lối vào đặt phòng cuối trang. ĐÚNG MỘT CTA chính ở đây, số
                    điện thoại là link phụ dạng chữ (P10). */}
                <div className="mt-[var(--space-6)] flex flex-col items-start gap-5 border-t border-solid border-[var(--border)] pt-[var(--space-5)] sm:flex-row sm:items-center sm:justify-between">
                    <p className="m-0 text-base text-text-secondary">
                        Hotline / Zalo{' '}
                        <a
                            href={telHref(brand.phone)}
                            className="font-medium text-brand no-underline underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
                        >
                            {brand.phone}
                        </a>
                    </p>

                    <a href={bookHref} className={primaryButtonClass}>
                        {pick(H4.reserveThisRoom, locale)}
                    </a>
                </div>
            </Container>
        </Section>
    )
}
