/**
 * Sinh file TypeScript seed từ output/travlla/seed-data.json.
 *
 * Chạy: node scripts/crawl/emit-travlla-ts.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "scripts", "crawl", "output", "travlla");
const s = JSON.parse(await readFile(path.join(OUT, "seed-data.json"), "utf8"));

/** In JSON có thụt lề, dùng cho các object lồng nhau nhiều tầng. */
const j = (v, indent = "    ") =>
    JSON.stringify(v, null, 4)
        .split("\n")
        .map((l, i) => (i === 0 ? l : indent + l))
        .join("\n");

const q = (v) => JSON.stringify(v ?? "");
const count = (n, one, many = one) => `${n} ${n === 1 ? one : many}`;

const ts = `/**
 * Seed data — Travlla Tour & Travel (bộ demo Botble)
 *
 * Crawl tự động ngày ${new Date(s.site.crawledAt).toLocaleDateString("vi-VN")} từ ${s.site.variants.length} biến thể trang chủ:
${s.site.variants.map((v) => ` *   - ${v}`).join("\n")}
 * cùng toàn bộ trang con của ${s.site.source} (tours, destinations,
 * blog, galleries, services, team, testimonials, faqs, pricing).
 *
 * Sinh bởi: crawl-travlla.mjs -> build-travlla-seed.mjs -> emit-travlla-ts.mjs
 *
 * Toàn bộ URL ảnh đã quy về bản gốc full-size (bỏ hậu tố -WxH của thumbnail).
 *
 * ---------------------------------------------------------------------------
 * LƯU Ý BẢN QUYỀN
 * Đây là dữ liệu và hình ảnh thuộc bộ theme thương mại Travlla (CodeCanyon).
 * Dùng làm mẫu cấu trúc để dựng UI ở môi trường dev thì được; đưa lên
 * production, hotlink ảnh hoặc tái sử dụng nội dung là vi phạm bản quyền.
 * Trước khi lên production hãy thay toàn bộ bằng nội dung của bạn.
 * ---------------------------------------------------------------------------
 */

/* ---------------------------------- Types --------------------------------- */

export interface SeedItineraryDay {
    day: number;
    title: string;
    description: string;
}

export interface SeedDeparture {
    from: string;
    to: string;
    seatsLeft: number;
}

export interface SeedHotelRating {
    stars: number;
    price: number;
}

export interface SeedTourBooking {
    /** Giá khởi điểm (hạng khách sạn thấp nhất). */
    startingFrom: number;
    departures: SeedDeparture[];
    hotelRatings: SeedHotelRating[];
    travelerRange: string;
}

export interface SeedReview {
    author: string;
    date: string;
    comment: string;
}

export interface SeedTour {
    id: string;
    slug: string;
    url: string;
    name: string;
    metaDescription: string;
    destination: string;
    activityType: string;
    /** Ví dụ "5 Days / 4 Nights". */
    duration: string;
    /** Ví dụ "2–14". */
    groupSize: string;
    price: number;
    currency: string;
    priceUnit: string;
    rating: number;
    reviewCount: number;
    overview: string[];
    itinerary: SeedItineraryDay[];
    includes: string[];
    excludes: string[];
    booking: SeedTourBooking;
    reviews: SeedReview[];
    images: string[];
    thumbnail: string;
}

export interface SeedDestination {
    id: string;
    slug: string;
    url: string;
    name: string;
    metaDescription: string;
    tourCount: number;
    description: string[];
    images: string[];
    thumbnail: string;
}

export interface SeedTaxonomy {
    id: string;
    name: string;
    url: string;
}

export interface SeedService {
    id: string;
    slug: string;
    url: string;
    name: string;
    metaDescription: string;
    description: string[];
    images: string[];
}

export interface SeedGallery {
    id: string;
    slug: string;
    url: string;
    title: string;
    description: string[];
    images: string[];
}

export interface SeedPost {
    id: string;
    slug: string;
    url: string;
    title: string;
    metaDescription: string;
    publishedAt: string;
    category: string;
    content: string[];
    images: string[];
    thumbnail: string;
}

export interface SeedTeamMember {
    name: string;
    role: string;
    photo: string;
}

export interface SeedTestimonial {
    quote: string;
    author: string;
    role: string;
    photo: string;
}

export interface SeedFaq {
    question: string;
    answer: string;
}

export interface SeedPricingPlan {
    name: string;
    price: number;
    currency: string;
    unit: string;
    features: string[];
}

export interface SeedHeading {
    level: number;
    text: string;
}

/** Một biến thể trang chủ (home-1 … home-5) — dùng để so sánh layout. */
export interface SeedHomeVariant {
    variant: string;
    origin: string;
    url: string;
    title: string;
    metaDescription: string;
    headings: SeedHeading[];
    /** Các đoạn nội dung thật (đã lọc menu/nút bấm). */
    sections: string[];
    /** Ảnh nội dung (/storage/), bỏ asset của theme. */
    images: string[];
    backgrounds: string[];
    decorations: string[];
    /** Toàn bộ ảnh kể cả asset theme. */
    allImages: string[];
}

/* ---------------------------------- Data ---------------------------------- */

export const site = ${j(s.site)};

/** ${count(s.homeVariants.length, "biến thể")} trang chủ. */
export const homeVariants: SeedHomeVariant[] = ${j(s.homeVariants)};

/** ${count(s.tours.length, "tour")}, giá USD/khách. */
export const tours: SeedTour[] = ${j(s.tours)};

/** ${count(s.destinations.length, "điểm đến")}. */
export const destinations: SeedDestination[] = ${j(s.destinations)};

/** ${count(s.tourTypes.length, "loại hình")} tour. */
export const tourTypes: SeedTaxonomy[] = ${j(s.tourTypes)};

export const services: SeedService[] = ${j(s.services)};

/** ${count(s.galleries.length, "bộ")} ảnh, tổng ${s.galleries.reduce((n, g) => n + g.images.length, 0)} ảnh. */
export const galleries: SeedGallery[] = ${j(s.galleries)};

export const posts: SeedPost[] = ${j(s.blog.posts)};

export const blogCategories: SeedTaxonomy[] = ${j(s.blog.categories)};

export const blogTags: SeedTaxonomy[] = ${j(s.blog.tags)};

export const team: SeedTeamMember[] = ${j(s.team)};

export const testimonials: SeedTestimonial[] = ${j(s.testimonials)};

export const faqs: SeedFaq[] = ${j(s.faqs)};

export const pricing: SeedPricingPlan[] = ${j(s.pricing)};

export const about = ${j(s.about)};

export const contact = ${j(s.contact)};

/**
 * Toàn bộ ảnh đã crawl.
 * - \`content\`: ${s.images.content.length} ảnh nội dung thật (/storage/).
 * - \`byKind\`:  nhóm theo thư mục (tours, destinations, galleries, news…).
 * - \`all\`:     ${s.images.total} ảnh kể cả asset trang trí của theme.
 */
export const images = ${j(s.images)};

export const travllaSeed = {
    site,
    homeVariants,
    tours,
    destinations,
    tourTypes,
    services,
    galleries,
    blog: { posts, categories: blogCategories, tags: blogTags },
    team,
    testimonials,
    faqs,
    pricing,
    about,
    contact,
    images,
};

export default travllaSeed;
`;

await writeFile(path.join(OUT, "travlla-botble-com.seed.ts"), ts, "utf8");
console.log(`Đã ghi output/travlla/travlla-botble-com.seed.ts (${(ts.length / 1024).toFixed(0)} KB)`);
