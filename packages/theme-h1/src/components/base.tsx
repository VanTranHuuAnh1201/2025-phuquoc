/**
 * CSS nền của mẫu 06 — nhúng một lần trong mỗi trang (Home/Rooms/RoomDetail).
 *
 * Đủ 7 trạng thái cho component tương tác (luật D3): default · hover ·
 * focus-visible (viền toàn cục ở `@repo/ui/tokens.css`) · active · disabled ·
 * loading (`aria-busy`, giữ nguyên kích thước) · error.
 *
 * Không có hex nào ở đây — mọi màu đọc từ token (luật D0). Hover/active đổi
 * bằng filter/shadow nên không cần thêm bậc màu ngoài bảng.
 *
 * VÌ SAO FILE NÀY KHÔNG MIGRATE SANG TAILWIND CLASS — dù phần còn lại của theme
 * đã chuyển:
 *
 *   `.h6-btn`, `.h6-input`, `.h6-field`, `.h6-display`, `.h6-container`,
 *   `.h6-kicker`, `.h6-link` là HỢP ĐỒNG CLASS TOÀN CỤC của mẫu — 9 file
 *   section khác gọi chúng bằng TÊN (`className="h6-btn h6-btn-primary"`).
 *   Đây là chỗ ĐỊNH NGHĨA, không phải chỗ tiêu thụ. Đổi sang utility ở đây
 *   không xoá được lời gọi bên kia, chỉ làm chúng trỏ vào hư không.
 *
 *   Ngoài ra phần lớn quy tắc dưới đây Tailwind không biểu diễn được trong một
 *   `<style>` runtime: `@keyframes`, `::after` của trạng thái loading,
 *   `[aria-busy]` / `[aria-disabled]`, `@media (prefers-reduced-motion)`,
 *   và `.h6-sr` (clip rect cho screen reader).
 *
 *   `.h6-input-error` / `.h6-error-text` hiện chưa có section nào gọi, nhưng
 *   GIỮ LẠI: chúng là trạng thái `error` của hợp đồng 7 trạng thái D3 — xoá đi
 *   là form nào thêm sau cũng thiếu bậc lỗi. `.h6-card` và `.h6-sr` giữ vì
 *   cùng lý do (primitive dùng lại).
 */

export function BaseCss() {
    return (
        <style>{`
/* Slug là 'h1' — mẫu này từng tên là h6, đổi tên ở commit b1c83e0 nhưng
   selector còn sót lại nên khối này chết âm thầm: font và nền cấp gốc không
   áp, chỉ được token layer bù nên khó thấy. Tiền tố class h6- giữ nguyên vì
   đổi sẽ chạm 9 file, và tên class không ảnh hưởng hoạt động. */
[data-theme='h1'] {
    font-family: var(--font-family-primary);
    color: var(--color-text-primary);
    line-height: var(--line-height-base);
    background: var(--color-surface-base);
}
.h6-container {
    max-width: var(--container);
    margin: 0 auto;
    padding-left: var(--space-4);
    padding-right: var(--space-4);
}
.h6-kicker {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-brand);
}
.h6-display {
    font-family: var(--font-display);
    font-weight: var(--font-weight-medium);
    letter-spacing: -0.01em;
    line-height: 1.15;
    margin: 0;
}

/* ---- nút ------------------------------------------------------------- */
.h6-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    min-height: 48px;
    padding: 0 var(--space-4);
    border-radius: var(--radius-md);
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
    transition: filter var(--motion-instant) ease, box-shadow var(--motion-instant) ease,
        background var(--motion-instant) ease, border-color var(--motion-instant) ease;
}
.h6-btn-primary {
    background: var(--color-accent);
    color: var(--color-text-primary);
}
.h6-btn-primary:hover { filter: brightness(0.95); box-shadow: var(--shadow-2); }
.h6-btn-primary:active { filter: brightness(0.88); }
.h6-btn-brand {
    background: var(--color-brand);
    color: var(--color-text-inverse);
}
.h6-btn-brand:hover { filter: brightness(0.92); box-shadow: var(--shadow-2); }
.h6-btn-brand:active { filter: brightness(0.85); }
.h6-btn-ghost {
    background: transparent;
    color: var(--color-text-primary);
    border-color: var(--color-border-default);
    min-height: 44px;
    font-weight: var(--font-weight-medium);
}
.h6-btn-ghost:hover { background: var(--color-surface-sand); border-color: var(--border-strong); }
.h6-btn-ghost:active { filter: brightness(0.96); }
.h6-btn:disabled,
.h6-btn[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.55;
    filter: none;
    box-shadow: none;
}
.h6-btn[aria-busy='true'] {
    pointer-events: none;
    position: relative;
    color: transparent;
}
.h6-btn[aria-busy='true']::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    border: 2px solid var(--color-text-primary);
    border-right-color: transparent;
    animation: h6-spin 0.8s linear infinite;
}
@keyframes h6-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
    .h6-btn { transition: none; }
    .h6-btn[aria-busy='true']::after { animation-duration: 2s; }
}

/* ---- field ------------------------------------------------------------ */
.h6-field { display: grid; gap: 6px; min-width: 0; }
.h6-field > label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
}
.h6-input {
    width: 100%;
    min-height: 48px;
    padding: 0 var(--space-3);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    background: var(--color-surface-raised);
    color: var(--color-text-primary);
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    transition: border-color var(--motion-instant) ease;
}
.h6-input:hover { border-color: var(--border-strong); }
.h6-input:disabled { cursor: not-allowed; opacity: 0.55; }
.h6-input-error { border-color: var(--color-danger); }
.h6-error-text { font-size: var(--font-size-sm); color: var(--color-danger); }

/* ---- link chìm --------------------------------------------------------- */
.h6-link {
    color: var(--color-brand);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
}
.h6-link:hover { text-decoration: underline; }

/* ---- thẻ có hover ------------------------------------------------------ */
.h6-card {
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border-muted);
    border-radius: var(--radius-lg);
    transition: box-shadow var(--motion-instant) ease, border-color var(--motion-instant) ease;
}
.h6-card:hover { box-shadow: var(--shadow-2); border-color: var(--color-border-default); }

/* Nội dung chỉ dành cho screen reader. */
.h6-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
}
        `}</style>
    )
}

