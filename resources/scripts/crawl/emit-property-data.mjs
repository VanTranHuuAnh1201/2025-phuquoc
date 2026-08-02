/**
 * Sinh file TypeScript tĩnh cho packages/core từ seed-data.json.
 *
 * Chạy: pnpm crawl:property
 *
 * VÌ SAO PHẢI SINH FILE THAY VÌ IMPORT JSON THẲNG
 * `seed-data.json` nằm ở `resources/scripts/crawl/output/`, tức NGOÀI ranh giới
 * package `@repo/core`. Import xuyên biên giới package là bẩn: tsc phải mở
 * rootDir ra ngoài, bundler của Next phải theo dõi một file ngoài workspace, và
 * runtime production sẽ phải đọc đĩa. Giải pháp: chuyển JSON thành một module TS
 * tĩnh nằm HẲN trong core, commit được, không đọc đĩa lúc chạy.
 *
 * File sinh ra: packages/core/src/data/nam-du-hill.seed.generated.ts
 * KHÔNG sửa tay file đó — mọi thay đổi sẽ mất ở lần chạy script kế tiếp.
 * Muốn đổi hình dạng dữ liệu thì sửa `packages/core/src/data/seed-dto.ts`
 * (nơi ánh xạ RAW → PropertyData), còn muốn đổi nội dung thì crawl lại.
 */

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..', '..')

const SEED_JSON = path.join(HERE, 'output', 'seed-data.json')
const OUT_TS = path.join(
    ROOT,
    'packages',
    'core',
    'src',
    'data',
    'nam-du-hill.seed.generated.ts',
)

const seed = JSON.parse(await readFile(SEED_JSON, 'utf8'))

/** Chỉ giữ đúng những khoá mà `SeedData` trong seed-dto.ts khai báo. */
const pickRoom = (r) => ({
    id: r.id,
    name: r.name,
    roomNumber: r.roomNumber,
    summary: r.summary,
    description: r.description ?? [],
    size: r.size ?? '',
    detailSize: r.detailSize ?? '',
    capacity: r.capacity,
    price: r.price,
    extraBedFee: r.extraBedFee ?? 0,
    view: r.view ?? '',
    viewDetail: r.viewDetail ?? [],
    hasBalcony: Boolean(r.hasBalcony),
    amenities: r.amenities ?? [],
    conditions: r.conditions ?? [],
    images: r.images ?? [],
    availability: r.availability !== false,
})

const payload = {
    hotel: {
        id: seed.hotel.id,
        name: seed.hotel.name,
        location: seed.hotel.location,
        address: seed.hotel.address,
        phone: seed.hotel.phone,
        email: seed.hotel.email,
        taxId: seed.hotel.taxId,
        images: seed.hotel.images ?? [],
    },
    roomTypes: seed.roomTypes.map(pickRoom),
    dining: {
        title: seed.dining.title,
        banner: seed.dining.banner,
        paragraphs: seed.dining.paragraphs ?? [],
    },
    gallery: seed.gallery ?? [],
    banners: seed.banners ?? [],
    policies: {
        checkIn: seed.policies.checkIn,
        checkOut: seed.policies.checkOut,
        cancellation: seed.policies.cancellation,
        children: seed.policies.children,
        extraBed: seed.policies.extraBed,
        smoking: seed.policies.smoking,
        quietHours: seed.policies.quietHours,
    },
    payment: {
        methods: seed.payment.methods ?? [],
        guide: seed.payment.guide ?? [],
    },
    contact: {
        address: seed.contact.address,
        phone: seed.contact.phone,
        email: seed.contact.email,
    },
}

/**
 * In JSON có thụt lề 4 space và KHÔNG dấu chấm phẩy — khớp quy ước của
 * packages/core. Khoá không cần nháy vì toàn bộ đều là định danh hợp lệ.
 */
function emit(value, indent = 0) {
    const pad = ' '.repeat(indent)
    const padIn = ' '.repeat(indent + 4)

    if (Array.isArray(value)) {
        if (value.length === 0) return '[]'
        const items = value.map((v) => `${padIn}${emit(v, indent + 4)},`)
        return `[\n${items.join('\n')}\n${pad}]`
    }
    if (value !== null && typeof value === 'object') {
        const entries = Object.entries(value).map(
            ([k, v]) => `${padIn}${k}: ${emit(v, indent + 4)},`,
        )
        return `{\n${entries.join('\n')}\n${pad}}`
    }
    return JSON.stringify(value)
}

const header = `/**
 * TỆP SINH TỰ ĐỘNG — ĐỪNG SỬA TAY.
 *
 * Nguồn: resources/scripts/crawl/output/seed-data.json
 * Sinh bởi: resources/scripts/crawl/emit-property-data.mjs (pnpm crawl:property)
 * Ngày sinh: ${new Date().toISOString().slice(0, 10)}
 * Số hạng phòng: ${payload.roomTypes.length}
 *
 * Đây là dữ liệu crawl NGUYÊN TRẠNG từ thenamduhill.com, chưa qua ánh xạ.
 * Nơi biến nó thành \`PropertyData\` là \`./seed-dto.ts\`.
 *
 * ---------------------------------------------------------------------------
 * BẢN QUYỀN (luật R9)
 * Nội dung và toàn bộ URL ảnh dưới đây thuộc về The Nam Du Hill Resort. Chỉ
 * dùng để dựng cấu trúc giao diện ở môi trường dev. Ảnh KHÔNG được hotlink lên
 * production — \`devImages()\` trong seed-dto.ts chịu trách nhiệm chặn.
 * ---------------------------------------------------------------------------
 */

import type { SeedData } from './seed-dto'

export const namDuHillSeed: SeedData = ${emit(payload, 0)}
`

await writeFile(OUT_TS, header, 'utf8')
console.log(
    `Đã ghi ${path.relative(ROOT, OUT_TS)} — ${payload.roomTypes.length} hạng phòng.`,
)
