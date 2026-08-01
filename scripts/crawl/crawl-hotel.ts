/**
 * Crawl một website khách sạn và bóc tách thành dữ liệu có cấu trúc.
 *
 * Cách chạy:
 *   npm run crawl:hotel -- https://example-hotel.com
 *   npm run crawl:hotel -- https://example-hotel.com --limit 40 --out my-hotel
 *
 * Kết quả ghi ra: scripts/crawl/output/<slug>.json  (dữ liệu thô đã bóc tách)
 *                 scripts/crawl/output/<slug>.raw.json (markdown từng trang, để đối chiếu)
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { firecrawl } from "./firecrawl";
import { hotelSchema, type CrawledHotel } from "./schema";

const OUTPUT_DIR = path.join(process.cwd(), "scripts", "crawl", "output");

/** Các đường dẫn thường chứa thông tin phòng / tiện ích của site khách sạn. */
const INCLUDE_PATHS = [
    "*room*",
    "*phong*",
    "*suite*",
    "*collection*",
    "*accommodation*",
    "*dining*",
    "*restaurant*",
    "*experience*",
    "*facilit*",
    "*service*",
    "*gallery*",
    "*about*",
    "*contact*",
];

interface Args {
    url: string;
    limit: number;
    out?: string;
}

function parseArgs(): Args {
    const argv = process.argv.slice(2);
    const url = argv.find((a) => a.startsWith("http"));
    if (!url) {
        console.error("Thiếu URL.\nVí dụ: npm run crawl:hotel -- https://thenamduhill.com");
        process.exit(1);
    }

    const readFlag = (name: string) => {
        const i = argv.indexOf(`--${name}`);
        return i !== -1 ? argv[i + 1] : undefined;
    };

    return {
        url,
        limit: Number(readFlag("limit") ?? 30),
        out: readFlag("out"),
    };
}

function slugify(url: string) {
    return new URL(url).hostname.replace(/^www\./, "").replace(/[^a-z0-9]+/gi, "-");
}

function dedupe(items: string[]) {
    return [...new Set(items)];
}

/** Ảnh rác thường gặp: icon, logo, sprite, pixel tracking, ảnh quá nhỏ. */
const IMAGE_BLOCKLIST =
    /(logo|icon|favicon|sprite|placeholder|avatar|1x1|spacer|blank|loading|pixel)/i;

/**
 * Gom URL ảnh từ HTML thô.
 *
 * Bắt cả `src`, `data-src` / `data-original` (lazy-load), `srcset` và
 * `background-image` trong inline style. Trả về URL tuyệt đối, đã lọc rác.
 */
function collectImages(html: string, pageUrl: string): string[] {
    const found: string[] = [];

    const push = (raw?: string) => {
        if (!raw) return;
        const candidate = raw.trim().split(/\s+/)[0]; // srcset: bỏ phần "1024w"
        if (!candidate || candidate.startsWith("data:")) return;
        try {
            found.push(new URL(candidate, pageUrl).href);
        } catch {
            /* URL hỏng thì bỏ qua */
        }
    };

    // src / data-src / data-original / data-lazy-src
    for (const m of html.matchAll(
        /<img[^>]+?(?:data-(?:src|original|lazy-src)|src)\s*=\s*["']([^"']+)["']/gi
    )) {
        push(m[1]);
    }

    // srcset — lấy mọi biến thể, lọc trùng ở bước sau
    for (const m of html.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi)) {
        for (const part of m[1].split(",")) push(part);
    }

    // background-image: url(...)
    for (const m of html.matchAll(/background-image\s*:\s*url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
        push(m[1]);
    }

    // <source> trong <picture>
    for (const m of html.matchAll(/<source[^>]+?src\s*=\s*["']([^"']+)["']/gi)) {
        push(m[1]);
    }

    return dedupe(found).filter(
        (u) => /\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(u) && !IMAGE_BLOCKLIST.test(u)
    );
}

