/**
 * Chuyển output của crawl-hotel.ts sang đúng shape mà project đang dùng
 * (xem src/app/[locale]/hotels/mockData.ts).
 *
 * Cách chạy:
 *   npm run crawl:seed -- thenamduhill-com
 *   npm run crawl:seed -- thenamduhill-com --id 2
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CrawledHotel } from "./schema";

const OUTPUT_DIR = path.join(process.cwd(), "scripts", "crawl", "output");

/** Map tên tiện ích tự do về bộ icon mà UI đang dùng. */
const ICON_RULES: [RegExp, string][] = [
    [/wi-?fi|internet/i, "wifi"],
    [/đỗ xe|parking|bãi xe/i, "parking"],
    [/hồ bơi|pool|bể bơi/i, "pool"],
    [/điều hoà|điều hòa|air ?con/i, "ac"],
    [/nhà hàng|restaurant|ẩm thực/i, "restaurant"],
    [/an ninh|security|cctv|bảo vệ/i, "security"],
    [/spa|massage/i, "spa"],
    [/gym|thể hình|fitness/i, "gym"],
    [/bar|café|cafe|quầy/i, "bar"],
    [/đưa đón|shuttle|transport|xe/i, "transport"],
    [/bãi biển|beach|biển/i, "beach"],
    [/bbq|nướng/i, "bbq"],
];

function iconFor(name: string) {
    return ICON_RULES.find(([re]) => re.test(name))?.[1] ?? "check";
}

function slugifyRoom(name: string, index: number) {
    const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return slug || `room-${index + 1}`;
}

function parseArgs() {
    const argv = process.argv.slice(2);
    const slug = argv.find((a) => !a.startsWith("--"));
    if (!slug) {
        console.error("Thiếu slug.\nVí dụ: npm run crawl:seed -- thenamduhill-com");
        process.exit(1);
    }
    const i = argv.indexOf("--id");
    return { slug, id: i !== -1 ? argv[i + 1] : "1" };
}

async function main() {
    const { slug, id } = parseArgs();

    const raw = await readFile(path.join(OUTPUT_DIR, `${slug}.json`), "utf8");
    const hotel = JSON.parse(raw) as CrawledHotel;

    const seed = {
        [id]: {
            id,
            name: hotel.name,
            location: hotel.location ?? "",
            address: hotel.address ?? "",
            rating: hotel.rating ?? 0,
            reviewCount: hotel.reviewCount ?? 0,
            images: hotel.images ?? [],
            description: hotel.description ?? "",
            amenities: (hotel.amenities ?? []).map((name) => ({
                icon: iconFor(name),
                name,
                available: true,
            })),
            roomTypes: (hotel.roomTypes ?? []).map((room, i) => ({
                id: slugifyRoom(room.name, i),
                name: room.name,
                size: room.size ?? "",
                capacity: room.capacity ?? 2,
                price: room.price ?? 0,
                amenities: room.amenities ?? [],
                images: room.images ?? [],
                availability: true,
            })),
            policies: {
                checkIn: hotel.policies?.checkIn ?? "14:00",
                checkOut: hotel.policies?.checkOut ?? "12:00",
                cancellation: hotel.policies?.cancellation ?? "",
                children: hotel.policies?.children ?? "",
                pets: hotel.policies?.pets ?? "",
            },
            location_details: {
                nearbyAttractions: (hotel.nearbyAttractions ?? []).map((a) => ({
                    name: a.name,
                    distance: a.distance ?? "",
                })),
                coordinates: { lat: 0, lng: 0 },
            },
        },
    };

    const outPath = path.join(OUTPUT_DIR, `${slug}.seed.ts`);
    const contents =
        `// Sinh tự động bởi scripts/crawl/to-seed.ts từ ${slug}.json\n` +
        `// Kiểm tra lại giá và bản quyền ảnh trước khi merge vào mockData.ts\n\n` +
        `export const hotelMockData = ${JSON.stringify(seed, null, 4)} as const;\n`;

    await writeFile(outPath, contents, "utf8");

    console.log(`Đã ghi ${outPath}`);
    console.log(`Merge thủ công vào src/app/[locale]/hotels/mockData.ts khi đã kiểm tra xong.`);
}

main().catch((err) => {
    console.error("Thất bại:", err instanceof Error ? err.message : err);
    process.exit(1);
});
