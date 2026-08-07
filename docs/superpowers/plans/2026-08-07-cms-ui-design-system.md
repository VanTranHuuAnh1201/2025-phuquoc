# CMS Design System (`packages/cms-ui`) — Implementation Plan

> **Cho agentic worker:** REQUIRED SUB-SKILL: dùng `superpowers:subagent-driven-development`
> (khuyến nghị) hoặc `superpowers:executing-plans` để thực thi từng task.
> Các bước dùng checkbox (`- [ ]`) để theo dõi.

**Goal:** Dựng package `cms-ui` — design system riêng cho CMS dùng chung nhiều
sản phẩm — rồi áp vào Dashboard `/admin` và Danh sách đơn `/admin/orders`.

**Architecture:** `tokens.css` ghi đè CSS variable trong phạm vi `[data-cms]`
(KHÔNG phải `:root`). Nhờ đó `DataTable`/`Button`/`Badge` sẵn có của `@repo/ui`
— vốn đã đọc `var(--border)`, `var(--text-muted)`, `var(--surface-alt)` —
tự đổi diện mạo mà không sửa package dùng chung và không rò sang trang client.
Component trong `cms-ui` chỉ bọc thêm 3 chỗ `@repo/ui` hard-code class.

**Tech Stack:** Next 15 · React 19 · Tailwind v4 · pnpm workspace · TypeScript strict

**Spec:** `docs/superpowers/specs/2026-08-07-cms-ui-design-system-design.md`

---

## Global Constraints

Áp cho MỌI task. Không lặp lại trong từng task.

- **Không có test framework** trong repo. CLAUDE.md: *"Chưa có test framework —
  không bịa lệnh test."* Verify bằng `pnpm typecheck`, `grep` tự kiểm, và mắt
  trên dev server. **Không** viết `pnpm test`.
- **Không `any`** (`C1`). Không biết kiểu → `unknown` rồi thu hẹp.
- **Không hex ngoài `tokens.css`** (`D0`).
- **Không spacing/radius ngoài thang 8pt** (`P5`).
- **`cms-ui` không import** `@repo/core`, `@repo/domain-*`, `@repo/theme-*` (`R1`).
- **`cms-ui` không nhắc từ vựng ngành** — không `booking`, `room`, `guest`,
  `phòng`, `đơn hàng` trong tên biến/type/prop (`R15`). Dùng `label`, `value`,
  `tone`, `count`.
- **Không `outline: none`** ở bất kỳ đâu (`D3`/`FE1`).
- **Mọi chuỗi người dùng thấy phải `{vi, en}`** qua `tr()` (`C7`/`FE6`).
- **Badge trạng thái có chấm + CHỮ**, không chỉ màu (`D4`).
- Thụt lề **4 space**, theo đúng file đang sửa. Không reformat cả file.
- Comment tiếng Việt, giải thích **vì sao** chứ không phải **cái gì** (`C9`).
- **Dev server đang chạy** → dùng `pnpm build:safe`, KHÔNG `pnpm build` (`C12`).

### Giá trị token — copy nguyên văn, không tự chế

```
--cms-rail-w      64px      --cms-text-metric   36px / 400
--cms-header-h    48px      --cms-text-title    24px / 400
--cms-tabbar-h    40px      --cms-text-label    12px / 600
--cms-row-h       48px      --cms-text-body     13px / 400
--cms-gap         16px      --cms-text-meta     11px / 400
--cms-pad         24px

--cms-bg          #FFFFFF   --cms-text          #111827
--cms-bg-subtle   #F8FAFC   --cms-text-muted    #6B7280
--cms-border      #E5E7EB   --cms-accent        #2563EB
                            --cms-accent-weak   #EFF6FF
```

6 tone: `emerald · blue · violet · amber · rose · slate`, mỗi tone 3 biến
`--cms-tone-{x}` / `--cms-tone-{x}-bg` / `--cms-tone-{x}-dot`.

---

## File Structure

| File | Trách nhiệm |
|---|---|
| `packages/cms-ui/package.json` | Khai `exports`: `.` (component) + `./tokens.css` |
| `packages/cms-ui/tsconfig.json` | Kế thừa `@repo/tsconfig/react.json` |
| `packages/cms-ui/src/tokens.css` | **Nguồn sự thật duy nhất** của mọi giá trị |
| `packages/cms-ui/src/DotBadge.tsx` | Chấm + chữ + width cố định. Thay 6 bảng `toneMap` đang lặp |
| `packages/cms-ui/src/KpiCard.tsx` | Một ô KPI; biến thể clickable |
| `packages/cms-ui/src/MetricStrip.tsx` | Dải KPI liền, vách ngăn dọc 1px |
| `packages/cms-ui/src/PageHeaderBar.tsx` | kicker + title + CountPill + actions |
| `packages/cms-ui/src/FilterBar.tsx` | Pill filter inline, không khung bao |
| `packages/cms-ui/src/DataGrid.tsx` | Bọc `DataTable`, ghi đè 3 chỗ class cứng |
| `packages/cms-ui/src/InlineAlert.tsx` | `role="alert"` + `aria-live="polite"` |
| `packages/cms-ui/src/index.ts` | Barrel export |
| `apps/.../next.config.ts` | +1 dòng `transpilePackages` |
| `apps/.../globals.css` | +1 dòng `@source` |
| `apps/.../src/app/layout.tsx` | +1 dòng import `tokens.css` |
| `apps/.../src/app/admin/layout.tsx` | Gắn `data-cms`, dùng `AppShell` token |
| `apps/.../src/app/admin/page.tsx` | Viết lại dashboard |
| `apps/.../src/app/admin/orders/page.tsx` | Áp `DataGrid` + `DotBadge` |

