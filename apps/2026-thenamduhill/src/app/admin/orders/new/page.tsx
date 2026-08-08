'use client'

/**
 * Route tạo đơn thủ công — VỎ MỎNG quanh `NewBookingForm`.
 *
 * Route này PHẢI GIỮ dù Dashboard đã mở form trong drawer: lễ tân cần deep-link
 * để mở tab mới trong lúc đang nghe điện thoại (ticket 100-02 §6.4), và drawer
 * không có URL để gửi cho nhau.
 *
 * Toàn bộ trường, tính giá và nghiệp vụ nằm ở `_shared/NewBookingForm.tsx` —
 * một nguồn duy nhất cho cả hai chỗ dùng (C10).
 */

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/components/LocaleProvider'
import { S, tr } from '@/strings'
import { NewBookingForm } from '../_shared/NewBookingForm'

export default function NewBookingPage() {
    const { locale } = useLocale()
    const router = useRouter()

    return (
        <div className="w-full flex-1 overflow-y-auto p-4 space-y-6 pb-20 max-w-6xl mx-auto">
            <Link
                href="/admin/orders"
                style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                }}
            >
                ← {tr(S.orders, locale)}
            </Link>

            <header>
                <h1
                    style={{
                        margin: 0,
                        fontSize: 'var(--text-2xl)',
                        fontFamily: 'var(--font-display)',
                    }}
                >
                    {tr(S.newBooking, locale)}
                </h1>
                <p
                    style={{
                        margin: 'var(--space-2) 0 0',
                        maxWidth: '65ch',
                        fontSize: 'var(--text-sm)',
                        lineHeight: 1.6,
                        color: 'var(--text-muted)',
                    }}
                >
                    {tr(S.newBookingSubtitle, locale)}
                </p>
            </header>

            <NewBookingForm
                variant="page"
                onCreated={(id) => router.push(`/admin/orders/${id}`)}
                onCancel={() => router.back()}
            />
        </div>
    )
}
