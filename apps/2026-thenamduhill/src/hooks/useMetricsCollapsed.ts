/**
 * State ẩn/hiện `MetricStrip`, đọc/ghi thẳng `localStorage` — KHÔNG dùng
 * `useRailCollapse`.
 *
 * VÌ SAO KHÔNG DÙNG `useRailCollapse` Ở ĐÂY: hook đó gắn kèm một
 * `document.addEventListener('click', ..., true)` để tự thu gọn khi click RA
 * NGOÀI phần tử gắn `railRef`. Nút "Ẩn/Hiện số liệu" không có `<aside>` hay
 * vùng bao nào để `railRef` bám vào — `railRef.current` luôn là `null`, nên
 * điều kiện `railRef.current?.contains(target)` LUÔN sai, nghĩa là MỌI click
 * ở bất kỳ đâu trên trang (kể cả click ngay trên chính nút toggle, vì listener
 * chạy ở capture phase TRƯỚC `onClick` của nút) đều bị hook coi là "click ra
 * ngoài" và ép `collapsed = true` ngay lập tức — nút bấm mở ra rồi tự đóng lại
 * trong cùng một cú click, trông như "không hoạt động". `useRailCollapse` đúng
 * cho sidebar (có `<aside>` thật để `railRef` bám vào) — sai cho một nút
 * toggle không có vùng bao để theo dõi click-outside.
 *
 * TRÍCH RA DÙNG CHUNG (luật C10 — không copy code): ban đầu chỉ dashboard có
 * hook này; mọi màn CMS có `MetricStrip` khác (đơn hàng, khách hàng, buồng
 * phòng, khuyến mãi, tài khoản, ticket) đều cần cùng hành vi. `storageKey`
 * là tham số bắt buộc để MỖI MÀN NHỚ RIÊNG trạng thái ẩn/hiện của mình — dùng
 * chung một khoá sẽ khiến ẩn số liệu ở màn đơn hàng vô tình ẩn luôn ở màn
 * khách hàng dù người dùng chưa từng bấm ở đó.
 */

import { useEffect, useState } from 'react'

export function useMetricsCollapsed(storageKey: string): [boolean, () => void] {
    // Mặc định HIỆN (`false`) khi `localStorage` chưa có gì — đúng yêu cầu:
    // "Mặc định HIỆN số liệu".
    const [collapsed, setCollapsed] = useState(false)

    // Đọc từ `localStorage` sau khi mount — tránh đọc `window`/`localStorage`
    // lúc render đầu (SSR không có các API này, và Next 15 hydrate phía
    // client trước khi effect chạy nên không lệch hydration).
    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored !== null) setCollapsed(stored === '1')
        } catch {
            // localStorage không khả dụng — giữ mặc định HIỆN.
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey])

    const toggle = () => {
        setCollapsed((prev) => {
            const next = !prev
            try {
                localStorage.setItem(storageKey, next ? '1' : '0')
            } catch {
                // Không lưu được thì vẫn đổi trạng thái trong phiên hiện tại.
            }
            return next
        })
    }

    return [collapsed, toggle]
}
