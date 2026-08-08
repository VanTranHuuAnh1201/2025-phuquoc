'use client'

/**
 * DRAWER PHẢI DÙNG CHUNG — mở từ bất kỳ đâu bằng một lệnh gọi hàm.
 *
 *     const { show } = useDrawerRight()
 *     show({ title: 'Chi tiết đơn', children: <OrderDetail id={id} /> })
 *
 * VÌ SAO LÀ PROVIDER CHỨ KHÔNG PHẢI COMPONENT ĐẶT VÀO TỪNG MÀN: cách kia bắt
 * mỗi màn tự khai ba thứ — import component, giữ state đang mở cái gì, và nhớ
 * render nó ở cuối JSX. Bốn màn là bốn bản sao của cùng một đoạn, và mỗi drawer
 * mới sau này lại nhân lên tiếp. Ở đây màn gọi hàm là xong; việc dựng lớp nổi,
 * khoá cuộn, bẫy focus, chồng lớp đều nằm gọn một chỗ.
 *
 * XẾP CHỒNG NHIỀU LỚP: `show()` gọi khi đang có drawer thì ĐẨY THÊM một lớp,
 * không thay thế. Escape và nút quay lại gỡ đúng lớp trên cùng. Đây là thứ
 * `useState` ở từng màn không làm nổi, và là lý do nghiệp vụ thật: từ đơn hàng
 * mở hồ sơ khách, xem xong quay lại đúng đơn đang dở.
 *
 * TẦNG NỀN (R15): file này không biết "đơn hàng" hay "phòng" là gì — chỉ biết
 * tiêu đề, nội dung và nút. Nghiệp vụ nằm ở phía gọi.
 */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

export interface DrawerRightOptions {
    /** Tiêu đề trên thanh đầu. */
    title?: ReactNode
    /** Dòng phụ dưới tiêu đề — chủ thể, trạng thái. */
    subtitle?: ReactNode
    children: ReactNode
    /** Mặc định hiện thanh đầu. Tắt khi nội dung tự lo phần đầu của nó. */
    isHeader?: boolean
    /** Mặc định KHÔNG có chân trang — chỉ bật khi thật sự có hành động. */
    isFooter?: boolean
    /** Hiện nút quay lại lớp trước. Tự bật khi drawer này nằm trên lớp khác. */
    isBack?: boolean
    /** Nhãn nút xác nhận ở chân trang. */
    okMess?: ReactNode
    onOk?: () => void
    /** Khoá nút xác nhận — dùng khi form chưa hợp lệ. */
    okDisabled?: boolean
    /** Nhãn nút huỷ. Bỏ trống thì dùng "Đóng". */
    cancelMess?: ReactNode
    /** Thay toàn bộ chân trang bằng nội dung tự đặt; bỏ qua okMess/cancelMess. */
    footer?: ReactNode
    /** Thêm class cho khung nội dung — chỉnh bề rộng: `sm:!max-w-[941px]`. */
    contentClassname?: string
    /** Gọi khi lớp này đóng, bất kể đóng bằng cách nào. */
    onClose?: () => void
}

interface DrawerLayer extends DrawerRightOptions {
    key: number
}

interface DrawerRightContextValue {
    /** Mở thêm một lớp drawer. Trả về hàm đóng đúng lớp vừa mở. */
    show: (options: DrawerRightOptions) => () => void
    /** Đóng lớp trên cùng. */
    close: () => void
    /** Đóng tất cả các lớp. */
    closeAll: () => void
    /** Số lớp đang mở — 0 là không có gì. */
    depth: number
}

const DrawerRightContext = createContext<DrawerRightContextValue | null>(null)

export function useDrawerRight() {
    const ctx = useContext(DrawerRightContext)
    if (!ctx) {
        // Ném lỗi thay vì trả no-op im lặng: gọi `show()` mà không thấy gì hiện
        // ra là lỗi mất hàng giờ để tìm, còn thiếu Provider thì hỏng ngay lần
        // chạy đầu và chỉ đúng một chỗ để sửa.
        throw new Error('useDrawerRight phải nằm trong <DrawerRightProvider>')
    }
    return ctx
}

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface DrawerRightProviderProps {
    children: ReactNode
    /** Nhãn mặc định, để nơi dùng truyền chuỗi đã dịch vào (luật R6/C7). */
    labels?: { close?: string; back?: string; cancel?: string }
}

