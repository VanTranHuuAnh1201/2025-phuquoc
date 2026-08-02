import { themePath, type Locale, type PropertyData } from '@repo/core'
import { SectionHeader } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Dải "chọn theo chủ đề" — section riêng của mẫu 03, không nằm trong bộ id
 * chuẩn của luật R7 (core thừa nhận qua `CustomSectionId`).
 *
 * Sáu chip đánh số 01..06, nhãn lấy từ `ui.themes`. Đây là chuỗi giao diện
 * (cách mời chào của mẫu này), không phải dữ liệu nghiệp vụ — nên nằm ở
 * `strings.ts` chứ không ở `core`.
 */

export function Themes({ locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]

    return (
        <section
            id="themes"
            style={{
                background: 'var(--surface)',
                padding: '68px var(--space-6) var(--space-3)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <SectionHeader
                    kicker={t.themesKicker}
                    title={t.themesTitle}
                    sub={t.themesSub}
                    align="center"
                />

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
                        gap: 'var(--space-3)',
                    }}
                >
                    {t.themes.map((label, index) => (
                        <a
                            key={label}
                            href={themePath(SLUG, 'tours')}
                            style={{
                                display: 'grid',
                                gap: 'var(--space-2)',
                                justifyItems: 'center',
                                textAlign: 'center',
                                padding: '22px var(--space-3)',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--surface-tint)',
                                textDecoration: 'none',
                                transition: 'background var(--duration) var(--ease)',
                            }}
                        >
                            <span
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--surface)',
                                    color: 'var(--brand)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 800,
                                }}
                            >
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span
                                style={{
                                    fontSize: '13.5px',
                                    fontWeight: 700,
                                    color: 'var(--brand)',
                                    lineHeight: 1.4,
                                }}
                            >
                                {label}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