---

## Task 1: Scaffold package + token

**Files:**
- Create: `packages/cms-ui/package.json`
- Create: `packages/cms-ui/tsconfig.json`
- Create: `packages/cms-ui/src/tokens.css`
- Create: `packages/cms-ui/src/index.ts`
- Modify: `apps/2026-thenamduhill/package.json` (thêm dependency)
- Modify: `apps/2026-thenamduhill/next.config.ts` (`transpilePackages`)
- Modify: `apps/2026-thenamduhill/src/app/globals.css` (`@source`)
- Modify: `apps/2026-thenamduhill/src/app/layout.tsx` (import css)

**Interfaces:**
- Produces: `@repo/cms-ui/tokens.css` — mọi biến `--cms-*` trong `[data-cms]`;
  đồng thời ánh xạ sang biến mà `@repo/ui` đang đọc (`--border`, `--text-muted`,
  `--surface-alt`, `--surface`, `--text`, `--space-*`, `--text-xs`, `--radius*`).

> ⚠️ **Task này chứa bước dễ quên nhất của cả plan.** Quên `@source` thì
> Tailwind bỏ qua `node_modules` (mọi `@repo/*` là symlink trong đó) → trang
> **mất sạch style mà build vẫn xanh** (`R14`, CLAUDE.md §4).

- [ ] **Bước 1: Tạo `package.json`**

Theo đúng mẫu `@repo/styling-css` (export file `.css` trực tiếp) kết hợp
`@repo/ui` (export component).

```json
{
  "name": "@repo/cms-ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./tokens.css": "./src/tokens.css"
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/ui": "workspace:*"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*",
    "@types/react": "^19",
    "react": "^19.1.1",
    "typescript": "^5"
  },
  "peerDependencies": {
    "react": "^19"
  }
}
```

- [ ] **Bước 2: Tạo `tsconfig.json`**

```json
{
  "extends": "@repo/tsconfig/react.json",
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

- [ ] **Bước 3: Tạo `src/tokens.css`**

Hai khối. Khối 1 khai biến `--cms-*`. Khối 2 **ánh xạ** sang biến `@repo/ui`
đang đọc — đây là cơ chế khiến 8 màn kia đổi diện mạo miễn phí.

```css
/**
 * CMS DESIGN SYSTEM — token dùng chung cho mọi sản phẩm trong monorepo.
 *
 * VÌ SAO PHẠM VI `[data-cms]` CHỨ KHÔNG PHẢI `:root`: CMS và trang client
 * chạy trong CÙNG một Next app. Ghi đè ở `:root` sẽ rò sang `/h1`–`/h4` và
 * phá token của cả 4 theme. `[data-cms]` chỉ có hiệu lực bên trong shell CMS.
 *
 * VÌ SAO CÓ KHỐI ÁNH XẠ Ở CUỐI: `DataTable`, `Button`, `Field` của `@repo/ui`
 * đọc token qua `var(--border)`, `var(--text-muted)`, `var(--surface-alt)`…
 * Ánh xạ `--cms-*` sang đúng những tên đó thì chúng tự đổi diện mạo mà không
 * phải sửa một dòng nào trong package dùng chung (luật R5).
 */

[data-cms] {
    /* --- nền & đường kẻ ------------------------------------------------
     * Nền TRẮNG, phân tách bằng đường kẻ 1px thay cho shadow. Đây là nguồn
     * gốc trực tiếp của cảm giác "clean" — shadow chỉ dành cho lớp nổi thật
     * (dropdown, modal), không dùng cho card tĩnh (P7). */
    --cms-bg: #ffffff;
    --cms-bg-subtle: #f8fafc;
    --cms-border: #e5e7eb;

    --cms-text: #111827;
    --cms-text-muted: #6b7280;

    --cms-accent: #2563eb;
    --cms-accent-weak: #eff6ff;

    /* --- tone trạng thái ------------------------------------------------
     * Sáu tone vì `F6` bắt badge phân biệt được ≥6 trạng thái đơn
     * (pending_payment / confirmed / checked_in / checked_out / cancelled /
     * no_show). Vượt trần 12 token màu của P2 — ngoại lệ đã giải trình
     * trong spec §3, không phải bỏ sót. */
    --cms-tone-emerald: #047857;
    --cms-tone-emerald-bg: #ecfdf5;
    --cms-tone-emerald-dot: #10b981;

    --cms-tone-blue: #1d4ed8;
    --cms-tone-blue-bg: #eff6ff;
    --cms-tone-blue-dot: #3b82f6;

    --cms-tone-violet: #6d28d9;
    --cms-tone-violet-bg: #f5f3ff;
    --cms-tone-violet-dot: #8b5cf6;

    --cms-tone-amber: #b45309;
    --cms-tone-amber-bg: #fffbeb;
    --cms-tone-amber-dot: #f59e0b;

    --cms-tone-rose: #be123c;
    --cms-tone-rose-bg: #fff1f2;
    --cms-tone-rose-dot: #f43f5e;

    --cms-tone-slate: #334155;
    --cms-tone-slate-bg: #f8fafc;
    --cms-tone-slate-dot: #94a3b8;

    /* --- kích thước (hệ 8pt, trích từ ảnh mẫu quy về 1440px) ----------- */
    --cms-rail-w: 64px;
    --cms-header-h: 48px;
    --cms-tabbar-h: 40px;
    --cms-row-h: 48px;
    --cms-gap: 16px;
    --cms-pad: 24px;

    /* --- chữ -----------------------------------------------------------
     * Số KPI weight 400, KHÔNG đậm. Đây là chi tiết làm nên vẻ clean của
     * ảnh mẫu — số lớn mà nhẹ, để hierarchy do CỠ gánh chứ không do độ đậm. */
    --cms-text-metric: 36px;
    --cms-text-title: 24px;
    --cms-text-label: 12px;
    --cms-text-body: 13px;
    --cms-text-meta: 11px;

    --cms-radius: 6px;
    --cms-radius-sm: 4px;

    /* Shadow chỉ 2 bậc, chỉ cho lớp nổi thật. */
    --cms-shadow-pop: 0 4px 12px rgb(17 24 39 / 0.08);
    --cms-shadow-modal: 0 16px 40px rgb(17 24 39 / 0.16);

    /* --------------------------------------------------------------------
     * ÁNH XẠ SANG TOKEN CỦA `@repo/ui`.
     * Nhờ khối này, `DataTable`/`Button`/`Field` đổi diện mạo theo CMS mà
     * không phải sửa `packages/ui`. Đổi giá trị ở trên là đổi cả hai nơi.
     * ------------------------------------------------------------------ */
    --surface: var(--cms-bg);
    --surface-alt: var(--cms-bg-subtle);
    --border: var(--cms-border);
    --border-strong: var(--cms-border);
    --text: var(--cms-text);
    --text-muted: var(--cms-text-muted);
    --brand: var(--cms-accent);
    --focus-ring: var(--cms-accent);
    --radius-sm: var(--cms-radius-sm);
    --radius: var(--cms-radius);
    --text-xs: var(--cms-text-meta);
    --text-sm: var(--cms-text-body);
}
```

- [ ] **Bước 4: Tạo `src/index.ts` tạm (chỉ comment)**

Package chưa có component; file này để `exports.` không trỏ vào khoảng không.

```ts
/**
 * `@repo/cms-ui` — DESIGN SYSTEM CỦA CMS, dùng chung cho mọi sản phẩm.
 *
 * Khác `@repo/ui` ở chỗ: `ui` là primitive vô danh không mang bản sắc, còn
 * package này CÓ bản sắc — bản sắc của công cụ quản trị nội bộ, cố ý giữ
 * nguyên qua mọi khách hàng (app-flows.md §F5: "một layout admin duy nhất").
 *
 * Vẫn thuộc TẦNG NỀN nên phép thử R15 vẫn áp: không file nào ở đây được
 * nhắc "phòng", "đơn hàng", "tồn kho". Chỉ có `label`, `value`, `tone`.
 */

