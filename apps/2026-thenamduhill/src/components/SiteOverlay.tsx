'use client'

/**
 * Lớp phủ đăng nhập + chuông, đặt nổi trên trang chủ của MỌI theme.
 *
 * Vì sao là overlay của app chứ không nhét vào `Header` của từng theme:
 *
 * - `packages/theme-*` không được import code của app (luật R1). Nếu muốn theme
 *   tự render cụm này thì phải truyền component xuống qua `ThemeDefinition`, tức
 *   là đổi hợp đồng theme và bắt cả N theme sửa theo — đúng thứ luật R5 cấm.
 * - Cụm này là chức năng của SẢN PHẨM (tài khoản, đơn hàng), không phải hình
 *   thức của MẪU. Nó phải giống nhau ở cả 4 giao diện.
 *
 * Đặt `position: fixed` góc trên phải, trên z-index của header theme (60).
 */

import Link from 'next/link'
import { AccountBar } from './AccountBar'
import { useLocale } from './LocaleProvider'
import { S, tr } from '@/strings'

export function SiteOverlay() {
    const { locale } = useLocale()

    return (
        <div
            style={{
                position: 'fixed',
                top: 'var(--space-3)',
                right: 'var(--space-4)',
                zIndex: 70,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow)',
                color: 'var(--text)',
                fontFamily: 'var(--font-body)',
            }}
        >
            {/*
              Lối vào luồng đặt phòng. Các theme có nút `#booking` riêng nhưng
              đó là dải CTA gọi điện; nút này mới dẫn vào luồng 4 bước.
            */}
            <Link
                href="/booking"
                style={{
                    padding: 'var(--space-2) var(--space-4)',
                    background: 'var(--accent)',
                    color: 'var(--text-inverse)',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                }}
            >
                {tr(S.bookNow, locale)}
            </Link>

            <AccountBar />
        </div>
    )
}
