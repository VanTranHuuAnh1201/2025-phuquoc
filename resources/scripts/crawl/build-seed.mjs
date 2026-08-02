/**
 * Chuyển output của crawl-pages.mjs thành seed data có cấu trúc theo từng section.
 *
 * Chạy: node scripts/crawl/build-seed.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ORIGIN = "https://thenamduhill.com";
const OUT = path.join(HERE, "output");

const data = JSON.parse(await readFile(path.join(OUT, "pages.json"), "utf8"));
const page = (s) => data.pages.find((p) => p.section === s && !p.parent);
const children = (s) => data.pages.filter((p) => p.section === s && p.parent);
const dedupe = (a) => [...new Set(a)];

/* ---------- Phòng ---------- */

/**
 * Suy ra số khách tối đa. Ưu tiên con số ghi rõ trong tên phòng (vd "Suite 02
 * phòng ngủ (08 khách)") rồi mới tới mô tả, cuối cùng mới đoán theo số giường.
 */
function capacityOf(name, blob) {
    const all = `${name} ${blob}`;
    const explicit =
        all.match(/\((\d+)\s*khách\)/i) ||        // "(08 khách)"
        all.match(/Tối đa (\d+) người/i) ||        // "Tối đa 4 người"
        all.match(/Gia đình (\d+) khách/i) ||      // "Gia đình 4 khách"
        all.match(/Phòng (\d+) người/i) ||         // "Phòng 03 người"
        all.match(/(\d+)\s*khách\b/i);
    if (explicit) return Number(explicit[1]);

    // Đoán theo cấu hình giường: mỗi giường đôi 2 khách, giường đơn 1 khách.
    const doubles = Number((blob.match(/(\d+)\s*giường đôi/i) || [])[1] || 0);
    const singles = Number((blob.match(/(\d+)\s*giường đơn/i) || [])[1] || 0);
    const guess = doubles * 2 + singles;
    return guess || 2;
}

