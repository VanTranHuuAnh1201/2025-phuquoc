import type { Room } from '@repo/core'

/**
 * Chọn ảnh từ bộ ảnh crawl của core — một chỗ duy nhất cho luật ảnh của spec
 * §8.1: `sua-tam-*` là poster marketing gắn logo (cấm mọi vị trí),
 * `*-full*` là collage 3-trong-1 (cấm dùng làm cover card).
 */

function isPoster(src: string): boolean {
    return src.includes('sua-tam')
}

function isCollage(src: string): boolean {
    return /[-_]full/.test(src) || src.includes('full_') || src.includes('/full')
}

/** Ảnh dùng được cho card/gallery: không poster, không collage. */
export function usablePhoto(src: string): boolean {
    return !isPoster(src) && !isCollage(src)
}

/** Cover ĐƠN của một hạng phòng — ưu tiên file `cover`/`dai-dien`. */
export function roomCover(room: Room): string | undefined {
    const images = room.images ?? []
    return (
        images.find((src) => usablePhoto(src) && (src.includes('cover') || src.includes('dai-dien'))) ??
        images.find(usablePhoto) ??
        images[0]
    )
}

/** Bộ ảnh chi tiết phòng: cover đơn đứng đầu, poster loại hẳn. */
export function roomGallery(room: Room, limit = 5): string[] {
    const images = (room.images ?? []).filter((src) => !isPoster(src))
    const cover = roomCover(room)
    if (!cover) return images.slice(0, limit)
    return [cover, ...images.filter((src) => src !== cover)].slice(0, limit)
}