export function DrawerRightProvider({ children, labels }: DrawerRightProviderProps) {
    const [layers, setLayers] = useState<DrawerLayer[]>([])
    const seq = useRef(0)

    const close = useCallback(() => {
        setLayers((current) => {
            const top = current[current.length - 1]
            top?.onClose?.()
            return current.slice(0, -1)
        })
    }, [])

    const closeAll = useCallback(() => {
        setLayers((current) => {
            current.forEach((l) => l.onClose?.())
            return []
        })
    }, [])

    const show = useCallback((options: DrawerRightOptions) => {
        const key = ++seq.current
        setLayers((current) => [...current, { ...options, key }])
        // Trả hàm đóng ĐÚNG LỚP NÀY theo key, không phải "đóng lớp trên cùng":
        // lúc bên gọi dùng tới nó, có thể đã có lớp khác chồng lên.
        return () => {
            setLayers((current) => {
                const target = current.find((l) => l.key === key)
                target?.onClose?.()
                return current.filter((l) => l.key !== key)
            })
        }
    }, [])

    const value = useMemo<DrawerRightContextValue>(
        () => ({ show, close, closeAll, depth: layers.length }),
        [show, close, closeAll, layers.length],
    )

    return (
        <DrawerRightContext.Provider value={value}>
            {children}
            {layers.map((layer, index) => (
                <DrawerLayerView
                    key={layer.key}
                    layer={layer}
                    index={index}
                    isTop={index === layers.length - 1}
                    onClose={close}
                    labels={labels}
                />
            ))}
        </DrawerRightContext.Provider>
    )
}

