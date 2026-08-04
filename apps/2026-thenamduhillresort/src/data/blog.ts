/**
 * Bài viết blog — đọc từ `@repo/core`, KHÔNG khai dữ liệu tại đây (luật R8).
 *
 * Nguồn thật: `packages/core/src/data/blog.ts`.
 *
 * Lớp này chỉ trải `I18nText` của core ra cặp `xxxVi`/`xxxEn` mà giao diện
 * hiện tại đang đọc. Khi màn hình chuyển sang dùng `tx()` thì bỏ được lớp này.
 */

import {
    blogPosts,
    type BlogBlock as CoreBlock,
    type BlogPost as CorePost,
} from '@repo/core'

export interface BlogBlock {
    kind: 'h' | 'p' | 'q' | 'i' | 'l'
    textVi?: string
    textEn?: string
    captionVi?: string
    captionEn?: string
    slotId?: string
    items?: Array<{ vi: string; en: string }>
}

export interface BlogPost {
    id: string
    categoryVi: string
    categoryEn: string
    titleVi: string
    titleEn: string
    ledeVi: string
    ledeEn: string
    authorVi: string
    authorEn: string
    roleVi: string
    roleEn: string
    dateVi: string
    dateEn: string
    readMin: number
    heroSlot: string
    heroCaptionVi: string
    heroCaptionEn: string
    tags: Array<{ vi: string; en: string }>
    blocks: BlogBlock[]
}

const toBlock = (b: CoreBlock): BlogBlock => ({
    kind: b.kind,
    ...(b.text ? { textVi: b.text.vi, textEn: b.text.en } : {}),
    ...(b.caption ? { captionVi: b.caption.vi, captionEn: b.caption.en } : {}),
    ...(b.slotId ? { slotId: b.slotId } : {}),
    ...(b.items ? { items: b.items.map((i) => ({ vi: i.vi, en: i.en })) } : {}),
})

const toPost = (p: CorePost): BlogPost => ({
    id: p.id,
    categoryVi: p.category.vi,
    categoryEn: p.category.en,
    titleVi: p.title.vi,
    titleEn: p.title.en,
    ledeVi: p.lede.vi,
    ledeEn: p.lede.en,
    authorVi: p.author.vi,
    authorEn: p.author.en,
    roleVi: p.role.vi,
    roleEn: p.role.en,
    dateVi: p.date.vi,
    dateEn: p.date.en,
    readMin: p.readMin,
    heroSlot: p.heroSlot,
    heroCaptionVi: p.heroCaption.vi,
    heroCaptionEn: p.heroCaption.en,
    tags: p.tags.map((t) => ({ vi: t.vi, en: t.en })),
    blocks: p.blocks.map(toBlock),
})

export const BLOG_POSTS: BlogPost[] = blogPosts.map(toPost)
