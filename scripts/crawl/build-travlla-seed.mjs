/**
 * Chuyển output của crawl-travlla.mjs thành seed data có cấu trúc theo entity
 * (tour, destination, blog, gallery, service, team, testimonial, faq, pricing).
 *
 * Chạy: node scripts/crawl/build-travlla-seed.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://travlla.botble.com";
const OUT = path.join(process.cwd(), "scripts", "crawl", "output", "travlla");

const data = JSON.parse(await readFile(path.join(OUT, "pages.json"), "utf8"));

const ok = data.pages.filter((p) => p.status === 200);
const bySection = (s) => ok.filter((p) => p.section === s);
const one = (s) => bySection(s)[0];
const rel = (u) => u.replace(ORIGIN, "") || "/";
const lines = (t) => (t ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

const slug = (u) => u.split("/").filter(Boolean).pop() ?? "";

function decodeEntities(s) {
    return s
        .replace(/&nbsp;/g, " ")
        .replace(/&#0?39;|&rsquo;|&apos;/g, "'")
        .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
        .replace(/&ndash;/g, "–")
        .replace(/&mdash;/g, "—")
        .replace(/&hellip;/g, "…")
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&amp;/g, "&");
}

/** Chrome/menu lặp trên mọi trang — bỏ để đoạn nội dung không bị nhiễu. */
const BOILERPLATE = new Set([
    "Home", "Tours", "Blogs", "Contact", "Compare", "Search", "Book Now", "Read More",
    "Location", "All destinations", "Activity Type", "Any activity", "Date", "Traveler",
    "Cities", "Facebook", "X (Twitter)", "Pinterest", "LinkedIn", "WhatsApp", "Email",
    "Copy link", "Adventure", "Cruise", "Diving", "Safari", "Sightseeing", "Trekking",
    "Bangkok", "California", "Hong Kong", "Maldives", "Paris", "Spain", "Thailand", "Tokyo",
    "Previous", "Next", "Submit", "Send", "Name", "Message", "Subscribe",
]);

/** Đoạn văn thật: đủ dài và có dấu câu; tiêu đề/nút bấm thì không. */
const paragraphs = (text, extraSkip = []) => {
    const skip = new Set([...BOILERPLATE, ...extraSkip]);
    return lines(text).filter(
        (l) => l.length > 60 && /[.!?]/.test(l) && !skip.has(l)
    );
};

/* ---------- Helper bóc field dạng "Label: value" ---------- */

function field(text, label) {
    const re = new RegExp(`^${label}\\s*:?\\s*(.+)$`, "im");
    const m = text.match(re);
    return m ? m[1].trim() : "";
}

const money = (s) => {
    const m = String(s).match(/([\d,]+(?:\.\d{2})?)/);
    return m ? Number(m[1].replace(/,/g, "")) : 0;
};

/* ---------- Tour ---------- */

/**
 * Lịch trình render dạng: "01 / DAY / <tiêu đề> / <mô tả>".
 * Dùng heading level 4 để biết đâu là tiêu đề ngày, vì mô tả các ngày
 * giữa hành trình thường trùng nhau từng chữ.
 */
function parseItinerary(text, headings) {
    const l = lines(text);
    const out = [];
    for (let i = 0; i < l.length; i++) {
        if (!/^\d{1,2}$/.test(l[i]) || l[i + 1] !== "DAY") continue;
        const title = l[i + 2] ?? "";
        const desc = [];
        let j = i + 3;
        // gom mô tả tới khi gặp block ngày kế tiếp hoặc hết section
        while (j < l.length && !(/^\d{1,2}$/.test(l[j]) && l[j + 1] === "DAY")) {
            if (/^(Includes|Not Includes|Includes & Not Includes|Customer Reviews|Gallery)$/i.test(l[j]))
                break;
            desc.push(l[j]);
            j++;
        }
        out.push({ day: Number(l[i]), title, description: desc.join(" ").trim() });
        i = j - 1;
    }
    return out;
}

