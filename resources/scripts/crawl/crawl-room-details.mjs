/**
 * Cào chi tiết từng hạng phòng qua endpoint AJAX của modal "Xem chi tiết".
 *
 * Trang /collections/rooms-suites chỉ render danh sách; nội dung chi tiết
 * (mô tả dài, quyền lợi & tiện nghi, hướng tầm nhìn, điều kiện phòng và
 * gallery ~12 ảnh) được nạp bằng AJAX khi click. Script này gọi thẳng endpoint:
 *
 *     index.php?route=booking/roomlist.popup&language=vi&product_id=<id>
 *
 * Chạy: node scripts/crawl/crawl-room-details.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ORIGIN = "https://thenamduhill.com";
const OUT = path.join(HERE, "output");
const LIST_URL = `${ORIGIN}/collections/rooms-suites`;

const dedupe = (a) => [...new Set(a)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Bỏ /cache/ và hậu tố -WxH để lấy ảnh gốc full-size. */
const toOriginal = (u) =>
    u.replace("/image/cache/", "/image/").replace(/-\d+x\d+(\.\w+)$/, "$1");

const IMAGE_BLOCKLIST = /(logo|icon|favicon|sprite|placeholder|avatar|bct\.png)/i;

async function get(url) {
    const r = await fetch(url, {
        headers: {
            "user-agent": "Mozilla/5.0 (compatible; seed-data-research)",
            "x-requested-with": "XMLHttpRequest",
        },
        signal: AbortSignal.timeout(25000),
    });
    return { status: r.status, html: await r.text() };
}

/** Gỡ tag, giữ ngắt dòng theo block để phân đoạn được các mục. */
function toLines(html) {
    let s = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ");
    // inline tag gỡ thẳng để câu không bị vỡ
    s = s.replace(/<\/?(strong|b|em|i|span|u|small|mark|a)\b[^>]*>/gi, "");
    s = s.replace(/<br\s*\/?>/gi, "\n");
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
        .map((l) => l.replace(/\s+/g, " ").trim())
        .filter(Boolean);
}

/**
 * Tách nội dung modal thành các mục.
 *
 * Cấu trúc thực tế trên site (thứ tự không cố định, có phòng lặp mục):
 *   <tên phòng> / <tóm tắt> / <mô tả dài>
 *   QUYỀN LỢI & TIỆN NGHI  -> danh sách gạch đầu dòng
 *   HƯỚNG TẦM NHÌN         -> 1-2 dòng
 *   ĐIỀU KIỆN PHÒNG        -> thường "Không hút thuốc"
 */
function parseDetail(lines) {
    const isHeading = (l) =>
        /^(QUYỀN LỢI|HƯỚNG TẦM NHÌN|ĐIỀU KIỆN PHÒNG|Điều kiện phòng|Hút thuốc)/i.test(l);

    const amenities = [];
    const views = [];
    const conditions = [];
    const descParts = [];

    let current = "desc";
    for (const raw of lines) {
        const l = raw.replace(/^[-–•]\s*/, "").trim();
        if (!l) continue;

        if (/^QUYỀN LỢI/i.test(raw)) { current = "amenity"; continue; }
        // Một số phòng (#10, #12) dùng format khác: không có heading QUYỀN LỢI
        // mà liệt kê theo nhóm "Tiện nghi:", "Trong phòng tắm riêng của bạn:".
        if (/^(Tiện nghi|Trong phòng tắm riêng của bạn|Phòng tắm|Tiện ích)\s*:?\s*$/i.test(raw)) {
            current = "amenity";
            continue;
        }
        if (/^HƯỚNG TẦM NHÌN/i.test(raw)) { current = "view"; continue; }
        if (/^(ĐIỀU KIỆN PHÒNG|Điều kiện phòng|Hút thuốc)/i.test(raw)) {
            current = "condition";
            // "Hút thuốc: Không hút thuốc" — phần sau dấu : là nội dung
            const inline = raw.split(":").slice(1).join(":").trim();
            if (inline) conditions.push(inline);
            continue;
        }
        if (isHeading(raw)) continue;

        // "Tiện nghi:" xuất hiện giữa mục HƯỚNG TẦM NHÌN của #10/#12 —
        // chuyển sang gom tiện nghi thay vì tiếp tục nhồi vào view.
        if (/^(Tiện nghi|Trong phòng tắm riêng của bạn)\s*:/i.test(l)) {
            current = "amenity";
            continue;
        }

        if (current === "amenity") amenities.push(l);
        else if (current === "view") views.push(l);
        else if (current === "condition") conditions.push(l);
        else descParts.push(l);
    }

    return {
        amenities: dedupe(amenities),
        views: dedupe(views),
        conditions: dedupe(conditions),
        descParts,
    };
}

async function main() {
    console.error("Đang lấy danh sách product-id...");
    const list = await get(LIST_URL);

    // Ghép product-id với số phòng: cả hai nằm trong cùng một card.
    const cards = list.html.split('class="room-thumb-list-1');
    const entries = [];
    for (const c of cards.slice(1)) {
        const id = (c.match(/data-product-id="(\d+)"/) || [])[1];
        const rn = (c.match(/#([\dA-Za-z-]+)<\/span>/) || [])[1];
        const name = (c.match(/text-secondery">([^<]+?)\s*-\s*<span/) || [])[1];
        if (id) entries.push({ id, roomNumber: rn ?? "", name: (name ?? "").trim() });
    }

    console.error(`Tìm thấy ${entries.length} phòng.\n`);

    const details = [];
    for (const e of entries) {
        const url = `${ORIGIN}/index.php?route=booking/roomlist.popup&language=vi&product_id=${e.id}`;
        const { status, html } = await get(url);

        const images = dedupe(
            [...html.matchAll(/<img[^>]+src\s*=\s*["']([^"']+)["']/gi)].map((m) => {
                try {
                    return toOriginal(new URL(m[1], ORIGIN).href);
                } catch {
                    return "";
                }
            })
        ).filter((u) => u && !IMAGE_BLOCKLIST.test(u));

        const parsed = parseDetail(toLines(html));

        details.push({ ...e, url, status, images, ...parsed });
        console.error(
            `[${status}] #${(e.roomNumber || "?").padEnd(6)} id=${e.id.padEnd(4)} ` +
                `${String(images.length).padStart(2)}img ` +
                `${String(parsed.amenities.length).padStart(2)}tiện-nghi  ${e.name.slice(0, 42)}`
        );
        await sleep(400);
    }

    await writeFile(
        path.join(OUT, "room-details.json"),
        JSON.stringify({ count: details.length, details }, null, 2),
        "utf8"
    );

    const totalImgs = dedupe(details.flatMap((d) => d.images)).length;
    console.error(`\nTổng: ${details.length} phòng, ${totalImgs} ảnh (đã lọc trùng).`);
    console.error("Ghi ra: scripts/crawl/output/room-details.json");
}

main().catch((e) => {
    console.error("Thất bại:", e);
    process.exit(1);
});
