import { pick, type Locale } from '@repo/core'
import { Anchor, LifeBuoy, ShieldCheck } from 'lucide-react'

import { H3 } from '../strings'

/**
 * Dải tín nhiệm ngay dưới hero — ba lý do tin resort này, trước khi khách kịp
 * mở tab so sánh.
 *
 * VÌ SAO ĐỨNG NGAY SAU HERO: khách vừa thấy giá và nút đặt phòng xong là câu
 * hỏi kế tiếp luôn là "chỗ này có thật không, đặt rồi hỏng chuyến thì sao".
 * Trả lời ở đây thì phần còn lại của trang được đọc bằng con mắt đã tin; đẩy
 * xuống cuối trang là trả lời sau khi khách đã rời (luật P10).
 *
 * KHỐI NÀY KHÔNG PHẢI SECTION ĐIỀU HƯỚNG: cố ý không mang `id` trong
 * `SECTION_IDS` — nó là dải bổ trợ đọc-lướt, không phải đích của deep-link hay
 * của menu (cùng lý do với `PracticalSection`, xem `composition.tsx`).
 *
 * NỘI DUNG LÀ CHUỖI CỦA MẪU, KHÔNG PHẢI DỮ LIỆU CƠ SỞ: ba lời hứa này là cam
 * kết vận hành đã chốt với khách hàng, giống nhau ở mọi cơ sở dùng mẫu này nên
 * chúng sống ở `strings.ts` (luật R12). Ngày nào chúng khác nhau theo từng cơ
 * sở thì chuyển lên `core` thành dữ liệu.
 */

const ITEMS = [
    { Icon: ShieldCheck, title: H3.trustOwnerTitle, desc: H3.trustOwnerDesc },
    { Icon: Anchor, title: H3.trustTransferTitle, desc: H3.trustTransferDesc },
    { Icon: LifeBuoy, title: H3.trustRefundTitle, desc: H3.trustRefundDesc },
] as const

export function TrustBar({ locale }: { locale: Locale }) {
    return (
        <section
            aria-label={pick(H3.trustOwnerTitle, locale)}
            className="bg-surface-base border-border-muted border-b"
        >
            {/*
              * ⚠️ SỐ TRONG CLASS SPACING KHÔNG PHẢI PIXEL — thang của dự án phi
              * tuyến (p-8 = --space-8 = 140px). Cần con số cụ thể thì viết trong
              * ngoặc vuông, đừng dùng số trần.
              */}
            <div className="mx-auto max-w-[var(--container)] px-4 py-[28px] min-[960px]:px-6 min-[960px]:py-[36px]">
                {/*
                  * Mobile KHÔNG chỉ là desktop xếp dọc (luật P9): ba khối này
                  * trên màn 375px thành ba đoạn văn dài, khách cuộn qua không
                  * đọc. Mobile bỏ mô tả, giữ lại tiêu đề + icon thành ba dòng
                  * quét nhanh; từ 768px mới mở ra đủ ba cột có mô tả.
                  */}
                <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-4 p-0 md:grid-cols-3 md:gap-y-0">
                    {ITEMS.map(({ Icon, title, desc }) => (
                        <li key={title.vi} className="flex items-start gap-3">
                            <span className="bg-surface-tint text-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-text-primary m-0 text-[14.5px] leading-snug font-bold">
                                    {pick(title, locale)}
                                </p>
                                <p className="text-text-secondary m-0 mt-1 hidden max-w-[46ch] text-[13.5px] leading-[1.6] md:block">
                                    {pick(desc, locale)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