export {}
```

- [ ] **Bước 5: Khai dependency ở app**

Trong `apps/2026-thenamduhill/package.json`, thêm vào `dependencies`
(giữ nguyên thứ tự alphabet của các dòng `@repo/*` xung quanh):

```json
"@repo/cms-ui": "workspace:*",
```

- [ ] **Bước 6: Khai `transpilePackages`**

Trong `apps/2026-thenamduhill/next.config.ts`, thêm `'@repo/cms-ui',` vào mảng
`transpilePackages` — đặt ngay sau `'@repo/ui'`.

- [ ] **Bước 7: Khai `@source` cho Tailwind — BƯỚC DỄ QUÊN NHẤT**

Trong `apps/2026-thenamduhill/src/app/globals.css`, thêm ngay sau dòng
`@source '../../../../packages/ui/src';`:

```css
@source '../../../../packages/cms-ui/src';
```

Quên dòng này → class Tailwind viết trong `cms-ui` KHÔNG được sinh ra → trang
mất sạch style **mà build vẫn xanh**.

- [ ] **Bước 8: Import `tokens.css`**

Trong `apps/2026-thenamduhill/src/app/layout.tsx`, thêm sau dòng
`import '@repo/theme-h4/tokens.css'`:

```ts
import '@repo/cms-ui/tokens.css'
```

- [ ] **Bước 9: Cài đặt và verify**

```bash
cd d:/2026/2025-phuquoc
pnpm install
pnpm typecheck
```

Expected: `pnpm install` nhận ra `@repo/cms-ui`; `typecheck` sạch.

- [ ] **Bước 10: Verify token thật sự tới được trình duyệt**

Dev server đang chạy ở cổng 3000. Mở `http://localhost:3000/admin`, DevTools
→ Console:

```js
getComputedStyle(document.querySelector('[data-cms]') || document.body)
  .getPropertyValue('--cms-accent')
```

Expected: `#2563eb`. Lúc này `[data-cms]` chưa gắn (Task 3) nên có thể trả
rỗng — đó là bình thường. Điều cần xác nhận là **file CSS đã nạp**: tìm
`--cms-accent` trong tab Sources. Không thấy → sai bước 8.

- [ ] **Bước 11: Commit**

```bash
git add packages/cms-ui apps/2026-thenamduhill/package.json \
        apps/2026-thenamduhill/next.config.ts \
        apps/2026-thenamduhill/src/app/globals.css \
        apps/2026-thenamduhill/src/app/layout.tsx pnpm-lock.yaml
git commit -m "feat(cms-ui): scaffold package + token hệ 8pt

Token ghi đè trong [data-cms] để không rò sang trang client. Khối ánh xạ
cuối file khiến DataTable/Button của @repo/ui đổi diện mạo mà không phải
sửa package dùng chung."
```

---

## Task 2: `DotBadge` — component thu hồi nhiều code lặp nhất

**Files:**
- Create: `packages/cms-ui/src/DotBadge.tsx`
- Modify: `packages/cms-ui/src/index.ts`

**Interfaces:**
- Consumes: token `--cms-tone-*` từ Task 1.
- Produces:
  ```ts
  export type CmsTone = 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'slate'
  export interface DotBadgeProps {
      tone: CmsTone
      label: string
      width?: number      // px; không truyền = tự co theo nội dung
      title?: string
  }
  export function DotBadge(props: DotBadgeProps): JSX.Element
  ```

Khảo sát: pattern này lặp ở **6 màn / ~10 chỗ**, mỗi màn tự khai `toneMap` +
`dotMap` với bảng màu giống hệt nhau. Đây là ứng viên trích số 1.

- [ ] **Bước 1: Viết component**

```tsx
'use client'

/**
 * Badge trạng thái: chấm màu + CHỮ.
 *
 * VÌ SAO LUÔN CÓ CHỮ: `D4` cấm truyền tin chỉ bằng màu — người mù màu phải
 * đọc được trạng thái. Chấm là phụ trợ nhìn nhanh, chữ mới là nội dung.
 *
 * VÌ SAO CÓ `width` CỐ ĐỊNH: trong bảng, badge so le bề rộng làm cột nhảy
 * và mắt khó quét dọc. Truyền `width` để các badge cùng cột thẳng hàng.
 */

