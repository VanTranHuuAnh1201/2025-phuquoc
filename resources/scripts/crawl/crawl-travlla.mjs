/**
 * Crawl bộ demo Travlla (Botble) — 5 biến thể trang chủ + toàn bộ trang con.
 *
 * Site render server-side nên chỉ cần fetch kèm header trình duyệt thật
 * (Cloudflare chặn user-agent lạ). Tự đi theo sitemap.xml để lấy đủ URL,
 * rồi bóc full text + toàn bộ ảnh (đã quy về bản gốc, bỏ hậu tố -WxH).
 *
 * Chạy:  node scripts/crawl/crawl-travlla.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const HOSTS = [
    { origin: "https://travlla.botble.com", key: "home-1" },
    { origin: "https://travlla-home-2.botble.com", key: "home-2" },
    { origin: "https://travlla-home-3.botble.com", key: "home-3" },
    { origin: "https://travlla-home-4.botble.com", key: "home-4" },
    { origin: "https://travlla-home-5.botble.com", key: "home-5" },
];

/** Chỉ crawl sâu (mọi trang con) ở host chính; 4 host kia chỉ lấy trang chủ. */
const PRIMARY = HOSTS[0].origin;

const OUTPUT_DIR = path.join(process.cwd(), "scripts", "crawl", "output", "travlla");

const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const HEADERS = {
    "user-agent": UA,
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
};

const IMAGE_BLOCKLIST = /(favicon|sprite|placeholder|1x1|spacer|blank|pixel)/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i;

