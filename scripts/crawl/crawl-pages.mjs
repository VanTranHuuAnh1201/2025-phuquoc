/**
 * Crawl các trang cụ thể của một site khách sạn (không cần API key).
 *
 * Lấy full text + toàn bộ ảnh, tự đi theo link bài viết con của các trang news.
 * Dùng khi site render server-side; nếu site render bằng JS thì dùng Firecrawl
 * (crawl-hotel.ts) hoặc Playwright.
 *
 * Chạy:  node scripts/crawl/crawl-pages.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://thenamduhill.com";
const OUTPUT_DIR = path.join(process.cwd(), "scripts", "crawl", "output");

const SEED_PAGES = [
    { url: `${ORIGIN}/`, section: "home" },
    { url: `${ORIGIN}/collections/rooms-suites`, section: "rooms" },
    { url: `${ORIGIN}/room-list`, section: "rooms-booking" },
    { url: `${ORIGIN}/news/winning-dinning`, section: "dining" },
    { url: `${ORIGIN}/news/experiences-feel`, section: "experiences" },
    { url: `${ORIGIN}/news/events`, section: "events" },
    { url: `${ORIGIN}/news/news-list`, section: "news" },
    { url: `${ORIGIN}/gallery`, section: "gallery" },
    { url: `${ORIGIN}/contact`, section: "contact" },
    // Trang chính sách — chứa giờ check-in, quy định hủy phòng, thanh toán.
    { url: `${ORIGIN}/page/huong-dan-nhan-phong-huy-phong`, section: "policy" },
    { url: `${ORIGIN}/page/qui-dianh-chung`, section: "policy" },
    { url: `${ORIGIN}/page/chinh-sach-baao-maat`, section: "policy" },
    { url: `${ORIGIN}/page/phuong-thuc-thanh-toan-va-giao-hang`, section: "policy" },
    { url: `${ORIGIN}/page/huoang-daan-thanh-toaan`, section: "policy" },
];

const IMAGE_BLOCKLIST =
    /(logo|icon|favicon|sprite|placeholder|avatar|1x1|spacer|blank|loading|pixel|bct\.png|squire)/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)(\?|$)/i;

const dedupe = (a) => [...new Set(a)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Bỏ /cache/ và hậu tố -WxH để lấy ảnh gốc full-size. */
const toOriginal = (u) =>
    u.replace("/image/cache/", "/image/").replace(/-\d+x\d+(\.\w+)$/, "$1");

function collectImages(html, pageUrl) {
    const found = [];
    const push = (raw) => {
        if (!raw) return;
        const c = raw.trim().split(/\s+/)[0];
        if (!c || c.startsWith("data:")) return;
        try {
            found.push(new URL(c, pageUrl).href);
        } catch {
            /* URL hỏng thì bỏ qua */
        }
    };

    for (const m of html.matchAll(
        /<img[^>]+?(?:data-(?:src|original|lazy-src)|src)\s*=\s*["']([^"']+)["']/gi
    ))
        push(m[1]);
    for (const m of html.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi))
        for (const p of m[1].split(",")) push(p);
    for (const m of html.matchAll(
        /background-image\s*:\s*url\(\s*["']?([^"')]+)["']?\s*\)/gi
    ))
        push(m[1]);
    for (const m of html.matchAll(/<source[^>]+?src\s*=\s*["']([^"']+)["']/gi)) push(m[1]);
    // link trực tiếp tới file ảnh (lightbox gallery hay dùng)
    for (const m of html.matchAll(/href\s*=\s*["']([^"']+\.(?:jpe?g|png|webp|avif))["']/gi))
        push(m[1]);

    return dedupe(found)
        .filter((u) => IMAGE_EXT.test(u) && !IMAGE_BLOCKLIST.test(u))
        .map(toOriginal)
        .filter((u, i, arr) => arr.indexOf(u) === i);
}