async function main() {
    const { url, limit, out } = parseArgs();
    const slug = out ?? slugify(url);

    await mkdir(OUTPUT_DIR, { recursive: true });

    // Bước 1: crawl toàn site để lấy markdown từng trang.
    // Markdown giữ lại để đối chiếu thủ công khi extract bỏ sót thông tin.
    console.log(`[1/2] Đang crawl ${url} (tối đa ${limit} trang)...`);
    const crawled = await firecrawl.crawl(url, {
        limit,
        includePaths: INCLUDE_PATHS,
        scrapeOptions: {
            // rawHtml để tự gom ảnh; LLM extract hay bỏ sót ảnh nên không dựa vào nó.
            formats: ["markdown", "rawHtml"],
            onlyMainContent: true,
        },
    });

    const pages = crawled.data ?? [];
    console.log(`      Đã lấy ${pages.length} trang.`);

    // Gom ảnh theo từng trang bằng regex trên HTML — deterministic, không phụ thuộc LLM.
    const imagesByPage = pages.map((p) => ({
        url: p.metadata?.sourceURL ?? "",
        title: p.metadata?.title ?? "",
        images: collectImages(p.rawHtml ?? "", p.metadata?.sourceURL ?? url),
    }));

    const allImages = dedupe(imagesByPage.flatMap((p) => p.images));
    console.log(`      Tìm thấy ${allImages.length} ảnh (đã lọc trùng).`);

    await writeFile(
        path.join(OUTPUT_DIR, `${slug}.raw.json`),
        JSON.stringify(
            pages.map((p, i) => ({
                url: p.metadata?.sourceURL,
                title: p.metadata?.title,
                markdown: p.markdown,
                images: imagesByPage[i].images,
            })),
            null,
            2
        ),
        "utf8"
    );

    // File riêng cho ảnh, kèm trang nguồn — để đối chiếu ảnh nào thuộc phòng nào.
    await writeFile(
        path.join(OUTPUT_DIR, `${slug}.images.json`),
        JSON.stringify({ total: allImages.length, byPage: imagesByPage, all: allImages }, null, 2),
        "utf8"
    );

    // Bước 2: extract có schema. Truyền cả wildcard để Firecrawl tự gom nhiều trang.
    console.log(`[2/2] Đang bóc tách dữ liệu theo schema...`);
    const extracted = await firecrawl.extract({
        urls: [url, `${url.replace(/\/$/, "")}/*`],
        schema: hotelSchema,
        prompt:
            "Bóc tách toàn bộ thông tin khách sạn/resort: tên, mô tả, địa chỉ, liên hệ, " +
            "danh sách đầy đủ các loại phòng kèm diện tích/số khách/giá (VND, chỉ lấy số), " +
            "tiện ích, nhà hàng, trải nghiệm và chính sách check-in/hủy phòng. " +
            "Nếu một trường không có trên website thì bỏ trống, tuyệt đối không tự bịa.",
    });

    const hotel = extracted.data as CrawledHotel;

    // Ảnh: ưu tiên danh sách gom từ HTML (đầy đủ hơn LLM), giữ lại ảnh LLM tìm được.
    hotel.images = dedupe([...(hotel.images ?? []), ...allImages]);

    // Ghép ảnh cho từng loại phòng dựa trên trang nguồn có tên phòng xuất hiện.
    for (const room of hotel.roomTypes ?? []) {
        if (room.images?.length) continue;
        const page = imagesByPage.find(
            (p) =>
                p.title.toLowerCase().includes(room.name.toLowerCase()) ||
                room.name.toLowerCase().includes(p.title.toLowerCase().split("|")[0].trim())
        );
        if (page) room.images = page.images.slice(0, 8);
    }

    const outPath = path.join(OUTPUT_DIR, `${slug}.json`);
    await writeFile(outPath, JSON.stringify(hotel, null, 2), "utf8");

    const roomsWithImages = (hotel.roomTypes ?? []).filter((r) => r.images?.length).length;

    console.log(`\nXong. Kết quả: ${outPath}`);
    console.log(`  - ${hotel.roomTypes?.length ?? 0} loại phòng (${roomsWithImages} có ảnh)`);
    console.log(`  - ${hotel.amenities?.length ?? 0} tiện ích`);
    console.log(`  - ${hotel.images?.length ?? 0} ảnh — chi tiết: ${slug}.images.json`);
    console.log(`\nBước tiếp: npm run crawl:seed -- ${slug}`);
}

main().catch((err) => {
    console.error("\nCrawl thất bại:", err instanceof Error ? err.message : err);
    process.exit(1);
});