const dedupe = (a) => [...new Set(a)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Botble sinh thumbnail dạng "1-320x240.jpg". Bỏ hậu tố để lấy ảnh gốc
 * full-size (đã kiểm chứng bản gốc luôn tồn tại trên /storage/).
 */
const toOriginal = (u) => u.replace(/-\d{2,4}x\d{2,4}(\.\w+)(\?|$)/, "$1$2");

/** Phân loại ảnh để bước build-seed map đúng chỗ. */
function classifyImage(u) {
    if (/\/storage\/tours\//.test(u)) return "tour";
    if (/\/storage\/destinations\//.test(u)) return "destination";
    if (/\/storage\/galleries\//.test(u)) return "gallery";
    if (/\/storage\/blog\//.test(u)) return "blog";
    if (/\/storage\/backgrounds\//.test(u)) return "background";
    if (/\/storage\/(team|our-team)\//.test(u)) return "team";
    if (/\/storage\/testimonials\//.test(u)) return "testimonial";
    if (/\/storage\/(partners|brands|clients)\//.test(u)) return "partner";
    if (/\/storage\/services\//.test(u)) return "service";
    if (/logo/i.test(u)) return "logo";
    if (/\/decorations\//.test(u)) return "decoration";
    if (/\/themes\//.test(u)) return "theme-asset";
    return "other";
}

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

    // Botble render thuộc tính không có dấu nháy: src=https://... -> phải bắt cả 2 dạng.
    for (const m of html.matchAll(
        /<img[^>]+?(?:data-(?:src|original|lazy-src|bb-src)|src)\s*=\s*(?:["']([^"']+)["']|([^\s">]+))/gi
    ))
        push(m[1] ?? m[2]);
    for (const m of html.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi))
        for (const p of m[1].split(",")) push(p);
    for (const m of html.matchAll(
        /background-image\s*:\s*url\(\s*["']?([^"')]+)["']?\s*\)/gi
    ))
        push(m[1]);
    for (const m of html.matchAll(
        /<source[^>]+?(?:srcset|src)\s*=\s*(?:["']([^"']+)["']|([^\s">]+))/gi
    ))
        push(m[1] ?? m[2]);
    // link trực tiếp tới file ảnh (lightbox gallery hay dùng)
    for (const m of html.matchAll(
        /href\s*=\s*["']([^"']+\.(?:jpe?g|png|webp|avif))["']/gi
    ))
        push(m[1]);
    // og:image / twitter:image
    for (const m of html.matchAll(
        /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi
    ))
        push(m[1]);

    return dedupe(found)
        .filter((u) => IMAGE_EXT.test(u) && !IMAGE_BLOCKLIST.test(u))
        .map(toOriginal)
        .filter((u, i, arr) => arr.indexOf(u) === i);
}

function decodeEntities(s) {
    return s
        .replace(/&nbsp;/g, " ")
        .replace(/&#0?39;|&rsquo;|&apos;/g, "'")
        .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
        .replace(/&ndash;/g, "–")
        .replace(/&mdash;/g, "—")
        .replace(/&hellip;/g, "…")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&amp;/g, "&");
}

/**
 * Phần <main> mới là nội dung thật. Botble nhét menu, filter sidebar và
 * language/currency switcher vào header nên phải cắt bỏ, nếu không mọi trang
 * đều lặp lại cùng một khối boilerplate ~80 dòng.
 */
function mainHtml(html) {
    const m =
        html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) ||
        html.match(/<div[^>]+class=["'][^"']*\bpage-content\b[^"']*["'][^>]*>([\s\S]*)/i);
    return m ? m[1] : html;
}

/** Bóc phần body, bỏ script/style/nav/footer rồi chuyển thành text sạch. */
function extractText(html) {
    let s = html;
    s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
    s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
    s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
    s = s.replace(/<svg[\s\S]*?<\/svg>/gi, " ");
    s = s.replace(/<nav[\s\S]*?<\/nav>/gi, " ");
    s = s.replace(/<footer[\s\S]*?<\/footer>/gi, " ");
    // Gỡ inline tag (không thay bằng \n) để câu không bị vỡ giữa chừng.
    s = s.replace(/<\/?(strong|b|em|i|span|u|small|mark|a)\b[^>]*>/gi, "");
    s = s.replace(/<[^>]+>/g, "\n");
    s = decodeEntities(s);
    return s
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join("\n");
}

function extractHeadings(html) {
    const out = [];
    for (const m of html.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
        const text = decodeEntities(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
        if (text) out.push({ level: Number(m[1]), text });
    }
    return out;
}

/** Giá USD/EUR dạng "$1,299" hoặc "1,299.00 USD". */
function extractPrices(text) {
    const out = [];
    for (const m of text.matchAll(/[$€£]\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g)) {
        const n = Number(m[1].replace(/,/g, ""));
        if (n > 0) out.push(n);
    }
    return dedupe(out);
}

function internalLinks(html, origin, pageUrl) {
    const out = [];
    for (const m of html.matchAll(/href\s*=\s*(?:["']([^"'#]+)["']|([^\s">#]+))/gi)) {
        const raw = m[1] ?? m[2];
        try {
            const u = new URL(raw, pageUrl).href;
            if (
                u.startsWith(origin) &&
                !IMAGE_EXT.test(u) &&
                !/\.(css|js|xml|ico|woff2?|ttf|zip|pdf)(\?|$)/i.test(u)
            )
                out.push(u.split("#")[0]);
        } catch {
            /* bỏ qua */
        }
    }
    return dedupe(out);
}

/** JSON-LD chứa dữ liệu tour có cấu trúc (giá, rating, địa điểm). */
function extractJsonLd(html) {
    const out = [];
    for (const m of html.matchAll(
        /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    )) {
        try {
            out.push(JSON.parse(m[1].trim()));
        } catch {
            /* JSON hỏng thì bỏ qua */
        }
    }
    return out;
}

async function fetchPage(url, origin, { retries = 2 } = {}) {
    for (let attempt = 0; ; attempt++) {
        try {
            const r = await fetch(url, {
                headers: HEADERS,
                redirect: "follow",
                signal: AbortSignal.timeout(30000),
            });
            const html = await r.text();
            const title = ((html.match(/<title[^>]*>([^<]*)</i) || [])[1] || "")
                .replace(/&amp;/g, "&")
                .trim();
            const desc = (html.match(
                /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
            ) || [])[1];
            const text = extractText(html);
            // mainText: chỉ nội dung trong <main>, đã bỏ menu/filter/switcher lặp lại.
            const mainText = extractText(mainHtml(html));
            const images = collectImages(html, url);

            return {
                url,
                status: r.status,
                title: decodeEntities(title),
                description: decodeEntities(desc?.trim() ?? ""),
                headings: extractHeadings(mainHtml(html)),
                mainText,
                text,
                prices: extractPrices(text),
                images,
                imagesByKind: images.reduce((acc, u) => {
                    (acc[classifyImage(u)] ||= []).push(u);
                    return acc;
                }, {}),
                jsonLd: extractJsonLd(html),
                // Giữ lại HTML của <main> để build-seed bóc các cấu trúc mà
                // text phẳng không phân biệt được (vd includes vs excludes chỉ
                // khác nhau ở class icon check/x).
                html: mainHtml(html),
                links: internalLinks(html, origin, url),
            };
        } catch (e) {
            if (attempt >= retries) {
                console.error(`  ! lỗi ${url}: ${e.message}`);
                return { url, status: 0, error: String(e.message), images: [], links: [], text: "" };
            }
            await sleep(1500 * (attempt + 1));
        }
    }
}

/** Lấy toàn bộ URL từ sitemap index (sitemap.xml -> các file .xml con -> loc). */
async function sitemapUrls(origin) {
    const grab = async (u) => {
        try {
            const r = await fetch(u, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
            const xml = await r.text();
            return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
        } catch {
            return [];
        }
    };

    const root = await grab(`${origin}/sitemap.xml`);
    const urls = [];
    // Sitemap index lồng 2 tầng: /sitemap.xml -> /en/sitemap.xml -> /tours.xml
    for (const lvl1 of root.filter((u) => u.endsWith(".xml"))) {
        // chỉ lấy bản tiếng Anh, bỏ /ar /vi /fr cho gọn
        if (/\/(ar|vi|fr)\/sitemap\.xml$/.test(lvl1)) continue;
        for (const lvl2 of await grab(lvl1)) {
            if (lvl2.endsWith(".xml")) urls.push(...(await grab(lvl2)));
            else urls.push(lvl2);
        }
    }
    return dedupe(urls.filter((u) => u.startsWith(origin) && !u.endsWith(".xml")));
}

/** Gán section từ đường dẫn để build-seed nhóm dữ liệu. */
function sectionOf(url, origin) {
    const p = url.replace(origin, "").split("?")[0].replace(/\/$/, "") || "/";
    if (p === "/") return "home";
    const seg = p.split("/").filter(Boolean);
    const map = {
        tours: seg.length > 1 ? "tour-detail" : "tours",
        destinations: seg.length > 1 ? "destination-detail" : "destinations",
        blog: seg.length > 1 ? "blog-post" : "blog",
        galleries: "gallery-detail",
        gallery: "gallery",
        services: seg.length > 1 ? "service-detail" : "services",
        "our-team": "team",
        testimonials: "testimonials",
        "about-us": "about",
        contact: "contact",
        faqs: "faqs",
        pricing: "pricing",
        "privacy-policy": "policy",
        "terms-conditions": "policy",
    };
    return map[seg[0]] ?? "page";
}

async function main() {
    await mkdir(OUTPUT_DIR, { recursive: true });

    const pages = [];
    const visited = new Set();

    // --- 1. Trang chủ của cả 5 biến thể ---
    for (const { origin, key } of HOSTS) {
        const p = await fetchPage(`${origin}/`, origin);
        p.section = "home";
        p.variant = key;
        p.origin = origin;
        pages.push(p);
        visited.add(`${origin}/`);
        console.error(
            `[${p.status}] ${String(p.images.length).padStart(3)} imgs  ${key.padEnd(16)} ${origin}`
        );
        await sleep(500);
    }

    // --- 2. Toàn bộ trang con của host chính (theo sitemap + link trang chủ) ---
    const fromSitemap = await sitemapUrls(PRIMARY);
    const fromHome = pages.find((p) => p.origin === PRIMARY).links;
    // Sitemap trả "https://host" còn link trả "https://host/" -> chuẩn hoá
    // để trang chủ không bị crawl lại lần 2.
    const norm = (u) => (u.replace(/\/+$/, "") || u) + (new URL(u).pathname === "/" ? "/" : "");
    const targets = dedupe([...fromSitemap, ...fromHome].map(norm))
        .filter((u) => !visited.has(u))
        // bỏ các biến thể layout trùng nội dung (?layout=grid, ?style=list...)
        .filter((u) => !/[?&](layout|style|sidebar|page)=/.test(u))
        .filter((u) => !/\/(currency|language)\/switch\//.test(u))
        .filter((u) => !/\/(ar|vi|fr)(\/|$)/.test(u))
        .filter((u) => !/\/(coming-soon|error-404|compare|cart|checkout|login|register)(\/|$)/.test(u));

    console.error(`\nCrawl ${targets.length} trang con của ${PRIMARY}\n`);

    for (const url of targets) {
        if (visited.has(url)) continue;
        visited.add(url);
        const p = await fetchPage(url, PRIMARY);
        p.section = sectionOf(url, PRIMARY);
        p.variant = "home-1";
        p.origin = PRIMARY;
        pages.push(p);
        console.error(
            `[${p.status}] ${String(p.images.length).padStart(3)} imgs  ${p.section.padEnd(20)} ${url.replace(PRIMARY, "")}`
        );
        await sleep(350); // lịch sự với server
    }

    const allImages = dedupe(pages.flatMap((p) => p.images));
    const byKind = allImages.reduce((acc, u) => {
        const k = classifyImage(u);
        acc[k] = (acc[k] ?? 0) + 1;
        return acc;
    }, {});

    await writeFile(
        path.join(OUTPUT_DIR, "pages.json"),
        JSON.stringify(
            {
                source: HOSTS.map((h) => h.origin),
                crawledAt: new Date().toISOString(),
                crawledPages: pages.length,
                totalImages: allImages.length,
                imagesByKind: byKind,
                pages,
            },
            null,
            2
        ),
        "utf8"
    );

    await writeFile(
        path.join(OUTPUT_DIR, "images.json"),
        JSON.stringify({ total: allImages.length, byKind, images: allImages }, null, 2),
        "utf8"
    );

    console.error(`\nTổng: ${pages.length} trang, ${allImages.length} ảnh (đã lọc trùng).`);
    console.error(
        Object.entries(byKind)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => `  ${k}: ${v}`)
            .join("\n")
    );
    console.error(`Ghi ra: scripts/crawl/output/travlla/pages.json`);
}

main().catch((e) => {
    console.error("Thất bại:", e);
    process.exit(1);
});