/** Bóc phần <body>, bỏ script/style/nav/footer rồi chuyển thành text sạch. */
function extractText(html) {
    let s = html;
    s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
    s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
    s = s.replace(/<nav[\s\S]*?<\/nav>/gi, " ");
    s = s.replace(/<footer[\s\S]*?<\/footer>/gi, " ");
    s = s.replace(/<header[\s\S]*?<\/header>/gi, " ");
    // Gỡ inline tag (không thay bằng \n) để câu không bị vỡ:
    // "<strong>Giờ nhận phòng</strong>: 14:00" -> "Giờ nhận phòng: 14:00".
    // <br> vẫn thành \n vì nó là ngắt dòng thật, parser phòng dựa vào đó.
    s = s.replace(/<\/?(strong|b|em|i|span|u|small|mark)\b[^>]*>/gi, "");
    s = s.replace(/<[^>]+>/g, "\n");
    s = s
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    return s
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join("\n");
}

function extractHeadings(html) {
    const out = [];
    for (const m of html.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
        const text = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        if (text) out.push({ level: Number(m[1]), text });
    }
    return out;
}

/** Giá VND dạng "1.546.000đ" hoặc "1,546,000 VND". */
function extractPrices(text) {
    const out = [];
    for (const m of text.matchAll(/(\d{1,3}(?:[.,]\d{3}){1,3})\s*(?:đ|vnd|VNĐ|₫)/gi)) {
        const n = Number(m[1].replace(/[.,]/g, ""));
        if (n >= 100_000) out.push(n);
    }
    return dedupe(out);
}

function internalLinks(html, pageUrl) {
    const out = [];
    for (const m of html.matchAll(/href\s*=\s*["']([^"'#]+)["']/gi)) {
        try {
            const u = new URL(m[1], pageUrl).href;
            if (u.startsWith(ORIGIN) && !IMAGE_EXT.test(u)) out.push(u.split("#")[0]);
        } catch {
            /* bỏ qua */
        }
    }
    return dedupe(out);
}

async function fetchPage(url) {
    const r = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (compatible; seed-data-research)" },
        redirect: "follow",
        signal: AbortSignal.timeout(25000),
    });
    const html = await r.text();
    const title = ((html.match(/<title[^>]*>([^<]*)</i) || [])[1] || "")
        .replace(/&amp;/g, "&")
        .trim();
    const desc = (
        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || []
    )[1];
    const text = extractText(html);

    return {
        url,
        status: r.status,
        title,
        description: desc?.trim() ?? "",
        headings: extractHeadings(html),
        text,
        prices: extractPrices(text),
        images: collectImages(html, url),
        links: internalLinks(html, url),
    };
}

async function main() {
    await mkdir(OUTPUT_DIR, { recursive: true });
    const pages = [];
    const visited = new Set();

    // Lượt 1: các trang chính
    for (const { url, section } of SEED_PAGES) {
        const p = await fetchPage(url);
        p.section = section;
        pages.push(p);
        visited.add(url);
        console.error(`[${p.status}] ${String(p.images.length).padStart(3)} imgs  ${section.padEnd(12)} ${url.replace(ORIGIN, "")}`);
        await sleep(400); // lịch sự với server
    }

    // Lượt 2: bài viết con của các trang news (dining/experiences/events/news)
    const articleSections = pages.filter((p) =>
        ["dining", "experiences", "events", "news"].includes(p.section)
    );
    for (const parent of articleSections) {
        const articles = parent.links.filter(
            (l) => /\/article\//.test(l) && !visited.has(l)
        );
        for (const a of articles) {
            visited.add(a);
            const p = await fetchPage(a);
            p.section = parent.section;
            p.parent = parent.url;
            pages.push(p);
            console.error(`[${p.status}] ${String(p.images.length).padStart(3)} imgs  ${("→ " + parent.section).padEnd(12)} ${a.replace(ORIGIN, "").slice(0, 70)}`);
            await sleep(400);
        }
    }

    const allImages = dedupe(pages.flatMap((p) => p.images));

    await writeFile(
        path.join(OUTPUT_DIR, "pages.json"),
        JSON.stringify({ crawledPages: pages.length, totalImages: allImages.length, pages }, null, 2),
        "utf8"
    );

    console.error(`\nTổng: ${pages.length} trang, ${allImages.length} ảnh (đã lọc trùng).`);
    console.error(`Ghi ra: scripts/crawl/output/pages.json`);
}

main().catch((e) => {
    console.error("Thất bại:", e);
    process.exit(1);
});
