/**
 * Cào toàn bộ website: BFS theo link nội bộ, tự discover trang mới.
 *
 * Khác với crawl-pages.mjs (chạy theo danh sách SEED_PAGES cố định), script này
 * bắt đầu từ trang chủ và đi theo mọi link cùng domain cho tới khi hết.
 *
 * Chỉ GET các trang nội dung. KHÔNG gọi các route ghi dữ liệu của hệ thống đặt
 * phòng (bookingcart.add, checkout.submit, ...) — đó là hành động lên hệ thống
 * của họ, không phải nội dung để đọc.
 *
 * Chạy: node scripts/crawl/crawl-full-site.mjs [--limit 200]
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://thenamduhill.com";
const OUT = path.join(process.cwd(), "scripts", "crawl", "output");

const dedupe = (a) => [...new Set(a)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const IMAGE_BLOCKLIST =
    /(logo|icon|favicon|sprite|placeholder|avatar|1x1|spacer|blank|loading|pixel|bct\.png|squire)/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)(\?|$)/i;

/** Route ghi dữ liệu — tuyệt đối không gọi. */
const WRITE_ROUTES =
    /route=(booking\/(bookingcart|checkout)|account|checkout|cart)/i;

/** Đuôi file không phải trang HTML. */
const NON_PAGE = /\.(css|js|jpe?g|png|webp|avif|gif|svg|ico|pdf|zip|xml|json)(\?|$)/i;

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
            /* URL hỏng */
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
    for (const m of html.matchAll(/href\s*=\s*["']([^"']+\.(?:jpe?g|png|webp|avif))["']/gi))
        push(m[1]);

    return dedupe(found)
        .filter((u) => IMAGE_EXT.test(u) && !IMAGE_BLOCKLIST.test(u))
        .map(toOriginal)
        .filter((u, i, arr) => arr.indexOf(u) === i);
}

function extractText(html) {
    let s = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
        .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
        .replace(/<header[\s\S]*?<\/header>/gi, " ");
    // gỡ inline tag để câu không vỡ; <br> vẫn là ngắt dòng thật
    s = s.replace(/<\/?(strong|b|em|i|span|u|small|mark)\b[^>]*>/gi, "");
    s = s.replace(/<[^>]+>/g, "\n");
    s = s
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/​/g, "");
    return s
        .split("\n")
        .map((l) => l.replace(/[ \t]+/g, " ").trim())
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
    for (const m of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
        const raw = m[1];
        if (/^(javascript:|mailto:|tel:|callto:|#)/i.test(raw)) continue;
        try {
            const u = new URL(raw, pageUrl);
            if (u.origin !== ORIGIN) continue;
            const clean = u.origin + u.pathname + u.search;
            if (NON_PAGE.test(clean) || WRITE_ROUTES.test(clean)) continue;
            // template chưa render lọt vào HTML, vd href="{{ base }}"
            if (/[{}]|%7B|%7D/i.test(clean)) continue;
            out.push(clean);
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
    const description = (
        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || []
    )[1];
    const text = extractText(html);

    return {
        url,
        status: r.status,
        title,
        description: description?.trim() ?? "",
        headings: extractHeadings(html),
        text,
        prices: extractPrices(text),
        images: collectImages(html, url),
        links: internalLinks(html, url),
        productIds: dedupe(
            [...html.matchAll(/data-product-id="(\d+)"/g)].map((m) => m[1])
        ),
    };
}

async function main() {
    const argv = process.argv.slice(2);
    const li = argv.indexOf("--limit");
    const LIMIT = li !== -1 ? Number(argv[li + 1]) : 300;

    await mkdir(OUT, { recursive: true });

    const queue = [`${ORIGIN}/`];
    const seen = new Set(queue);
    const pages = [];

    while (queue.length && pages.length < LIMIT) {
        const url = queue.shift();
        let p;
        try {
            p = await fetchPage(url);
        } catch (e) {
            console.error(`[ERR] ${e.name.padEnd(14)} ${url.replace(ORIGIN, "")}`);
            continue;
        }
        pages.push(p);

        let added = 0;
        for (const l of p.links) {
            if (!seen.has(l)) {
                seen.add(l);
                queue.push(l);
                added++;
            }
        }

        console.error(
            `[${p.status}] ${String(p.images.length).padStart(3)}img ` +
                `+${String(added).padStart(2)}link  q=${String(queue.length).padStart(3)}  ` +
                `${(url.replace(ORIGIN, "") || "/").slice(0, 62)}`
        );
        await sleep(350); // lịch sự với server
    }

    const allImages = dedupe(pages.flatMap((p) => p.images));
    const allProductIds = dedupe(pages.flatMap((p) => p.productIds));

    await writeFile(
        path.join(OUT, "full-site.json"),
        JSON.stringify(
            {
                crawledAt: null, // stamp sau khi chạy nếu cần
                crawledPages: pages.length,
                totalImages: allImages.length,
                productIds: allProductIds,
                pages,
            },
            null,
            2
        ),
        "utf8"
    );

    console.error(
        `\nTổng: ${pages.length} trang, ${allImages.length} ảnh, ` +
            `${allProductIds.length} product-id.`
    );
    if (queue.length) console.error(`Còn ${queue.length} URL chưa cào (chạm --limit).`);
    console.error("Ghi ra: scripts/crawl/output/full-site.json");
}

main().catch((e) => {
    console.error("Thất bại:", e);
    process.exit(1);
});