function DrawerLayerView({
    layer,
    index,
    isTop,
    onClose,
    labels,
}: {
    layer: DrawerLayer
    index: number
    isTop: boolean
    onClose: () => void
    labels?: { close?: string; back?: string; cancel?: string }
}) {
    const panelRef = useRef<HTMLDivElement>(null)
    const restoreRef = useRef<HTMLElement | null>(null)
    const titleId = useId()

    const [mounted, setMounted] = useState(false)
    // Tách khỏi việc render để chạy được hiệu ứng TRƯỢT VÀO. Render thẳng ở
    // trạng thái cuối thì trình duyệt không có gì để nội suy và drawer hiện ra
    // đột ngột.
    const [visible, setVisible] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        const raf = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(raf)
    }, [])

    useEffect(() => {
        // Chỉ lớp TRÊN CÙNG nghe phím và giữ focus — nếu mọi lớp cùng nghe thì
        // một lần Escape đóng sạch cả chồng.
        if (!isTop) return

        restoreRef.current = document.activeElement as HTMLElement | null
        const panel = panelRef.current
        panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                event.stopPropagation()
                onClose()
                return
            }
            if (event.key !== 'Tab' || !panel) return

            const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]
            if (items.length === 0) return
            const first = items[0]!
            const last = items[items.length - 1]!

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            restoreRef.current?.focus()
        }
    }, [isTop, onClose])

    useEffect(() => {
        // Khoá cuộn nền. Mỗi lớp tự lưu và tự trả lại giá trị cũ, nên chồng ba
        // lớp rồi gỡ dần vẫn về đúng trạng thái ban đầu.
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previous
        }
    }, [])

    if (!mounted) return null

    const showHeader = layer.isHeader ?? true
    const showBack = layer.isBack ?? index > 0
    const closeLabel = labels?.close ?? 'Đóng'

    const hasFooter = layer.footer ? true : (layer.isFooter ?? Boolean(layer.okMess))

    return createPortal(
        // `data-cms` BẮT BUỘC ở đây: token CMS khai trong phạm vi `[data-cms]`
        // (xem tokens.css), mà portal đưa node ra khỏi cây con đó. Thiếu thuộc
        // tính này thì mọi `var(--cms-*)` trả rỗng và drawer hiện ra trắng trơn
        // — hỏng im lặng, build vẫn xanh.
        <div data-cms>
            <div
                role="presentation"
                onClick={(event) => {
                    if (event.target === event.currentTarget) onClose()
                }}
                className="fixed inset-0 bg-[var(--cms-scrim)] transition-opacity duration-[var(--cms-motion-panel)]"
                style={{
                    // Bắt đầu ở bậc `--cms-z-drawer` (60), mỗi lớp chồng thêm
                    // cộng 2. DƯỚI Modal (100) là cố ý — xem ghi chú thang xếp
                    // lớp trong tokens.css: hộp xác nhận bung ra từ drawer phải
                    // nằm đè lên chính drawer đó.
                    zIndex: 60 + index * 2,
                    opacity: visible ? 1 : 0,
                }}
            >
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={showHeader ? titleId : undefined}
                    onClick={(event) => event.stopPropagation()}
                    className={[
                        // `100dvh` KHÔNG PHẢI `100vh`: trên iOS Safari `vh` tính
                        // cả thanh địa chỉ, nên chân trang dính bị đẩy xuống dưới
                        // mép nhìn thấy — đúng chỗ đặt nút Lưu.
                        'fixed top-0 right-0 flex h-[100dvh] w-full flex-col',
                        'bg-[var(--cms-bg)] shadow-[var(--cms-shadow-modal)]',
                        'border-l border-[var(--cms-border)]',
                        // Trượt ngang bằng `transform` (chạy trên compositor),
                        // không bằng `right` — animate `right` ép trình duyệt
                        // tính lại layout cả bảng 30 hàng phía sau mỗi khung hình.
                        'transition-transform duration-[var(--cms-motion-panel)] ease-[var(--cms-ease-panel)]',
                        visible ? 'translate-x-0' : 'translate-x-full',
                        // Dưới 640px chiếm trọn màn: drawer 520px trên máy 375px
                        // chỉ chừa lại một dải nền vô nghĩa. Cùng ngưỡng với
                        // `DataTable` (bảng đổi sang thẻ) nên toàn CMS chỉ có
                        // MỘT điểm gãy phải nhớ.
                        'max-sm:!max-w-none max-sm:border-l-0',
                        'sm:max-w-[520px]',
                        layer.contentClassname ?? '',
                    ].join(' ')}
                >
                    {showHeader && (
                        <header className="flex shrink-0 items-start justify-between gap-[var(--cms-gap)] border-b border-[var(--cms-border)] px-[var(--cms-pad)] py-3">
                            <div className="flex min-w-0 items-start gap-2">
                                {showBack && (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        aria-label={labels?.back ?? 'Quay lại'}
                                        className="cms-drawer-iconbtn"
                                    >
                                        ←
                                    </button>
                                )}
                                <div className="min-w-0">
                                    <h2
                                        id={titleId}
                                        className="m-0 text-[length:var(--cms-text-body)] font-semibold text-[var(--cms-text)]"
                                    >
                                        {layer.title}
                                    </h2>
                                    {layer.subtitle && (
                                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                                            {layer.subtitle}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={closeLabel}
                                className="cms-drawer-iconbtn"
                            >
                                ✕
                            </button>
                        </header>
                    )}

                    <div className="min-h-0 flex-1 overflow-y-auto p-[var(--cms-pad)]">
                        {layer.children}
                    </div>

                    {hasFooter && (
                        <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-[var(--cms-border)] bg-[var(--cms-bg)] px-[var(--cms-pad)] py-3">
                            {layer.footer ?? (
                                <>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="cms-btn-secondary"
                                    >
                                        {layer.cancelMess ?? labels?.cancel ?? closeLabel}
                                    </button>
                                    {layer.okMess && (
                                        <button
                                            type="button"
                                            onClick={layer.onOk}
                                            disabled={layer.okDisabled}
                                            className="cms-btn-primary"
                                        >
                                            {layer.okMess}
                                        </button>
                                    )}
                                </>
                            )}
                        </footer>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    )
}
