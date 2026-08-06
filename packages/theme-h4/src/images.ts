import { propertyPath, t, type I18nText } from '@repo/core'
import { HERO_SLIDES } from '@repo/domain-hotel'

/**
 * ẢNH MẶC ĐỊNH CỦA MẪU 04 — kết quả tuyển chọn theo P6.
 *
 * VÌ SAO ĐƯỜNG DẪN NẰM Ở ĐÂY MÀ KHÔNG PHẢI TRONG `core`:
 * `core` giữ phần CHỮ song ngữ; file ảnh thì nằm trong `public/` của từng app.
 * Nhưng bắt app phải tự biết "mẫu 04 muốn ảnh nào ở hero" là đẩy quyết định
 * THẨM MỸ ra khỏi theme — mà thẩm mỹ đúng là thứ duy nhất theme sở hữu.
 *
 * Nên: theme khai ý ĐỊNH của mình ở đây, app vẫn đè được qua prop nếu cấu
 * trúc `public/` của nó khác (composition nhận `heroSlides`, `roomImages`…).
 * Đây cũng là nơi luật R9 được tôn trọng — chỉ trỏ vào ảnh trong `property/`
 * của app, không hotlink và không dùng ảnh crawl.
 *
 * ---------------------------------------------------------------------------
 * BIÊN BẢN TUYỂN ẢNH (P6 — Photography Direction)
 *
 * Kho ảnh của resort trộn nhiều nguồn rõ rệt: ảnh phong cảnh chụp máy tốt
 * (drone/DSLR), ảnh phòng chụp điện thoại, và ảnh ghép marketing có chữ in
 * sẵn. P6 cấm để sự pha trộn đó lộ ra trong cùng một dải.
 *
 * CHỌN:
 *   HERO           → lấy 3 slide đầu của `HERO_SLIDES` (tầng domain). Slide 1
 *                    (`hai-dang-Ke-Ga-2`) là khung rộng nhất và nét nhất trong
 *                    kho — ảnh duy nhất đủ "editorial" để đứng ở gần 100svh.
 *                    Ba slide cùng tông xanh ngọc + nắng trưa nên đọc như một
 *                    bộ, không nhảy tông (yêu cầu "Tone" của P6).
 *   place-cay-men  → dải 21:9 của section ẩm thực. Nước trong, thuyền gỗ —
 *                    bán "trải nghiệm", không bán "phòng" (P6 §Hero).
 *   about-resort   → cột ảnh section `about`. Đây LÀ ảnh ghép có logo in
 *                    sẵn; chấp nhận được ở khung 4:5 cỡ vừa vì nó nói đúng
 *                    câu chuyện "resort trên đồi", nhưng KHÔNG bao giờ được
 *                    đưa lên hero hay full-bleed.
 *
 * KHÔNG DÙNG FULL-BLEED: toàn bộ ảnh phòng (`room-*`). Chúng chụp bằng điện
 * thoại, có tấm chỉ 351px, có tấm là khung ghép đôi. Phóng to là lộ ngay.
 * Chúng chỉ xuất hiện trong `Frame` cỡ vừa, cùng tỷ lệ, cùng lớp phủ.
 * ---------------------------------------------------------------------------
 */

export interface ThemeImage {
    src: string
    alt: I18nText
}

/**
 * Ảnh hero — DÙNG CHUNG bộ của tầng domain (`domain-hotel/media.ts`).
 *
 * VÌ SAO KHÔNG TỰ KHAI RIÊNG NỮA: `HERO_SLIDES` ở `domain-hotel` là một nguồn
 * sự thật cho mọi mẫu (luật R8) — đổi ảnh hero một chỗ là cả h1/h2/h3/h4 đổi
 * theo, và cờ `NEXT_PUBLIC_ALLOW_CRAWLED_MEDIA` của app vẫn kiểm soát được.
 * Bản trước của mẫu này tự trỏ vào `property/` là đang fork lại đúng thứ mà
 * commit "ảnh dùng chung ở tầng domain" vừa gom về một mối.
 *
 * Mẫu 04 CHỈ lấy 3 slide đầu: hero ở đây cao gần trọn màn hình và không tự
 * chạy, nên bốn ảnh là thừa — người dùng hiếm khi bấm quá slide thứ ba.
 */
export const heroSlides: readonly ThemeImage[] = HERO_SLIDES.slice(0, 3)

/** Ảnh cột phải của section `about`. */
export const settingImage: ThemeImage = {
    src: propertyPath('hero-drone.jpg'),
    alt: t(
        'The Nam Du Hill Resort trên triền đồi Củ Tron nhìn từ trên cao',
        'The Nam Du Hill Resort on the Cu Tron hillside seen from above',
    ),
}

/** Dải ảnh 21:9 của section `dining`. */
export const culinaryImage: ThemeImage = {
    src: propertyPath('place-cay-men.png'),
    alt: t(
        'Thuyền gỗ neo trên làn nước trong vắt ở Bãi Cây Mến',
        'A wooden boat moored on the clear shallows of Cay Men beach',
    ),
}

/**
 * Phim giới thiệu resort — mở trong modal ở section `about`.
 *
 * Cùng lý do với ảnh: đây là quyết định biên tập của mẫu, nên mẫu tự mang.
 * App vẫn đè được qua prop `videoSrc` của `Home` nếu `public/` của nó khác.
 * Đường dẫn tuyệt đối tính từ `public/` của app đang render.
 */
export const introVideo = '/video/8102936365457.mp4'

/** Ảnh banner của trang danh sách hạng phòng. */
export const roomsBanner: ThemeImage = {
    src: propertyPath('banner-rooms.jpg'),
    alt: t('Khu phòng nghỉ của resort nhìn từ ngoài', 'The resort’s guest rooms seen from outside'),
}

/**
 * Ảnh gán theo id hạng phòng.
 *
 * Dữ liệu `Room.images` trong seed đang trỏ vào ảnh crawl (luật R9 — không
 * được lên production), nên mẫu này ưu tiên ảnh trong `property/` của app.
 * Id nào không có trong bảng thì rơi về `Room.images` rồi tới ảnh chung.
 */
const ROOM_IMAGE_BY_KEYWORD: ReadonlyArray<{ match: RegExp; file: string }> = [
    { match: /luc-giac|hexagon/i, file: 'room-luc-giac.jpg' },
    { match: /suite|gia-dinh|family/i, file: 'room-suite-6.jpg' },
    { match: /doi|double|balcony|ban-cong/i, file: 'room-double-balcony.jpg' },
]

/** Ảnh dùng khi không khớp id nào — vẫn là ảnh phòng thật, không phải khung xám. */
export const fallbackRoomImage = propertyPath('room-luc-giac.jpg')

export function roomImage(roomId: string): string {
    const hit = ROOM_IMAGE_BY_KEYWORD.find((entry) => entry.match.test(roomId))
    return hit ? propertyPath(hit.file) : fallbackRoomImage
}
