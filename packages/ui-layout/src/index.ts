/**
 * `@repo/ui-layout` — TẦNG NỀN: bố cục trang, không biết domain nào tồn tại.
 *
 * Ranh giới với `@repo/ui`:
 *
 *     ui         primitive rời — Button, Modal, Field, DataTable
 *     ui-layout  bố cục trang  — Header, Hero, Breadcrumbs, Footer
 *
 * Phép thử trước khi thêm bất cứ thứ gì vào đây (luật R15):
 *
 *     "Một SaaS dashboard hay trang thương mại điện tử có dùng được không?"
 *
 * Dùng được → thuộc về đây. Không → thuộc về `packages/domain-*`.
 *
 * Vì thế mọi component ở đây nhận PROP NGUYÊN THUỶ (chuỗi, mảng nhãn+href),
 * không nhận type dữ liệu của một ngành. Nơi gọi tự ánh xạ từ dữ liệu của mình
 * sang các prop đó — đó là công việc của tầng domain.
 */

/**
 * Khung trang đầy đủ — bản gộp từ header/footer của app resort, là bản có
 * nhiều tính năng nhất. Mọi mẫu và mọi app nên dùng bộ này.
 */
export { SiteHeader } from './SiteHeader'
export type {
    SiteHeaderProps,
    SiteHeaderBrand,
    SiteHeaderStrings,
    HeaderNavItem,
    AccountMenuItem,
} from './SiteHeader'

export { SiteFooter } from './SiteFooter'
export type {
    SiteFooterProps,
    SiteFooterBrand,
    FooterColumn,
    FooterLink,
} from './SiteFooter'

/**
 * Bộ cũ — giữ cho tới khi mọi nơi chuyển sang `SiteHeader`/`SiteFooter`.
 * Code mới đừng dùng.
 */
export {
    PageBody,
    PageHeader,
    PageHero,
    PageFooter,
    Breadcrumbs,
    LightCrumbs,
} from './PageShell'

export type {
    ShellProps,
    ShellStrings,
    BrandInfo,
    NavItem,
    SocialLink,
    Crumb,
} from './PageShell'