export type CmsTone = 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'slate'

export interface DotBadgeProps {
    tone: CmsTone
    label: string
    /** Bề rộng cố định tính bằng px. Bỏ trống thì badge co theo nội dung. */
    width?: number
    title?: string
}

export function DotBadge({ tone, label, width, title }: DotBadgeProps) {
    return (
        <span
            title={title}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 8px',
                width: width ? `${width}px` : undefined,
                borderRadius: 'var(--cms-radius-sm)',
                fontSize: 'var(--cms-text-meta)',
                fontWeight: 600,
                lineHeight: 1.4,
                color: `var(--cms-tone-${tone})`,
                background: `var(--cms-tone-${tone}-bg)`,
                border: `1px solid var(--cms-tone-${tone}-dot)`,
                borderColor: `color-mix(in srgb, var(--cms-tone-${tone}-dot) 35%, transparent)`,
                whiteSpace: 'nowrap',
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: `var(--cms-tone-${tone}-dot)`,
                }}
            />
            <span
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {label}
            </span>
        </span>
    )
}
```

- [ ] **Bước 2: Export**

Trong `packages/cms-ui/src/index.ts`, thay `export {}` bằng:

```ts
export { DotBadge } from './DotBadge'
export type { DotBadgeProps, CmsTone } from './DotBadge'
```

- [ ] **Bước 3: Verify typecheck**

```bash
cd d:/2026/2025-phuquoc && pnpm typecheck
```

Expected: sạch.

- [ ] **Bước 4: Verify luật tầng nền**

```bash
cd d:/2026/2025-phuquoc
grep -rn "#[0-9a-fA-F]\{3,8\}" packages/cms-ui/src --include="*.tsx"
grep -rniE "booking|room|guest|hotel|phòng|đơn hàng" packages/cms-ui/src
grep -rn "@repo/core\|@repo/domain\|@repo/theme" packages/cms-ui/src
```

Expected: **cả ba rỗng**.

- [ ] **Bước 5: Commit**

```bash
git add packages/cms-ui/src
git commit -m "feat(cms-ui): DotBadge — chấm màu + chữ, width cố định

Thu hồi pattern đang lặp ở 6 màn admin, mỗi màn tự khai toneMap/dotMap
với bảng màu giống hệt nhau."
```

---

## Task 3: `AppShell` — rail + header + tab bar

**Files:**
- Create: `packages/cms-ui/src/AppShell.tsx`
- Modify: `packages/cms-ui/src/index.ts`
- Modify: `apps/2026-thenamduhill/src/app/admin/layout.tsx`

**Interfaces:**
- Consumes: token Task 1.
- Produces:
  ```ts
  export interface ShellNavItem { href: string; label: string; icon?: React.ReactNode }
  export interface AppShellProps {
      railItems: ShellNavItem[]      // rail dọc trái, 64px
      tabItems: ShellNavItem[]       // tab bar ngang, 40px
      currentPath: string
      brand: React.ReactNode         // logo + tên, cao 48px
      headerRight?: React.ReactNode  // role switcher, ngôn ngữ, avatar
      children: React.ReactNode
  }
  export function AppShell(props: AppShellProps): JSX.Element
  ```

Component gắn `data-cms` lên phần tử gốc — đây là chỗ kích hoạt toàn bộ token.

- [ ] **Bước 1: Viết `AppShell.tsx`**

Yêu cầu bắt buộc, kiểm được từng cái:
- Phần tử gốc có `data-cms` (nếu thiếu, mọi token vô hiệu)
- Rail rộng đúng `var(--cms-rail-w)`, header cao `var(--cms-header-h)`,
  tab bar cao `var(--cms-tabbar-h)`
- Tab active: chữ `--cms-accent`, nền `--cms-accent-weak`, gạch chân 2px
- Phân tách bằng `border-bottom: 1px solid var(--cms-border)` — **không shadow**
- Mỗi mục điều hướng có `aria-current="page"` khi active
- Link có `title` khi rail thu gọn (chỉ còn icon)
- Không `outline: none`; focus dùng `:focus-visible` kế thừa từ contract

- [ ] **Bước 2: Export**

```ts
export { AppShell } from './AppShell'
export type { AppShellProps, ShellNavItem } from './AppShell'
```

- [ ] **Bước 3: Thay shell trong `admin/layout.tsx`**

Giữ nguyên toàn bộ logic đã có, chỉ đổi phần trình bày:
- Giữ: `LocaleProvider`, guard `isStaffRole` + redirect, lọc `visibleSections`
  theo `can(user.role, permission)`, dropdown user, `useRailCollapse`
- Bỏ: 3 hex cứng `bg-[#0F172A]`, `bg-[#090D1A]`, `bg-[#1E293B]` (khảo sát
  chỉ ra đây là hex cứng duy nhất còn lại trong khu admin)