// Block phòng trong text: "Tên - \n #01 \n mô tả... \n 1.886.000đ"
function parseRooms(text) {
    const lines = text.split("\n").map((l) => l.trim());
    const rooms = [];

    for (let i = 0; i < lines.length; i++) {
        // "Phòng gia đình nhìn ra biển - #01"  (tên và số phòng cùng dòng)
        const m = lines[i].match(/^(.+?)\s*-\s*#(.+)$/);
        if (!m) continue;
        const rn = [null, m[2]];

        // gom mô tả tới khi gặp "Xem chi tiết"
        const desc = [];
        let j = i + 1;
        while (j < lines.length && !/^Xem chi tiết$/i.test(lines[j])) {
            if (lines[j]) desc.push(lines[j]);
            j++;
        }
        // giá nằm sau "Xem chi tiết", dạng "1.886.000đ / Đêm"
        const priceLine = lines.slice(j, j + 3).find((l) => /[\d.]+\s*đ/i.test(l));
        const price = Number(
            (priceLine?.match(/([\d.]+)\s*đ/i) || [])[1]?.replace(/\./g, "") || 0
        );

        const blob = desc.join(" ");
        rooms.push({
            name: m[1].trim(),
            roomNumber: rn[1].trim(),
            description: blob,
            size: (blob.match(/(\d+)\s*m2/i) || [])[1]
                ? `${(blob.match(/(\d+)\s*m2/i) || [])[1]}m²`
                : "",
            capacity: capacityOf(m[1].trim(), blob),
            extraBedFee: Number(
                (blob.match(/Phụ thu(?: giường phụ)? ([\d.]+)đ/i) || [])[1]?.replace(/\./g, "")
            ) || 0,
            // thung lũng kiểm tra trước vì mô tả thường là "thung lũng/ biển"
            view: /thung lũng/i.test(`${m[1]} ${blob}`)
                ? "Hướng thung lũng / biển"
                : /vườn/i.test(blob)
                  ? "Hướng vườn"
                  : /biển/i.test(blob)
                    ? "Hướng biển"
                    : "",
            hasBalcony: /ban công/i.test(blob),
            price,
        });
        i = j;
    }
    return rooms;
}

/* ---------- Ảnh phòng: map theo số phòng trong đường dẫn ---------- */

const FOLDER_TO_ROOM = {
    "1-phong-gia-dinh-nhin-ra-view-bien": "01",
    "2-phong-giuong-doi-nhin-ra-vuon": "02",
    "3-4-phong-giuong-doi-co-ban-cong-nhin-ra-bien": "03-04",
    "5-phong-tieu-chuan-luc-giac": "05",
    "6-phong-deluxe": "06",
    "7-phong-superior-co-giuong-co-king": "07",
    "8-phong-sute-02-phong-ngu": "08",
    "9-phong-sute-02-phong-ngu": "09",
    "10-phong-giuong-doi-co-san-trong": "10",
    "11-phong-gia-dinh-view-bien": "11",
    "12-phong-giuong-doi-co-ban-cong": "12",
    "13-second-floor-family-with-sea-view": "13",
    "14-rock-deluxe-room": "14",
    "15-phong-giuong-doi": "15",
    "16-first-floor-family-with-sea-view": "16",
    "17-phong-03-nguoi-view-bien": "17",
    "18-phong-03-nguoi-co-ban-cong": "18",
    "8-9-suite-02-phong-ngu-8-khach": "08-09",
    "10-11-suite-6-khach": "10-11",
    "15-16-suite-6-khach": "15-16",
};

function roomImages(images) {
    const byRoom = {};
    for (const u of images) {
        const m = u.match(/room-suite\/([^/]+)\//);
        if (!m) continue;
        const rn = FOLDER_TO_ROOM[m[1]];
        if (!rn) continue;
        (byRoom[rn] ||= []).push(u);
    }
    return byRoom;
}

/* ---------- Build ---------- */

const roomsPage = page("rooms");
const rooms = parseRooms(roomsPage.text);
const imgsByRoom = roomImages(roomsPage.images);

const slug = (s) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

/* ---------- Chi tiết phòng (từ modal AJAX) ---------- */

let roomDetails = {};
try {
    const raw = JSON.parse(
        await readFile(path.join(OUT, "room-details.json"), "utf8")
    );
    for (const d of raw.details) roomDetails[d.roomNumber] = d;
} catch {
    console.warn(
        "Chưa có room-details.json — chạy `node scripts/crawl/crawl-room-details.mjs` để lấy chi tiết phòng."
    );
}

const roomTypes = rooms.map((r) => {
    const detail = roomDetails[r.roomNumber];
    // Mô tả dài nằm trong descParts; lấy các đoạn văn thật (>80 ký tự).
    const longDesc = (detail?.descParts ?? []).filter((p) => p.length > 80);

    return {
        id: `${slug(r.name)}-${slug(r.roomNumber)}`,
        name: r.name,
        roomNumber: r.roomNumber,
        /** Tóm tắt ngắn hiển thị ở card danh sách. */
        summary: r.description,
        /** Mô tả dài từ trang chi tiết, mỗi phần tử là một đoạn. */
        description: longDesc,
        size: r.size,
        /** Diện tích ghi trong mô tả chi tiết — chính xác hơn ở danh sách. */
        detailSize: (longDesc.join(" ").match(/khoảng\s*(\d+)\s*m2/i) || [])[1]
            ? `${(longDesc.join(" ").match(/khoảng\s*(\d+)\s*m2/i) || [])[1]}m²`
            : "",
        capacity: r.capacity,
        price: r.price,
        extraBedFee: r.extraBedFee,
        view: r.view,
        /** Hướng tầm nhìn ghi rõ trên trang chi tiết. */
        viewDetail: detail?.views ?? [],
        // Tóm tắt thường không nhắc ban công dù mô tả chi tiết có ("Phòng có
        // ban công riêng") — xét cả hai nguồn.
        hasBalcony: r.hasBalcony || /ban công/i.test(longDesc.join(" ")),
        /** Quyền lợi & tiện nghi từ trang chi tiết. */
        amenities: detail?.amenities ?? [],
        /** Điều kiện phòng (vd "Không hút thuốc"). */
        conditions: detail?.conditions ?? [],
        /** Ảnh cover ở trang danh sách + gallery từ trang chi tiết. */
        images: dedupe([
            ...(imgsByRoom[r.roomNumber] ?? []),
            ...(detail?.images ?? []),
        ]),
        availability: true,
    };
});

/**
 * Lấy đoạn văn nội dung, bỏ breadcrumb, footer và tiêu đề bài viết liên quan
 * (các trang news chèn tiêu đề bài con vào cuối body).
 */
function bodyParagraphs(text, title, excludeTitles = []) {
    const skip =
        /^(Trang chủ|\/|Back to Top|Xem chi tiết|Chọn|DCWEB\.VN|The Nam Du Hill Resort ©|Ngày nhận phòng|Ngày trả phòng|Số phòng|Khách|Kiểm tra|Đọc tiếp|Xem thêm)$/i;
    const excluded = new Set(excludeTitles);
    return text
        .split("\n")
        .map((l) => l.trim())
        .filter(
            (l) =>
                l &&
                !skip.test(l) &&
                l !== title &&
                !excluded.has(l) &&
                // đoạn văn thật luôn có dấu câu; tiêu đề thì không
                l.length > 60 &&
                /[.,;:]/.test(l)
        );
}

/* ---------- Chính sách ---------- */

const policyPages = data.pages.filter((p) => p.section === "policy");
const policyText = policyPages.map((p) => p.text).join("\n");

/** Bắt "Giờ nhận phòng (Check-in): Từ 14:00" -> "14:00". */
function firstMatch(re, fallback = "") {
    const m = policyText.match(re);
    return m ? m[1].trim() : fallback;
}

const policies = {
    checkIn: firstMatch(/Giờ nhận phòng[^:]*:\s*(?:Từ\s*)?(\d{1,2}:\d{2})/i),
    checkOut: firstMatch(
        /Giờ trả phòng[^:]*:\s*(?:Từ\s*)?(\d{1,2}:\d{2}(?:\s*đến\s*\d{1,2}:\d{2})?)/i
    ),
    cancellation:
        policyPages
            .find((p) => p.url.includes("nhan-phong-huy-phong"))
            ?.text.split("\n")
            .find((l) => /hủy miễn phí/i.test(l)) ?? "",
    children:
        policyText.split("\n").find((l) => /Phù hợp cho trẻ em/i.test(l)) ?? "",
    // "Nôi và giường phụ" là tiêu đề riêng một dòng; nội dung nằm ở dòng kế.
    extraBed: (() => {
        const lines = policyText.split("\n");
        const i = lines.findIndex((l) => /^Nôi và giường phụ$/i.test(l.trim()));
        return i >= 0 ? (lines[i + 1] ?? "").trim() : "";
    })(),
    smoking: policyText.split("\n").find((l) => /Không hút thuốc/i.test(l)) ?? "",
    quietHours: policyText.split("\n").find((l) => /22:00/.test(l)) ?? "",
    /** Toàn văn từng trang chính sách, để hiển thị trang /terms, /privacy. */
    pages: policyPages.map((p) => ({
        title: p.title,
        url: p.url.replace(ORIGIN, ""),
        paragraphs: p.text
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 50 && !/Back to Top|DCWEB|©/.test(l)),
    })),
};

/* ---------- Thanh toán ---------- */

const paymentPage = policyPages.find((p) => p.url.includes("huoang-daan-thanh-toaan"));
const paymentMethods = [];
if (paymentPage) {
    const line = paymentPage.text
        .split("\n")
        .find((l) => /chấp nhận các hình thức thanh toán/i.test(l));
    if (line) {
        for (const [re, label] of [
            [/thẻ tín dụng/i, "Thẻ tín dụng"],
            [/thẻ ghi nợ/i, "Thẻ ghi nợ"],
            [/tiền mặt/i, "Tiền mặt"],
            [/chuyển khoản/i, "Chuyển khoản"],
            [/momo/i, "Ví MoMo"],
        ]) {
            if (re.test(line)) paymentMethods.push(label);
        }
    }
}

const diningPage = page("dining");
const expPage = page("experiences");
const eventsPage = page("events");
const newsPage = page("news");
const galleryPage = page("gallery");
const contactPage = page("contact");

const seed = {
    hotel: {
        id: "namdu-hill",
        name: "The Nam Du Hill Resort",
        location: "Nam Du, Kiên Hải, An Giang",
        address: "Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam",
        phone: "0985 000 650",
        email: "thenamduhill@gmail.com",
        taxId: "1702244746",
        images: galleryPage.images,
    },
    roomTypes,
    dining: {
        title: "Trải nghiệm ẩm thực tại The Nam Du Hill Resort",
        banner: diningPage.images[0] ?? "",
        paragraphs: bodyParagraphs(diningPage.text, diningPage.title, children("dining").map((a) => a.title)),
    },
    experiences: {
        title: "Tiện nghi & dịch vụ tại The Nam Du Hill Resort",
        banner: expPage.images.find((i) => /banner/.test(i)) ?? "",
        images: expPage.images.filter((i) => !/banner/.test(i)),
        paragraphs: bodyParagraphs(expPage.text, expPage.title, children("experiences").map((a) => a.title)),
        articles: children("experiences").map((a) => ({
            title: a.title,
            url: a.url.replace(ORIGIN, ""),
        })),
    },
    events: {
        banner: eventsPage.images[0] ?? "",
        items: [],
    },
    news: {
        banner: newsPage.images.find((i) => /banner/.test(i)) ?? "",
        thumbnails: newsPage.images.filter((i) => !/banner/.test(i)),
        articles: children("news").map((a) => ({
            title: a.title,
            url: a.url.replace(ORIGIN, ""),
        })),
    },
    gallery: galleryPage.images,
    /** Ảnh banner/hero lấy từ trang chủ. */
    banners: (page("home")?.images ?? []).filter((i) => /\/banner\/|bg-/.test(i)),
    policies,
    payment: {
        methods: paymentMethods,
        guide: paymentPage?.text
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 50 && !/Back to Top|DCWEB|©/.test(l)) ?? [],
    },
    contact: {
        address: "Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam",
        phone: "0985 000 650",
        email: "thenamduhill@gmail.com",
    },
};

await writeFile(path.join(OUT, "seed-data.json"), JSON.stringify(seed, null, 2), "utf8");

console.log(`Phòng: ${roomTypes.length} (${roomTypes.filter((r) => r.images.length).length} có ảnh, ${roomTypes.filter((r) => r.price).length} có giá)`);
console.log(`Gallery: ${seed.gallery.length} ảnh`);
console.log(`News: ${seed.news.articles.length} bài, Experiences: ${seed.experiences.articles.length} bài`);
console.log(`Dining: ${seed.dining.paragraphs.length} doan, Experiences: ${seed.experiences.paragraphs.length} doan`);
console.log(`Policies: checkIn=${policies.checkIn||"?"} checkOut=${policies.checkOut||"?"} | ${policies.pages.length} trang`);
console.log(`Payment: ${paymentMethods.join(", ")||"?"}`);
console.log(`Banners: ${seed.banners.length}`);