const stripTags = (s) =>
    decodeEntities(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/**
 * "Includes & Not Includes" là 2 cột <ul> cạnh nhau, text phẳng không phân biệt
 * được. Botble đánh dấu bằng icon: bi-check-circle-fill = có, bi-x-circle-fill
 * = không (cột không bao gồm còn có class trv-list-disable).
 */
function parseIncludes(html) {
    const includes = [];
    const excludes = [];
    for (const m of html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
        const raw = m[1];
        const isCheck = /bi-check-circle-fill/.test(raw);
        const isCross = /bi-x-circle-fill/.test(raw);
        if (!isCheck && !isCross) continue;
        const text = stripTags(raw);
        if (text) (isCheck ? includes : excludes).push(text);
    }
    return { includes, excludes };
}

/** Review render dạng: Tên / Ngày / Nội dung (không kèm rating từng review). */
function parseReviews(text) {
    const l = lines(text);
    const start = l.findIndex((x) => /^Customer Reviews$/i.test(x));
    if (start < 0) return [];
    const end = l.findIndex((x, i) => i > start && /^Add A Review$/i.test(x));
    const seg = l.slice(start + 1, end < 0 ? l.length : end);

    const DATE = /^[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}$/;
    const out = [];
    for (let i = 0; i < seg.length - 2; i++) {
        if (!DATE.test(seg[i + 1])) continue;
        const author = seg[i];
        const comment = seg[i + 2];
        if (author.length < 60 && comment && comment.length > 30) {
            out.push({ author, date: seg[i + 1], comment });
            i += 2;
        }
    }
    return out;
}

/** Sidebar đặt chỗ: ngày khởi hành, hạng khách sạn, tổng tiền. */
function parseBooking(text) {
    const l = lines(text);
    const departures = [];
    for (const x of l) {
        const m = x.match(
            /^([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})\s*-\s*([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})\s*—\s*(\d+)\s*seats? left$/
        );
        if (m) departures.push({ from: m[1], to: m[2], seatsLeft: Number(m[3]) });
    }

    const hotelRatings = [];
    for (const x of l) {
        const m = x.match(/^(\d)\s*Star\s*\$\s*([\d,]+)$/i);
        if (m) hotelRatings.push({ stars: Number(m[1]), price: money(m[2]) });
    }

    const startingFrom = l.find((x) => /^Starting from/i.test(x)) ?? "";
    return {
        startingFrom: money(startingFrom),
        departures,
        hotelRatings,
        travelerRange: (l.find((x) => /^Between \d+ and \d+ travelers$/i.test(x)) ?? ""),
    };
}

function buildTour(p) {
    const t = p.mainText;
    // Filter sidebar ở đầu trang cũng có nhãn "Activity Type" (giá trị mặc định
    // "Any activity") -> chỉ đọc field trong khối Tour Overview trở đi.
    const overviewText = t.slice(Math.max(0, t.search(/^Tour Overview$/im)));
    const rating = t.match(/([\d.]+)\s*\((\d+)\s*reviews?\)/i);
    const price = t.match(/\$\s*([\d,]+(?:\.\d{2})?)\s*Per person/i);
    const { includes, excludes } = parseIncludes(p.html ?? "");

    // Ảnh tour = ảnh trong /storage/tours/ + gallery kèm theo trang chi tiết
    const gallery = [
        ...(p.imagesByKind?.tour ?? []),
        ...(p.imagesByKind?.gallery ?? []),
    ].filter((v, i, a) => a.indexOf(v) === i);

    return {
        id: slug(p.url),
        slug: slug(p.url),
        url: rel(p.url),
        name: p.title,
        metaDescription: p.description,
        destination: field(overviewText, "Destination"),
        activityType: field(overviewText, "Activity Type"),
        duration: field(overviewText, "Duration"),
        groupSize: field(overviewText, "Group Size"),
        price: price ? money(price[1]) : 0,
        currency: "USD",
        priceUnit: "per person",
        rating: rating ? Number(rating[1]) : 0,
        reviewCount: rating ? Number(rating[2]) : 0,
        overview: paragraphs(
            t.split(/Scheduled Travel Plan/i)[0] ?? "",
            [p.title]
        ),
        itinerary: parseItinerary(t, p.headings),
        includes,
        excludes,
        booking: parseBooking(t),
        reviews: parseReviews(t),
        images: gallery,
        thumbnail: gallery[0] ?? "",
    };
}

/* ---------- Destination ---------- */

function buildDestination(p) {
    const t = p.mainText;
    const tourCount = t.match(/(\d+)\s+Tours?\b/i);
    return {
        id: slug(p.url),
        slug: slug(p.url),
        url: rel(p.url),
        name: p.title.replace(/\s*[-–|].*$/, "").trim(),
        metaDescription: p.description,
        tourCount: tourCount ? Number(tourCount[1]) : 0,
        description: paragraphs(t, [p.title]),
        images: [
            ...(p.imagesByKind?.destination ?? []),
            ...(p.imagesByKind?.tour ?? []),
        ].filter((v, i, a) => a.indexOf(v) === i),
        thumbnail: (p.imagesByKind?.destination ?? [])[0] ?? "",
    };
}

/* ---------- Blog ---------- */

function buildPost(p) {
    const t = p.mainText;
    const date = t.match(/\b([A-Z][a-z]{2,8}\s+\d{1,2},\s+\d{4})\b/);
    return {
        id: slug(p.url),
        slug: slug(p.url),
        url: rel(p.url),
        title: p.title,
        metaDescription: p.description,
        publishedAt: date ? date[1] : "",
        category: field(t, "Category"),
        content: paragraphs(t, [p.title]),
        images: (p.imagesByKind?.blog ?? []).concat(p.imagesByKind?.other ?? [])
            .filter((u) => /\/storage\//.test(u))
            .filter((v, i, a) => a.indexOf(v) === i),
        thumbnail:
            (p.imagesByKind?.blog ?? [])[0] ??
            (p.imagesByKind?.other ?? []).find((u) => /\/storage\//.test(u)) ??
            "",
    };
}

/* ---------- Gallery ---------- */

function buildGallery(p) {
    return {
        id: slug(p.url),
        slug: slug(p.url),
        url: rel(p.url),
        title: p.title,
        description: paragraphs(p.mainText, [p.title]),
        images: p.imagesByKind?.gallery ?? [],
    };
}

/* ---------- Service ---------- */

function buildService(p) {
    return {
        id: slug(p.url),
        slug: slug(p.url),
        url: rel(p.url),
        name: p.title,
        metaDescription: p.description,
        description: paragraphs(p.mainText, [p.title]),
        images: (p.imagesByKind?.service ?? []).concat(
            (p.imagesByKind?.other ?? []).filter((u) => /\/storage\//.test(u))
        ).filter((v, i, a) => a.indexOf(v) === i),
    };
}

/* ---------- FAQ ---------- */

/** FAQ render kiểu accordion: câu hỏi (kết thúc bằng ?) rồi tới câu trả lời. */
function parseFaqs(text) {
    const l = lines(text);
    const out = [];
    for (let i = 0; i < l.length; i++) {
        if (!/\?$/.test(l[i]) || l[i].length < 12) continue;
        const answer = [];
        let j = i + 1;
        while (j < l.length && !/\?$/.test(l[j])) {
            if (l[j].length > 40 && /[.!?]/.test(l[j])) answer.push(l[j]);
            else if (answer.length) break;
            j++;
        }
        // bỏ tiền tố số thứ tự accordion: "01 - How do I book...?"
        const question = l[i].replace(/^\d{1,2}\s*[-–.]\s*/, "").trim();
        if (answer.length) out.push({ question, answer: answer.join(" ") });
    }
    return out;
}

/* ---------- Pricing ---------- */

function parsePricing(text) {
    const l = lines(text);
    const out = [];
    // Render dạng: "Explorer" / "$499 / trip" / <các feature> / "Book Now"
    for (let i = 1; i < l.length; i++) {
        const m = l[i].match(/^\$\s*([\d,]+)(?:\s*\/\s*(\w+))?$/);
        if (!m) continue;
        const name = l[i - 1];
        if (!name || name.length > 40 || BOILERPLATE.has(name)) continue;

        const features = [];
        let j = i + 1;
        while (j < l.length && !/^Book Now$/i.test(l[j]) && !/^\$\s*[\d,]+/.test(l[j])) {
            if (l[j].length > 2 && l[j].length < 90 && !BOILERPLATE.has(l[j]))
                features.push(l[j]);
            j++;
        }
        out.push({
            name,
            price: money(m[1]),
            currency: "USD",
            unit: m[2] ? `per ${m[2]}` : "",
            features,
        });
        i = j;
    }
    // Bảng giá lặp ở header mọi trang -> lọc trùng theo tên gói
    return out.filter((p, i, a) => a.findIndex((x) => x.name === p.name) === i);
}

/* ---------- Team & Testimonials ---------- */

function parseTeam(p) {
    const l = lines(p.mainText);
    const imgs = (p.imagesByKind?.team ?? []).concat(
        (p.imagesByKind?.other ?? []).filter((u) => /\/storage\/(team|our-team)/.test(u))
    );
    const roles = /guide|manager|director|founder|ceo|specialist|consultant|advisor|coordinator|lead|officer/i;
    // Tên người: 2-3 từ viết hoa đầu. Tiêu đề section ("Meet The Team",
    // "Our Expert Travel Guides") cũng có dạng đó nên loại bằng danh sách
    // từ mở đầu; vai trò luôn nằm ngay dòng kế sau tên.
    // Cho phép hoa giữa từ (McKinney, O'Brien, D'Souza).
    const isPersonName = (s) =>
        /^[A-Z][a-zA-Z'’-]+(?:\s+[A-Z][a-zA-Z'’.-]+){1,2}$/.test(s) &&
        !/^(Meet|Our|The|Ready|Get|Home)\b/i.test(s);

    const out = [];
    for (let i = 0; i < l.length - 1; i++) {
        if (!isPersonName(l[i]) || BOILERPLATE.has(l[i])) continue;
        const role = l[i + 1];
        if (role && role.length <= 45 && roles.test(role)) {
            out.push({ name: l[i], role });
            i++;
        }
    }
    const uniq = out.filter((m, i, a) => a.findIndex((x) => x.name === m.name) === i);
    // Ảnh /storage/teams/N.jpg khớp theo thứ tự xuất hiện
    return uniq.map((m, i) => ({ ...m, photo: imgs[i] ?? "" }));
}

function parseTestimonials(p) {
    const l = lines(p.mainText);
    const photos = p.imagesByKind?.testimonial ?? [];
    const out = [];
    for (let i = 0; i < l.length; i++) {
        // trích dẫn dài rồi tới tên người nói
        if (l[i].length < 60 || !/[.!?]$/.test(l[i])) continue;
        const author = l[i + 1];
        if (author && author.length < 40 && /^[A-Z]/.test(author) && !BOILERPLATE.has(author)) {
            out.push({
                quote: l[i],
                author,
                role: (l[i + 2] && l[i + 2].length < 45) ? l[i + 2] : "",
                photo: photos[out.length] ?? "",
            });
        }
    }
    return out.filter((t, i, a) => a.findIndex((x) => x.quote === t.quote) === i);
}

/* ---------- Contact ---------- */

/**
 * Cloudflare che email thành <a data-cfemail="hex">[email protected]</a>.
 * Byte đầu là khoá XOR, các byte sau là ký tự đã mã hoá.
 */
function decodeCfEmail(hex) {
    const key = parseInt(hex.slice(0, 2), 16);
    let out = "";
    for (let i = 2; i < hex.length; i += 2)
        out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
    return out;
}

function parseContact(p) {
    const t = p?.mainText ?? "";
    const html = (p?.html ?? "") + data.pages.map((x) => x.html ?? "").join("");
    const cf = html.match(/data-cfemail=["']([0-9a-f]+)["']/i);

    // "Phone" / "Email" / "Address" là nhãn đứng riêng một dòng, giá trị ở dòng kế.
    const after = (label) => {
        const l = lines(t);
        const i = l.findIndex((x) => x.toLowerCase() === label);
        return i >= 0 ? (l[i + 1] ?? "").trim() : "";
    };

    return {
        phone: after("phone") || (t.match(/\+?\d[\d\s().-]{8,}\d/) || [])[0]?.trim() || "",
        email: cf ? decodeCfEmail(cf[1]) : "",
        address: after("address"),
        // Chỉ lấy link trang thương hiệu; bỏ nút share (sharer.php, /intent/,
        // pin/create, share-offsite) vốn kèm URL của từng bài viết.
        socials: [
            ...new Set(
                data.pages
                    .flatMap((x) =>
                        [...(x.html ?? "").matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)].map(
                            (m) => m[1]
                        )
                    )
                    .filter((u) =>
                        /^https?:\/\/(www\.)?(facebook|twitter|x|instagram|linkedin|youtube|pinterest)\.com\/?$/i.test(
                            u.split("?")[0]
                        )
                    )
                    .map((u) => u.replace(/\/$/, ""))
            ),
        ],
    };
}

/* ---------- Home variants ---------- */

const homeVariants = ok
    .filter((p) => p.section === "home")
    .map((p) => ({
        variant: p.variant,
        origin: p.origin,
        url: p.url,
        title: p.title,
        metaDescription: p.description,
        headings: p.headings,
        sections: paragraphs(p.mainText),
        images: p.images.filter((u) => /\/storage\//.test(u)),
        backgrounds: p.imagesByKind?.background ?? [],
        decorations: p.imagesByKind?.decoration ?? [],
        allImages: p.images,
    }));

/* ---------- Build ---------- */

const tours = bySection("tour-detail").map(buildTour);
const destinations = bySection("destination-detail").map(buildDestination);
const posts = bySection("blog-post")
    // các URL /blog/<category-slug> là trang danh mục, không phải bài viết
    .filter((p) => !/^(destination-guides|travel-tips|adventure-travel|beach-islands|city-breaks|food-culture|budget-travel|luxury-escapes)$/.test(slug(p.url)))
    .map(buildPost);
const blogCategories = bySection("blog-post")
    .filter((p) => /^(destination-guides|travel-tips|adventure-travel|beach-islands|city-breaks|food-culture|budget-travel|luxury-escapes)$/.test(slug(p.url)))
    .map((p) => ({ id: slug(p.url), name: p.title, url: rel(p.url) }));
const galleries = bySection("gallery-detail")
    .filter((p) => slug(p.url) !== "galleries")
    .map(buildGallery);
const services = bySection("service-detail").map(buildService);
const tourTypes = ok
    .filter((p) => /\/tour-types\//.test(p.url))
    .map((p) => ({ id: slug(p.url), name: p.title, url: rel(p.url) }));
const tags = ok
    .filter((p) => /\/tag\//.test(p.url))
    .map((p) => ({ id: slug(p.url), name: p.title, url: rel(p.url) }));

const faqPage = one("faqs");
const pricingPage = one("pricing");
const teamPage = one("team") ?? ok.find((p) => /our-team/.test(p.url));
const testiPage = one("testimonials");
const aboutPage = one("about");
const contactPage = one("contact");

const allImages = [...new Set(ok.flatMap((p) => p.images))];
const contentImages = allImages.filter((u) => /\/storage\//.test(u));

const seed = {
    site: {
        name: "Travlla",
        tagline: "Tour & Travel Agency",
        source: ORIGIN,
        variants: data.source,
        crawledAt: data.crawledAt,
        logo: allImages.find((u) => /logo\.png$/.test(u)) ?? "",
    },
    homeVariants,
    tours,
    destinations,
    tourTypes,
    services,
    galleries,
    blog: { posts, categories: blogCategories, tags },
    team: teamPage ? parseTeam(teamPage) : [],
    testimonials: testiPage ? parseTestimonials(testiPage) : [],
    faqs: faqPage ? parseFaqs(faqPage.mainText) : [],
    pricing: pricingPage ? parsePricing(pricingPage.mainText) : [],
    about: aboutPage
        ? {
              title: aboutPage.title,
              metaDescription: aboutPage.description,
              headings: aboutPage.headings,
              paragraphs: paragraphs(aboutPage.mainText, [aboutPage.title]),
              images: aboutPage.images.filter((u) => /\/storage\//.test(u)),
          }
        : null,
    contact: parseContact(contactPage),
    policies: bySection("policy").map((p) => ({
        title: p.title,
        url: rel(p.url),
        paragraphs: paragraphs(p.mainText, [p.title]),
    })),
    images: {
        total: allImages.length,
        content: contentImages,
        byKind: contentImages.reduce((acc, u) => {
            const k =
                u.match(/\/storage\/([^/]+)\//)?.[1] ?? "other";
            (acc[k] ||= []).push(u);
            return acc;
        }, {}),
        all: allImages,
    },
};

await writeFile(path.join(OUT, "seed-data.json"), JSON.stringify(seed, null, 2), "utf8");

/* ---------- Report ---------- */

console.log(`Home variants : ${homeVariants.length}`);
console.log(`Tours         : ${tours.length} (${tours.filter((t) => t.price).length} có giá, ${tours.filter((t) => t.itinerary.length).length} có lịch trình, ${tours.reduce((n, t) => n + t.images.length, 0)} ảnh)`);
console.log(`Destinations  : ${destinations.length}`);
console.log(`Tour types    : ${tourTypes.length}`);
console.log(`Services      : ${services.length}`);
console.log(`Galleries     : ${galleries.length} (${galleries.reduce((n, g) => n + g.images.length, 0)} ảnh)`);
console.log(`Blog          : ${posts.length} bài, ${blogCategories.length} danh mục, ${tags.length} tag`);
console.log(`Team          : ${seed.team.length} | Testimonials: ${seed.testimonials.length}`);
console.log(`FAQs          : ${seed.faqs.length} | Pricing: ${seed.pricing.length} gói`);
console.log(`Ảnh           : ${allImages.length} tổng, ${contentImages.length} ảnh nội dung (/storage/)`);
console.log(`Ghi ra: scripts/crawl/output/travlla/seed-data.json`);
