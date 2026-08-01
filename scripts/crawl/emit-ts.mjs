/**
 * Sinh file TypeScript seed từ seed-data.json.
 *
 * Chạy: node scripts/crawl/emit-ts.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "scripts", "crawl", "output");
const s = JSON.parse(await readFile(path.join(OUT, "seed-data.json"), "utf8"));

const q = (v) => JSON.stringify(v);
const arr = (items, indent) =>
    items.length
        ? `[\n${items.map((i) => `${indent}    ${q(i)},`).join("\n")}\n${indent}]`
        : "[]";

const rooms = s.roomTypes
    .map(
        (r) => `    {
        id: ${q(r.id)},
        name: ${q(r.name)},
        roomNumber: ${q(r.roomNumber)},
        description: ${q(r.description)},
        size: ${q(r.size)},
        capacity: ${r.capacity},
        price: ${r.price},
        extraBedFee: ${r.extraBedFee},
        view: ${q(r.view)},
        hasBalcony: ${r.hasBalcony},
        images: ${arr(r.images, "        ")},
        availability: true,
    },`
    )
    .join("\n");

const articles = (list, indent) =>
    list.length
        ? `[\n${list
              .map(
                  (a) =>
                      `${indent}    { title: ${q(a.title)}, url: ${q(a.url)} },`
              )
              .join("\n")}\n${indent}]`
        : "[]";

const paras = (list, indent) =>
    list.length
        ? `[\n${list.map((p) => `${indent}    ${q(p)},`).join("\n")}\n${indent}]`
        : "[]";

const ts = `/**
 * Seed data — The Nam Du Hill Resort (https://thenamduhill.com)
 *
 * Crawl tự động ngày 02/08/2026 từ 14 trang (home, rooms-suites, room-list,
 * winning-dinning, experiences-feel, events, news-list, gallery, contact và
 * 5 trang chính sách) cùng 13 bài viết con — tổng 27 trang.
 * Sinh bởi: scripts/crawl/crawl-pages.mjs -> build-seed.mjs -> emit-ts.mjs
 *
 * Toàn bộ URL ảnh đã được kiểm tra trả về HTTP 200 và trỏ tới bản gốc full-size
 * (đã bỏ /cache/ và hậu tố -WxH).
 *
 * ---------------------------------------------------------------------------
 * LƯU Ý BẢN QUYỀN
 * Đây là dữ liệu và hình ảnh của The Nam Du Hill Resort — một cơ sở lưu trú
 * khác. Dùng làm mẫu cấu trúc để dựng UI ở môi trường dev thì được; đưa lên
 * production, hotlink ảnh hoặc tải ảnh về dùng cho khách sạn của bạn là vi phạm
 * bản quyền. Trước khi lên production hãy thay toàn bộ bằng nội dung của bạn.
 * ---------------------------------------------------------------------------
 */

export interface SeedRoomType {
    id: string;
    name: string;
    roomNumber: string;
    description: string;
    size: string;
    capacity: number;
    price: number;
    /** Phụ thu mỗi khách/giường phụ, 0 nếu không áp dụng. */
    extraBedFee: number;
    view: string;
    hasBalcony: boolean;
    images: string[];
    availability: boolean;
}

export interface SeedArticle {
    title: string;
    url: string;
}

export const hotelInfo = {
    id: ${q(s.hotel.id)},
    name: ${q(s.hotel.name)},
    location: ${q(s.hotel.location)},
    address: ${q(s.hotel.address)},
    phone: ${q(s.hotel.phone)},
    email: ${q(s.hotel.email)},
    taxId: ${q(s.hotel.taxId)},
};

/** ${s.roomTypes.length} loại phòng, giá VND/đêm. */
export const roomTypes: SeedRoomType[] = [
${rooms}
];

export const dining = {
    title: ${q(s.dining.title)},
    banner: ${q(s.dining.banner)},
    paragraphs: ${paras(s.dining.paragraphs, "    ")},
};

export const experiences = {
    title: ${q(s.experiences.title)},
    banner: ${q(s.experiences.banner)},
    images: ${arr(s.experiences.images, "    ")},
    paragraphs: ${paras(s.experiences.paragraphs, "    ")},
    articles: ${articles(s.experiences.articles, "    ")} as SeedArticle[],
};

/** Trang Event hiện chưa có nội dung trên website nguồn. */
export const events = {
    banner: ${q(s.events.banner)},
    items: [] as SeedArticle[],
};

export const news = {
    banner: ${q(s.news.banner)},
    thumbnails: ${arr(s.news.thumbnails, "    ")},
    articles: ${articles(s.news.articles, "    ")} as SeedArticle[],
};

/** ${s.gallery.length} ảnh gallery, dùng chung cho hero / slider. */
export const gallery: string[] = ${arr(s.gallery, "")};

/** Ảnh banner/hero lấy từ trang chủ. */
export const banners: string[] = ${arr(s.banners, "")};

export interface SeedPolicyPage {
    title: string;
    url: string;
    paragraphs: string[];
}

/** Trích từ 5 trang /page/... của website nguồn. */
export const policies = {
    checkIn: ${q(s.policies.checkIn)},
    checkOut: ${q(s.policies.checkOut)},
    cancellation: ${q(s.policies.cancellation)},
    children: ${q(s.policies.children)},
    extraBed: ${q(s.policies.extraBed)},
    smoking: ${q(s.policies.smoking)},
    quietHours: ${q(s.policies.quietHours)},
    /** Toàn văn từng trang chính sách — dùng cho /terms, /privacy. */
    pages: [
${s.policies.pages
    .map(
        (p) => `        {
            title: ${q(p.title)},
            url: ${q(p.url)},
            paragraphs: ${paras(p.paragraphs, "            ")},
        },`
    )
    .join("\n")}
    ] as SeedPolicyPage[],
};

export const payment = {
    methods: ${arr(s.payment.methods, "    ")},
    guide: ${paras(s.payment.guide, "    ")},
};

export const contact = {
    address: ${q(s.contact.address)},
    phone: ${q(s.contact.phone)},
    email: ${q(s.contact.email)},
};

export const namDuHillSeed = {
    hotel: hotelInfo,
    roomTypes,
    dining,
    experiences,
    events,
    news,
    gallery,
    banners,
    policies,
    payment,
    contact,
};
`;

await writeFile(path.join(OUT, "thenamduhill-com.seed.ts"), ts, "utf8");
console.log("Đã ghi output/thenamduhill-com.seed.ts");