- Bỏ: role switcher giả `Lễ tân | Manager | Chủ cơ sở` đang hardcode ở
  `layout.tsx:341-345` — nó hiển thị "Manager" bất kể `user.role` thật.
  Thay bằng vai trò thật từ `user.role` qua `ROLE_LABEL`.

- [ ] **Bước 4: Verify token đã kích hoạt**

Mở `http://localhost:3000/admin`, DevTools Console:

```js
getComputedStyle(document.querySelector('[data-cms]')).getPropertyValue('--cms-accent')
```

Expected: `#2563eb` (không còn rỗng như Task 1).

Kiểm thêm — `@repo/ui` đã nhận ánh xạ:

```js
getComputedStyle(document.querySelector('[data-cms]')).getPropertyValue('--border')
```

Expected: `#e5e7eb`. Nếu ra `#e2e8f0` (giá trị của contract) thì khối ánh xạ
ở `tokens.css` chưa ăn — kiểm lại thứ tự import ở `layout.tsx`.

- [ ] **Bước 5: Verify trang client KHÔNG bị ảnh hưởng**

Mở `http://localhost:3000/h1`, DevTools Console:

```js
getComputedStyle(document.body).getPropertyValue('--border')
```

Expected: `#e2e8f0` — giá trị gốc của contract, **không phải** `#e5e7eb`.
Nếu ra `#e5e7eb` thì token đã rò sang client → `tokens.css` đang ghi vào
`:root` thay vì `[data-cms]`. Đây là rủi ro #2 trong spec §8.

- [ ] **Bước 6: Verify 8 màn còn lại không vỡ**

Mở lần lượt, xác nhận trang render được và không mất layout:

```
/admin/orders          /admin/inventory      /admin/housekeeping
/admin/customers       /admin/promotions     /admin/settings
/admin/settings/rooms  /admin/settings/accounts
```

- [ ] **Bước 7: Commit**

```bash
git add packages/cms-ui/src apps/2026-thenamduhill/src/app/admin/layout.tsx
git commit -m "feat(cms-ui): AppShell + gắn data-cms vào admin layout

Bỏ 3 hex cứng trong sidebar và role switcher giả luôn hiện 'Manager'
bất kể vai trò thật."
```

---

## Task 4: `KpiCard` + `MetricStrip`

**Files:**
- Create: `packages/cms-ui/src/KpiCard.tsx`
- Create: `packages/cms-ui/src/MetricStrip.tsx`
- Modify: `packages/cms-ui/src/index.ts`

**Interfaces:**
- Consumes: `CmsTone` từ Task 2.
- Produces:
  ```ts
  export interface KpiCardProps {
      label: string
      value: string
      note?: string
      tone?: CmsTone
      selected?: boolean
      onClick?: () => void     // có onClick → render <button>, không → <div>
  }
  export function KpiCard(props: KpiCardProps): JSX.Element

  export interface MetricStripProps { children: React.ReactNode }
  export function MetricStrip(props: MetricStripProps): JSX.Element
  ```

Khảo sát: KPI card lặp ở 6 màn và **đã bị tách thủ công 2 lần độc lập**
(`KpiCard` ở `settings/rooms/page.tsx:646`, `TicketKpi` ở
`settings/tickets/page.tsx:555`) — dấu hiệu rõ nhất của component đang đòi
được sinh ra.

- [ ] **Bước 1: Viết `KpiCard.tsx`**

Bắt buộc:
- `value` dùng `font-size: var(--cms-text-metric)` và **`font-weight: 400`**
  — không đậm. Đây là chi tiết làm nên vẻ clean của ảnh mẫu.
- `label` uppercase, `var(--cms-text-label)`, `letter-spacing: .06em`,
  màu `--cms-text-muted`
- Số canh trái, `font-variant-numeric: tabular-nums`
- Có `onClick` → render `<button type="button">` (bàn phím dùng được),
  không có → `<div>`. **Không** dùng `<div onClick>`.
- `selected` → viền dưới 2px `--cms-accent`

- [ ] **Bước 2: Viết `MetricStrip.tsx`**

Khác biệt cốt lõi so với code hiện tại: **một dải liền chia bằng vách ngăn
dọc**, không phải 5 card rời có gap.

```tsx
'use client'

/**
 * Dải KPI liền mạch.
 *
 * VÌ SAO KHÔNG PHẢI 5 CARD RỜI: card rời + gap + shadow tạo ra 5 khối nổi
 * tranh nhau gây chú ý (P11 "Calm"). Một dải liền chia bằng vách 1px đọc
 * như MỘT thông tin có 5 mặt — đúng cách ảnh mẫu làm.
 */

export interface MetricStripProps {
    children: React.ReactNode
}

export function MetricStrip({ children }: MetricStripProps) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                background: 'var(--cms-bg)',
                border: '1px solid var(--cms-border)',
                borderRadius: 'var(--cms-radius)',
                overflow: 'hidden',
            }}
        >
            {children}
        </div>
    )
}
```

Vách ngăn dọc đặt ở `KpiCard` bằng `border-left`, và ô đầu tiên bỏ viền qua
`:first-child` — viết trong `tokens.css` dưới selector
`[data-cms] .cms-kpi + .cms-kpi { border-left: 1px solid var(--cms-border) }`.

- [ ] **Bước 3: Export + typecheck**

```bash
cd d:/2026/2025-phuquoc && pnpm typecheck
```

- [ ] **Bước 4: Commit**

```bash
git add packages/cms-ui/src
git commit -m "feat(cms-ui): KpiCard + MetricStrip dải liền

Thu hồi pattern đã bị tách thủ công 2 lần độc lập ở settings/rooms và
settings/tickets."
```

