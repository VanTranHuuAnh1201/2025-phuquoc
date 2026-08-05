import { pick, type Locale } from '@repo/core'

import { H4 } from '../strings'
import { Container, Eyebrow, SectionTitle } from './primitives'

/**
 * Section `dining` — dải ảnh 21:9 tràn viền + khối chữ trên nền tối.
 *
 * ĐÂY LÀ ĐIỂM NGHỈ CỦA TRANG. Sau ba section nền sáng liên tiếp, một dải tối
 * tràn khổ làm mắt dừng lại — "điểm nghỉ" mà P11 (Editorial) đòi và là nhịp
 * mà P5 nói tới. Không có nó, cuộn từ hero xuống chân trang là một mạch đều.
 *
 * CHỮ KHÔNG ĐÈ LÊN ẢNH. Ảnh nằm trên, khối chữ nằm dưới trên nền `--surface-dark`
 * đặc. Đây là khác biệt then chốt so với cách làm thường thấy (chữ trắng đè
 * giữa ảnh) — ảnh biển Nam Du sáng rực, chữ đè lên là không đọc nổi (P15).
 * Đổi lại, ảnh được giữ nguyên vẹn, không bị màng phủ làm đục.
 */

export interface CulinaryProps {
    locale: Locale
    /** Ảnh dải ngang. Rỗng thì chỉ còn khối chữ — vẫn đứng được. */
    image?: string
    imageAlt?: string
}

export function Culinary({ locale, image, imageAlt }: CulinaryProps) {
    return (
        <section id="dining" className="bg-[var(--surface-dark)]">
            {/* Ảnh tràn TOÀN BỘ chiều ngang, không nằm trong container — đây là
                "full-bleed" thật, thứ tạo cảm giác khổ lớn của Amanoi (P6). */}
            {image && (
                <div data-decor="image" className="relative aspect-[16/9] w-full md:aspect-[21/9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image}
                        alt={imageAlt ?? ''}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            )}

            <div className="py-[var(--space-6)] md:py-[var(--space-7)]">
                <Container>
                    <div className="h4-reveal grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-[var(--space-6)]">
                        <div className="flex flex-col gap-4">
                            <Eyebrow inverse>{pick(H4.diningEyebrow, locale)}</Eyebrow>
                            <SectionTitle className="text-text-inverse">
                                {pick(H4.diningTitle, locale)}
                            </SectionTitle>
                        </div>

                        {/* Chữ sáng trên nền `--surface-dark` #1E3A4C — đo được
                            13.4:1, vượt AAA. Đây là lý do khối chữ có nền
                            riêng thay vì nằm trên ảnh. */}
                        <p className="m-0 max-w-[var(--measure)] self-center text-lg leading-[var(--line-height-base)] text-[rgb(250_248_245/0.86)]">
                            {pick(H4.diningBody, locale)}
                        </p>
                    </div>
                </Container>
            </div>
        </section>
    )
}
