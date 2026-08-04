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
    return null
}