---

## Task 5: `PageHeaderBar` · `FilterBar` · `InlineAlert` · `DataGrid`

**Files:**
- Create: `packages/cms-ui/src/PageHeaderBar.tsx`
- Create: `packages/cms-ui/src/FilterBar.tsx`
- Create: `packages/cms-ui/src/InlineAlert.tsx`
- Create: `packages/cms-ui/src/DataGrid.tsx`
- Modify: `packages/cms-ui/src/index.ts`

**Interfaces:**
- Consumes: `CmsTone` (Task 2).
- Produces:
  ```ts
  export interface PageHeaderBarProps {
      kicker?: string
      title: string
      count?: { value: number; suffix: string }
      actions?: React.ReactNode
  }
  export function PageHeaderBar(props: PageHeaderBarProps): JSX.Element

  export interface FilterGroup {
      legend: string
      options: { value: string; label: string }[]
      value: string
      onChange: (v: string) => void
  }
  export interface FilterBarProps {
      groups: FilterGroup[]
      resultText?: string
      onReset?: () => void
  }
  export function FilterBar(props: FilterBarProps): JSX.Element

  export interface InlineAlertProps { tone: CmsTone; children: React.ReactNode }
  export function InlineAlert(props: InlineAlertProps): JSX.Element

  export interface DataGridProps<T> extends DataTableProps<T> { }
  export function DataGrid<T>(props: DataGridProps<T>): JSX.Element
  ```

- [ ] **Bước 1: `PageHeaderBar.tsx`**

Bắt buộc: `<h1>` dùng `var(--cms-text-title)` weight 400; kicker uppercase
`var(--cms-text-label)` màu `--cms-text-muted`; **không khung bao, không
shadow** — chỉ `border-bottom: 1px solid var(--cms-border)`.

- [ ] **Bước 2: `FilterBar.tsx`**

Bắt buộc:
- Pill nằm thẳng trên nền trang, **không** bọc trong card (khác code hiện tại)
- Mỗi nhóm là `<fieldset>` + `<legend>` cho screen reader
- Pill active: nền `--cms-accent`, chữ trắng — tương phản ≥4.5:1
- Pill là `<button type="button">`, cao ≥24px (`D4` 2.5.8)
- Có `onReset` → hiện nút "Đặt lại" (`F6` bắt buộc)

- [ ] **Bước 3: `InlineAlert.tsx`**

Bắt buộc `role="alert"` + `aria-live="polite"` mặc định (`FE11`).

- [ ] **Bước 4: `DataGrid.tsx`**

Bọc `DataTable` của `@repo/ui`, **không fork** — chỉ ghi đè đúng 3 chỗ
`@repo/ui` hard-code class (đã xác định khi đọc `DataTable.tsx`):

| Chỗ | `@repo/ui` hiện tại | `DataGrid` ghi đè |
|---|---|---|
| Wrapper | `bg-white border-slate-200 rounded-lg shadow-sm` | truyền `containerClass` để bỏ shadow |
| Row hover | `hover:bg-slate-50/70` | CSS `[data-cms] .dt-row:hover` |
| Padding hàng | `8px 12px` | CSS `[data-cms] .dt-table td { height: var(--cms-row-h) }` |

Hai chỗ sau ghi trong `tokens.css` — vì `DataTable` không nhận prop cho chúng.

