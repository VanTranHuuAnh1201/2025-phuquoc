// Tải ảnh từ kết quả crawl về đĩa để Claude xem được bằng tool Read.
//
//   node download-images.mjs [file-json] [thư-mục-đích] [--max=N]
//
// Mặc định: đọc output/full-site.json, tải vào output/assets/<host>/.
// Chấp nhận mọi file JSON của bộ crawl (full-site.json, travlla/images.json…):
// script quét đệ quy toàn bộ chuỗi trong JSON, lấy URL có đuôi ảnh.
//
// ⚠️ Ảnh tải về là nội dung bên thứ ba — chỉ dùng để chọn lọc/dựng cấu trúc
// ở môi trường dev (luật R9), không đưa vào đường dẫn production.

import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)(\?|$)/i;
const BLOCKLIST =
    /(logo|icon|favicon|sprite|placeholder|avatar|1x1|spacer|blank|loading|pixel)/i;
const CONCURRENCY = 8;

const args = process.argv.slice(2);
const maxArg = args.find((a) => a.startsWith("--max="));
const MAX = maxArg ? Number(maxArg.split("=")[1]) : Infinity;
const positional = args.filter((a) => !a.startsWith("--"));
const inputFile = positional[0] ?? join(HERE, "output", "thenamduhill", "thenamduhill.full-site.json");
const outRoot = positional[1] ?? join(HERE, "output", "thenamduhill", "assets");

function collectUrls(node, found) {
    if (typeof node === "string") {
        if (IMAGE_EXT.test(node) && /^https?:\/\//.test(node) && !BLOCKLIST.test(node))
            found.add(node.split("#")[0]);
    } else if (Array.isArray(node)) node.forEach((n) => collectUrls(n, found));
    else if (node && typeof node === "object")
        Object.values(node).forEach((n) => collectUrls(n, found));
}

function localName(url) {
    const u = new URL(url);
    const base = u.pathname.split("/").filter(Boolean).join("_") || "anh";
    // giữ tên đọc được, thêm hash ngắn chống trùng
    let h = 0;
    for (const c of url) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const ext = base.match(IMAGE_EXT)?.[0] ?? ".jpg";
    return `${base.replace(IMAGE_EXT, "")}_${h.toString(36)}${ext}`;
}

const json = JSON.parse(await readFile(inputFile, "utf8"));
const urls = new Set();
collectUrls(json, urls);
const list = [...urls].slice(0, MAX);
console.log(`Tìm thấy ${urls.size} URL ảnh trong ${inputFile}, tải ${list.length}…`);

let ok = 0,
    fail = 0,
    skip = 0;
const manifest = [];

async function fetchOne(url) {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const dir = join(outRoot, host);
    await mkdir(dir, { recursive: true });
    const file = join(dir, localName(url));
    try {
        await access(file);
        skip++;
        manifest.push({ url, file });
        return; // đã có, bỏ qua
    } catch {}
    try {
        const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 5_000) throw new Error("quá nhỏ, có thể là ảnh rác");
        await writeFile(file, buf);
        manifest.push({ url, file, bytes: buf.length });
        ok++;
        if (ok % 20 === 0) console.log(`  đã tải ${ok}/${list.length}`);
    } catch (e) {
        fail++;
        console.warn(`  lỗi ${url}: ${e.message}`);
    }
}

for (let i = 0; i < list.length; i += CONCURRENCY)
    await Promise.all(list.slice(i, i + CONCURRENCY).map(fetchOne));

await mkdir(outRoot, { recursive: true });
await writeFile(
    join(outRoot, "manifest.json"),
    JSON.stringify({ source: inputFile, downloadedAt: new Date().toISOString(), items: manifest }, null, 2)
);
console.log(`Xong: ${ok} tải mới, ${skip} đã có, ${fail} lỗi → ${outRoot}`);
