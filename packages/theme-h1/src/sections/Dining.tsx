import { pick, type Locale, type PropertyData } from '@repo/core'

import { ui } from '../strings'

/**
 * Section `dining` — dải cát toàn khổ, trình bày như BẢNG THÔNG TIN ở quầy
 * lễ tân: tên quầy đối xứng giờ mở cửa (chi tiết trust, spec §2.1), mô tả một
 * dòng dưới. Không ảnh, không card — nhịp chữ giữa hai section nhiều ảnh
 * (rooms trước, places sau).
 */

export function Dining({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)

    return (
        <section id="dining" className="pt-7">
            {/* `--color-surface-sand` nằm NGOÀI bộ D1 nên phải trỏ thẳng vào biến. */}
            <div className="bg-[var(--color-surface-sand)] py-6">
                <div
                    className={[
                        'h6-container grid gap-5',
                        // 900px là ngưỡng riêng của mẫu, không phải md/lg mặc định.
                        'min-[900px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]',
                        'min-[900px]:items-start',
                    ].join(' ')}
                >
                    <div>
                        <p className="h6-kicker mt-0 mb-2">{t.diningKicker}</p>
                        <h2 className="h6-display m-0 max-w-[14ch] text-3xl">
                            {locale === 'vi'
                                ? 'Ăn ngay tại resort, không phải xuống núi'
                                : 'Eat well without leaving the hill'}
                        </h2>
                    </div>

                    <ul className="m-0 grid list-none gap-0 p-0">
                        {data.dining.map((item) => (
                            <li key={item.id} className="border-t border-border-default py-3">
                                <div className="flex flex-wrap items-baseline justify-between gap-3">
                                    <h3 className="m-0 text-lg font-bold">
                                        {pick(item.name, locale)}
                                    </h3>
                                    <span className="text-sm font-medium text-brand tabular-nums">
                                        {pick(item.note, locale)}
                                    </span>
                                </div>
                                <p className="mt-1 mb-0 max-w-[56ch] text-sm text-text-secondary">
                                    {pick(item.desc, locale)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