> Ghi rõ trong comment: **không fork `DataTable`**. Fork thì hai bản lệch nhau
> theo thời gian (rủi ro #4 trong spec §8).

- [ ] **Bước 5: Export + typecheck + tự kiểm**

```bash
cd d:/2026/2025-phuquoc && pnpm typecheck
grep -rn "outline:\s*none\|outline-none" packages/cms-ui/src
grep -rn "#[0-9a-fA-F]\{3,8\}" packages/cms-ui/src --include="*.tsx"
```

Expected: typecheck sạch, hai `grep` rỗng.

- [ ] **Bước 6: Commit**

```bash
git add packages/cms-ui/src
git commit -m "feat(cms-ui): PageHeaderBar, FilterBar, InlineAlert, DataGrid

DataGrid BỌC DataTable của @repo/ui, không fork — chỉ ghi đè 3 chỗ
package dùng chung hard-code class."
```

---

## Task 6: Dashboard `/admin`

**Files:**
- Modify: `apps/2026-thenamduhill/src/app/admin/page.tsx` (viết lại, 575 dòng)

**Interfaces:**
- Consumes: `AppShell` (Task 3), `KpiCard`/`MetricStrip` (Task 4),
  `PageHeaderBar`/`FilterBar`/`DataGrid` (Task 5), `DotBadge` (Task 2).

Thứ tự dọc: `PageHeaderBar` → `FilterBar` → `MetricStrip` →
lưới 2 cột (`DataGrid` 2/3 · dòng sự kiện 1/3).

- [ ] **Bước 1: Bỏ 4 chỗ bịa số**

Đây là phần bắt buộc, không phải tuỳ chọn — admin ra quyết định trên số này.

| Dòng hiện tại | Vấn đề | Xử lý |
|---|---|---|
| `page.tsx:71-96` `ACTIVITY_FEEDS` | 4 sự kiện hardcode | Đọc `ActivityLog` thật từ `booking.store`. Chưa có → trạng thái rỗng theo `FE7`: *"Chưa có hoạt động nào hôm nay."* |
| `page.tsx:427` `▲ 12% vs tuần trước` | Bịa | Bỏ hẳn (chưa có dữ liệu tuần trước) |
| `page.tsx:476` `10/15 phòng` | Bịa | Đọc từ housekeeping store; chưa nối được thì bỏ ô KPI này |
| `page.tsx:112-113` `units[idx % units.length]` | **Gán số phòng cho khách bằng phép chia lấy dư** | Bỏ cột. Vi phạm `B0`: `RoomUnit` do lễ tân gán lúc check-in |

- [ ] **Bước 2: Việt hoá chuỗi trộn tiếng Anh**

| Hiện tại | Thay bằng |
|---|---|
| `OPERATIONS CONSOLE — TODAY OVERVIEW` | `VẬN HÀNH — HÔM NAY` |
| `Occupancy overview` | `Tổng quan vận hành` |
| `WHAT MOVED FOR ME` | `VỪA DIỄN RA` |
| `Rhythm today` | `Nhịp hôm nay` |
| `OCCUPANCY RATE` | `CÔNG SUẤT PHÒNG` |

Mọi chuỗi qua `tr()` với `{vi, en}` (`C7`).

- [ ] **Bước 3: Dựng layout**

Bỏ `bg-slate-100`, bỏ card lồng card. Nền trắng, phân tách bằng đường kẻ.

- [ ] **Bước 4: Verify bằng mắt ở 1440px**

Mở `http://localhost:3000/admin`. Đối chiếu:
- Nền trang trắng, không xám
- MetricStrip là dải liền, có vách ngăn dọc — không phải 5 card rời
- Số KPI to và **nhẹ** (weight 400)
- FilterBar không có khung bao
- Không còn chữ tiếng Anh nào trên màn hình

- [ ] **Bước 5: Verify 375px**

DevTools → 375px. Bảng phải đổi sang **thẻ**, không cuộn ngang (`F6`/`FE5`).

- [ ] **Bước 6: Verify bàn phím**

Tab từ đầu trang đến cuối: mọi phần tử tương tác phải có viền focus **nhìn
thấy được**, thứ tự focus khớp thứ tự đọc, không bẫy focus.

- [ ] **Bước 7: Commit**

```bash
git add apps/2026-thenamduhill/src/app/admin/page.tsx
git commit -m "feat(admin): dashboard theo cms-ui

Bỏ 4 chỗ bịa số, đáng kể nhất là unitNumber gán bằng idx % len — vi phạm
B0 (RoomUnit do lễ tân gán lúc check-in). Việt hoá chuỗi trộn tiếng Anh."
```

---

## Task 7: Danh sách đơn `/admin/orders`

**Files:**
- Modify: `apps/2026-thenamduhill/src/app/admin/orders/page.tsx` (607 dòng)

**Interfaces:** Consumes toàn bộ component Task 2–5.

- [ ] **Bước 1: Thay badge viết tay bằng `DotBadge`**

File này có 2 chỗ: channel (`w-[144px]`) và status (`w-[108px]`).
Xoá `toneMap`/`dotMap` khai tại chỗ.

- [ ] **Bước 2: Thay pagination viết tay bằng prop của bảng**

Xoá khối `p-2.5 bg-slate-50 border-t…` và logic `totalPages`/`safePage`/
`pageRows` — dùng `pagination` prop có sẵn.

- [ ] **Bước 3: Bỏ import thừa**

Khảo sát: file import `Badge, Button, FilterSelect, Toolbar` từ `@repo/ui`
nhưng **không dùng cái nào** — tự viết tay lại toàn bộ.

- [ ] **Bước 4: Áp thứ tự cột theo `F6`**

**định danh → chủ thể → nội dung → thời gian → tiền → trạng thái → thao tác**

| Cột | Nội dung |
|---|---|
| ☐ | checkbox chọn nhiều |
| MÃ ĐƠN | mã đậm + ngày tạo nhạt |
| KHÁCH HÀNG | tên đậm + SĐT nhạt |
| HẠNG PHÒNG | tên hạng + số đêm |
| NHẬN – TRẢ | `20/8 – 22/8` |
| TỔNG TIỀN | canh phải, `tabular-nums`, dòng phụ "còn thiếu" |
| TRẠNG THÁI | `DotBadge` |
| THAO TÁC | icon SVG + `aria-label` đầy đủ ("Xem đơn ĐH-26-0042") |

- [ ] **Bước 5: Trạng thái rỗng nói rõ việc tiếp theo**

Theo `FE7`: *"Chưa có đơn nào khớp bộ lọc. Đặt lại bộ lọc để xem tất cả."* —
không phải "Không có dữ liệu".

- [ ] **Bước 6: Verify 1440px + 375px + bàn phím**

Như Task 6 bước 4–6.

- [ ] **Bước 7: Commit**

```bash
git add apps/2026-thenamduhill/src/app/admin/orders/page.tsx
git commit -m "feat(admin): danh sách đơn theo cms-ui + F6

Xoá badge/pagination viết tay và 4 import không dùng."
```

---

## Task 8: Lan accent amber → xanh ở 8 màn còn lại

**Files:** Modify — `customers`, `housekeeping`, `inventory`, `promotions`,
`settings/page.tsx`, `settings/rooms`, `settings/rate-plans`, `settings/addons`,
`settings/tickets`, `settings/accounts`, `settings/general`

Chỉ chạy **sau khi chủ dự án đã duyệt hình khối** ở Task 6–7.

- [ ] **Bước 1: Liệt kê chỗ cần đổi**

```bash
cd d:/2026/2025-phuquoc/apps/2026-thenamduhill/src/app/admin
grep -rn "amber-500\|amber-600\|amber-400\|amber-700\|amber-800\|amber-100\|amber-200\|amber-900" . | wc -l
grep -rln "amber" .
```

- [ ] **Bước 2: Đổi CTA**

`bg-amber-500 hover:bg-amber-400 text-slate-950` → nút xanh dùng
`var(--cms-accent)`. Riêng `settings/accounts` đang dùng
`bg-gradient-to-r from-amber-600 to-amber-500` — gradient lệch chuẩn, đổi
sang màu phẳng (`D5` cấm gradient nhiều màu cho CTA).

- [ ] **Bước 3: Chuẩn hoá focus style**

Khảo sát chỉ ra 2 kiểu đang lẫn lộn:
- `focus:outline-none focus:ring-2 focus:ring-amber-500/20` — **5 màn**
- `focus-visible:outline outline-2 outline-offset-1 outline-amber-600` — 2 màn

Kiểu thứ hai đúng a11y hơn. Chuẩn hoá về `:focus-visible` với
`var(--cms-accent)`. **Không bao giờ để `outline: none` trần** (`FE1`).

- [ ] **Bước 4: Đổi badge tone amber → `DotBadge`**

Nơi nào badge amber mang nghĩa "chờ/cảnh báo" thì giữ tone `amber` của
`DotBadge` — tone amber vẫn tồn tại trong hệ, chỉ accent CTA là đổi.

- [ ] **Bước 5: Mở đủ 11 màn xác nhận không vỡ**

```
/admin  /admin/orders  /admin/inventory  /admin/housekeeping
/admin/customers  /admin/promotions  /admin/settings
/admin/settings/rooms  /admin/settings/rate-plans  /admin/settings/addons
/admin/settings/tickets  /admin/settings/accounts  /admin/settings/general
```

- [ ] **Bước 6: Commit**

```bash
git add apps/2026-thenamduhill/src/app/admin
git commit -m "refactor(admin): accent amber → xanh, chuẩn hoá focus-visible

Bỏ gradient CTA ở settings/accounts (D5). Hợp nhất 2 kiểu focus đang lẫn
lộn về :focus-visible."
```

---

## Task 9: Nghiệm thu

**Files:** không sửa code, chỉ verify.

- [ ] **Bước 1: Lint + typecheck**

```bash
cd d:/2026/2025-phuquoc && pnpm check
```

Expected: sạch cả hai.

- [ ] **Bước 2: Build — dùng `build:safe` vì dev server đang chạy**

```bash
cd d:/2026/2025-phuquoc && pnpm build:safe
```

Expected: xanh **cả 4 theme**, không riêng phần vừa sửa (`C13`).
⚠️ **Không** chạy `pnpm build` — sẽ giết dev server và kẹt cổng 3000.

- [ ] **Bước 3: Tự kiểm bằng grep**

```bash
cd d:/2026/2025-phuquoc
grep -rn "#[0-9a-fA-F]\{3,8\}" packages/cms-ui/src --include="*.tsx"
grep -rn "@repo/core\|@repo/domain\|@repo/theme" packages/cms-ui/src
grep -rniE "booking|room|guest|hotel|phòng|đơn hàng" packages/cms-ui/src
grep -rn "outline:\s*none\|outline-none" packages/cms-ui/src
grep -rn ": any\|as any" packages/cms-ui/src apps/2026-thenamduhill/src/app/admin
```

Expected: **cả năm rỗng**.

- [ ] **Bước 4: Verify trang client không bị rò token**

Mở `/h1`, `/h2`, `/h3`, `/h4` — 4 theme phải giữ nguyên diện mạo cũ.
DevTools trên `/h1`:

```js
getComputedStyle(document.body).getPropertyValue('--border')
```

Expected: `#e2e8f0`, **không phải** `#e5e7eb`.

- [ ] **Bước 5: Checklist DoD (spec §7)**

Đánh dấu từng mục trong spec §7. Mục nào không đạt thì ghi rõ lý do,
**không tự nới tiêu chí** (`W6.3`).

- [ ] **Bước 6: Commit cuối nếu có sửa vặt**

---

## Self-Review

**Spec coverage:**

| Spec | Task |
|---|---|
| §2 kiến trúc package | Task 1 |
| §2 cơ chế `[data-cms]` | Task 1 bước 3, verify Task 3 bước 4–5 |
| §2 ba chỗ `DataGrid` ghi đè | Task 5 bước 4 |
| §3 thang token 8pt | Task 1 bước 3 |
| §3 giải trình 26 token màu | Task 1 bước 3 (comment trong `tokens.css`) |
| §4 layout dashboard | Task 6 |
| §4 việt hoá chuỗi | Task 6 bước 2 |
| §4 bỏ 4 chỗ bịa số | Task 6 bước 1 |
| §5 danh sách đơn theo `F6` | Task 7 |
| §6 thứ tự thi công | Task 1→9 khớp |
| §7 DoD | Task 9 |
| §8 rủi ro `@source` | Task 1 bước 7 (đánh dấu "dễ quên nhất") |
| §8 rủi ro rò token | Task 3 bước 5, Task 9 bước 4 |
| §8 rủi ro `DataGrid` fork | Task 5 bước 4 (ghi "không fork") |

Không có mục nào của spec thiếu task.

**Placeholder scan:** không có "TBD"/"TODO"/"tương tự Task N". Mọi bước có
lệnh chạy được hoặc tiêu chí kiểm được.

**Type consistency:** `CmsTone` định nghĩa ở Task 2, dùng lại ở Task 4
(`KpiCardProps.tone`) và Task 5 (`InlineAlertProps.tone`) — cùng tên, cùng
6 giá trị. `DataTableProps<T>` ở Task 5 nhập từ `@repo/ui`, khớp chữ ký thật
đã đọc trong `DataTable.tsx`.

**Điểm cần chú ý khi thực thi:** repo **không có test framework**. Mọi bước
verify là `pnpm typecheck` / `pnpm check` / `pnpm build:safe` / `grep` /
kiểm bằng mắt. Không bịa lệnh test.
