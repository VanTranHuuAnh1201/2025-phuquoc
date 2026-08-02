"""
Crawl toan bo mot website khach san bang Playwright -> du lieu co cau truc.

Khong can Firecrawl API key. Xuat ra cung thu muc output/ voi pipeline Firecrawl:
    <slug>.raw.json      - noi dung tung trang (text + heading + bang gia)
    <slug>.images.json   - URL anh, gom theo trang nguon
    <slug>.json          - du lieu da bok tach theo schema.ts

Cach chay:
    py -m venv venv && ./venv/Scripts/pip install playwright && playwright install chromium
    py crawl-playwright.py https://thenamduhill.com --limit 60

Ghi chu: script ton trong robots.txt va co delay giua cac request.
"""

import argparse
import json
import re
import sys
import time
import unicodedata
import urllib.robotparser
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlsplit

from playwright.sync_api import sync_playwright

OUTPUT_DIR = Path(__file__).parent / "output"

# Anh rac: icon, logo, sprite, pixel tracking (giong IMAGE_BLOCKLIST trong crawl-hotel.ts)
IMAGE_BLOCKLIST = re.compile(
    r"(logo|icon|favicon|sprite|placeholder|avatar|1x1|spacer|blank|loading|pixel|squire)",
    re.I,
)
IMAGE_EXT = re.compile(r"\.(jpe?g|png|webp|avif|gif)(\?|$)", re.I)

# Cac duong dan thuong chua thong tin phong / tien ich
INTERESTING = re.compile(
    r"(room|phong|suite|collection|accommodation|dining|restaurant|"
    r"experience|facilit|service|gallery|about|contact|news|article|event)",
    re.I,
)

# Bo qua file tai ve va trang khong phai noi dung
SKIP_URL = re.compile(
    r"\.(pdf|zip|docx?|xlsx?|mp4|mp3|jpg|jpeg|png|gif|webp|svg|ico|css|js)$"
    r"|/(cart|checkout|login|register|search|account)",
    re.I,
)


# --------------------------------------------------------------------------
# Trich xuat noi dung trong trinh duyet
# --------------------------------------------------------------------------
EXTRACT_PAGE = r"""
() => {
  const abs = (u) => { try { return new URL(u, location.href).href } catch { return null } };
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

  // --- Anh: bat ca src, data-src (lazy), srcset, background-image ---
  const imgs = new Set();
  for (const el of document.querySelectorAll('img')) {
    for (const attr of ['src', 'data-src', 'data-original', 'data-lazy-src']) {
      const v = el.getAttribute(attr);
      if (v && !v.startsWith('data:')) { const u = abs(v); if (u) imgs.add(u); }
    }
    const ss = el.getAttribute('srcset');
    if (ss) for (const part of ss.split(',')) {
      const u = abs(part.trim().split(/\s+/)[0]); if (u) imgs.add(u);
    }
  }
  for (const el of document.querySelectorAll('source[srcset]')) {
    for (const part of el.getAttribute('srcset').split(',')) {
      const u = abs(part.trim().split(/\s+/)[0]); if (u) imgs.add(u);
    }
  }
  // background-image trong inline style va computed style cua section lon
  for (const el of document.querySelectorAll('[style*="background"]')) {
    const m = /url\(\s*["']?([^"')]+)["']?\s*\)/i.exec(el.getAttribute('style') || '');
    if (m) { const u = abs(m[1]); if (u) imgs.add(u); }
  }

  // --- Anh kem alt, de ghep anh voi phong ---
  const imgMeta = [...document.images]
    .filter(i => i.currentSrc && !i.currentSrc.startsWith('data:'))
    .map(i => ({ src: i.currentSrc, alt: clean(i.alt), w: i.naturalWidth, h: i.naturalHeight }));

  // --- Heading theo thu tu xuat hien ---
  const headings = [...document.querySelectorAll('h1,h2,h3,h4')]
    .map(h => ({ level: +h.tagName[1], text: clean(h.innerText) }))
    .filter(h => h.text);

  // --- Gia: bat cac chuoi dang "1.546.000đ" / "1,546,000 VND" ---
  const bodyText = document.body.innerText;
  const prices = [...bodyText.matchAll(/([\d][\d.,]{5,})\s*(?:đ|d|VND|vnđ)/gi)]
    .map(m => Number(m[1].replace(/[.,]/g, '')))
    .filter(n => n >= 100000 && n <= 500000000);

  // --- Bang thong tin (diem tich, giuong, so khach) ---
  const tables = [...document.querySelectorAll('table')].map(t =>
    [...t.querySelectorAll('tr')].map(tr =>
      [...tr.querySelectorAll('td,th')].map(td => clean(td.innerText))
    )
  );

  // --- Danh sach: thuong la tien ich ---
  const lists = [...document.querySelectorAll('ul,ol')]
    .map(ul => [...ul.querySelectorAll(':scope > li')].map(li => clean(li.innerText)).filter(Boolean))
    .filter(items => items.length >= 2 && items.length <= 40)
    .filter(items => items.every(i => i.length < 120));

  // --- Link noi bo de crawl tiep ---
  const links = [...document.querySelectorAll('a[href]')]
    .map(a => abs(a.getAttribute('href')))
    .filter(Boolean);

  const metaOf = (n) => document.querySelector(`meta[name="${n}"]`)?.content || null;

  return {
    title: document.title,
    description: metaOf('description'),
    headings,
    text: bodyText.replace(/\n{3,}/g, '\n\n').trim(),
    prices: [...new Set(prices)],
    tables: tables.filter(t => t.length),
    lists,
    images: [...imgs],
    imgMeta,
    links: [...new Set(links)],
  };
}
"""


def norm_url(u: str) -> str:
    """Bo fragment va query rong de tranh crawl trung."""
    s = urlsplit(u)
    path = s.path.rstrip("/") or "/"
    return f"{s.scheme}://{s.netloc}{path}" + (f"?{s.query}" if s.query else "")


def load_robots(base: str):
    rp = urllib.robotparser.RobotFileParser()
    rp.set_url(urljoin(base, "/robots.txt"))
    try:
        rp.read()
    except Exception:
        return None
    return rp


def crawl(start_url: str, limit: int, delay: float):
    host = urlparse(start_url).netloc
    robots = load_robots(start_url)

    seen, queue, pages = set(), [norm_url(start_url)], []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
            ),
        )
        page = ctx.new_page()
        # Chan font/media cho nhanh, van giu anh de doc URL
        page.route(
            re.compile(r"\.(woff2?|ttf|eot|mp4|webm)(\?|$)"),
            lambda route: route.abort(),
        )

        while queue and len(pages) < limit:
            url = queue.pop(0)
            if url in seen:
                continue
            seen.add(url)

            if robots and not robots.can_fetch("*", url):
                print(f"  [robots] bo qua {url}")
                continue

            try:
                resp = page.goto(url, wait_until="domcontentloaded", timeout=45_000)
                if not resp or resp.status >= 400:
                    print(f"  [{resp.status if resp else '???'}] {url}")
                    continue
                page.wait_for_timeout(1200)
                # Scroll de kich hoat lazy-load anh
                page.evaluate(
                    "async () => { for (let y=0; y<document.body.scrollHeight; y+=800)"
                    " { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,80)); }"
                    " window.scrollTo(0,0); }"
                )
                page.wait_for_timeout(400)

                data = page.evaluate(EXTRACT_PAGE)
            except Exception as e:
                print(f"  [loi] {url}: {str(e)[:90]}")
                continue

            data["url"] = url
            data["images"] = [
                i for i in data["images"]
                if IMAGE_EXT.search(i) and not IMAGE_BLOCKLIST.search(i)
            ]
            links = data.pop("links")
            pages.append(data)
            print(f"  [{len(pages)}/{limit}] {data['title'][:60]} — {len(data['images'])} anh")

            # Xep hang link noi bo, uu tien trang co ve chua thong tin phong
            for link in links:
                try:
                    if urlparse(link).netloc != host:
                        continue
                except ValueError:
                    continue
                n = norm_url(link)
                if n in seen or n in queue or SKIP_URL.search(n):
                    continue
                if INTERESTING.search(n):
                    queue.insert(0, n)   # uu tien
                else:
                    queue.append(n)

            time.sleep(delay)

        browser.close()

    return pages


# --------------------------------------------------------------------------
# Bok tach -> schema
# --------------------------------------------------------------------------
ROOM_URL = re.compile(r"(room|phong|suite|collection)", re.I)

SIZE_RE = re.compile(r"(\d{1,3})\s*m\s*2|(\d{1,3})\s*m²", re.I)
CAPACITY_RE = re.compile(r"(?:tối đa|toi da)\s*(\d{1,2})\s*(?:khách|người)", re.I)
DEFAULT_CAP_RE = re.compile(r"mặc định\s*(\d{1,2})\s*(?:khách|người)", re.I)
SURCHARGE_RE = re.compile(r"phụ thu[^.]*?([\d.]{5,})\s*đ", re.I)
BED_RE = re.compile(
    r"(\d{1,2}|\d{2})?\s*(giường đôi lớn|giường đôi trung|giường đôi|giường đơn|"
    r"giường king|giường queen|king|queen|twin|double)", re.I)

# Card phong tren trang danh sach:  "Ten phong - #01"  ->  mo ta  ->  "1.886.000đ / Đêm"
ROOM_CARD_RE = re.compile(
    r"^(?P<name>[^\n#]{4,90}?)\s*-\s*#(?P<num>[\d\-]{1,10})\s*\n+"      # ten + so phong
    r"(?P<desc>(?:(?!Xem chi tiết)[^\n]*\n?){0,4}?)\s*"                  # mo ta (toi da 4 dong)
    r"Xem chi tiết\s*\n+"
    r"(?P<price>[\d.,]{5,})\s*đ",                                       # gia
    re.M,
)

VIEW_MAP = [
    (re.compile(r"nhìn ra biển|view biển|hướng biển|sea view", re.I), "Hướng biển"),
    (re.compile(r"thung lũng", re.I), "Hướng thung lũng"),
    (re.compile(r"nhìn ra vườn|view vườn|hướng vườn|garden", re.I), "Hướng vườn"),
    (re.compile(r"hồ bơi|pool", re.I), "Hướng hồ bơi"),
    (re.compile(r"sân trong", re.I), "Sân trong"),
]


def parse_room_cards(text: str, page_url: str) -> list:
    """Bok tach phong tu trang danh sach (moi phong la 1 card, khong dung heading)."""
    rooms = []
    for m in ROOM_CARD_RE.finditer(text):
        name = m.group("name").strip()
        # Loai bo dong rac lot vao (breadcrumb, nut bam)
        if name.lower() in ("chọn", "xem chi tiết", "đặt phòng") or "\n" in name:
            continue

        desc = " ".join(m.group("desc").split())
        price = int(re.sub(r"[.,]", "", m.group("price")))
        blob = f"{name} {desc}"

        size_m = SIZE_RE.search(desc)
        cap_m = CAPACITY_RE.search(desc)
        def_cap = DEFAULT_CAP_RE.search(desc)
        bed_m = BED_RE.search(desc)
        sur_m = SURCHARGE_RE.search(desc)

        views = [label for rx, label in VIEW_MAP if rx.search(blob)]

        rooms.append({
            "id": slugify_vi(f"{name}-{m.group('num')}"),
            "name": name,
            "roomNumber": m.group("num"),
            "size": f"{size_m.group(1) or size_m.group(2)}m²" if size_m else "",
            "bedType": bed_m.group(0).strip() if bed_m else "",
            "capacity": int(cap_m.group(1)) if cap_m
                        else (int(def_cap.group(1)) if def_cap else None),
            "defaultCapacity": int(def_cap.group(1)) if def_cap else None,
            "extraBedFee": int(re.sub(r"[.,]", "", sur_m.group(1))) if sur_m else None,
            "price": price,
            "currency": "VND",
            "view": views[0] if views else "",
            "amenities": views,
            "description": desc,
            "images": [],
            "availability": True,
            "sourceUrl": page_url,
        })
    return rooms


def slugify_vi(s: str) -> str:
    """Chuyen tieng Viet co dau -> slug ascii.

    Dung unicodedata de tach dau thay vi bang tra thu cong (de sai do dai).
    Rieng chu 'd/D' phai thay truoc vi NFD khong tach duoc dau gach ngang.
    """
    s = s.lower().replace("đ", "d")
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return re.sub(r"-{2,}", "-", s)


def extract_hotel(pages: list, start_url: str) -> dict:
    home = pages[0] if pages else {}
    text_all = "\n".join(p.get("text", "") for p in pages)

    phone = None
    m = re.search(r"(0\d{2,3}[\s.]?\d{3}[\s.]?\d{3,4})", text_all)
    if m:
        phone = m.group(1).strip()

    email = None
    m = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", text_all)
    if m:
        email = m.group(0)

    address = None
    m = re.search(r"((?:Ấp|Số|Đường|Thôn|Khu)[^\n]{10,120})", text_all)
    if m:
        address = m.group(1).strip()

    # --- Phong: bok tach tu card tren trang danh sach ---
    # Site nay khong co URL rieng cho tung phong, tat ca nam tren /collections/rooms-suites
    rooms, seen_ids = [], set()
    for p in pages:
        if not ROOM_URL.search(p["url"]):
            continue
        for room in parse_room_cards(p.get("text", ""), p["url"]):
            if room["id"] in seen_ids:
                continue
            seen_ids.add(room["id"])
            rooms.append(room)

    # --- Ghep anh cho tung phong ---
    # Duong dan anh co dang /room-suite/<so-phong>-<ten-phong>/... (vd /6-phong-deluxe/).
    # Khop theo thu muc nay chinh xac hon khop theo alt text, vi ten phong long nhau
    # ("phong-giuong-doi" la con cua "phong-giuong-doi-co-ban-cong") gay hut nham anh.
    ROOM_DIR_RE = re.compile(r"/room-suite/([^/]+)/", re.I)

    img_by_dir: dict[str, list[str]] = {}
    for p in pages:
        for im in p.get("imgMeta", []):
            if im["w"] < 300 or IMAGE_BLOCKLIST.search(im["src"]):
                continue
            m = ROOM_DIR_RE.search(im["src"])
            if m:
                img_by_dir.setdefault(m.group(1).lower(), []).append(im["src"])

    def dir_prefix(d: str) -> str:
        """'3-4-phong-giuong-doi-...' -> '3-4';  '15-phong-giuong-doi' -> '15'."""
        m = re.match(r"^(\d+(?:-\d+)*)-", d)
        return m.group(1) if m else ""

    for room in rooms:
        # So phong tren card: '03-04' -> '3-4' (thu muc anh khong co so 0 dung dau)
        want = "-".join(n.lstrip("0") or "0" for n in room["roomNumber"].split("-"))
        matched: list[str] = []
        for d, srcs in img_by_dir.items():
            if dir_prefix(d) == want:
                matched.extend(srcs)

        # Fallback: khop chinh xac ca ten phong khi khong doi chieu duoc qua so
        if not matched:
            name_slug = slugify_vi(room["name"])
            for d, srcs in img_by_dir.items():
                body = d[len(dir_prefix(d)) + 1:] if dir_prefix(d) else d
                if body == name_slug:
                    matched.extend(srcs)

        # Bo ban trung cung anh khac kich thuoc (-600x600 / -700x700), giu ban lon nhat
        best: dict[str, str] = {}
        for src in matched:
            key = re.sub(r"-\d+x\d+(?=\.\w+$)", "", src)
            if key not in best or len(src) > len(best[key]):
                best[key] = src
        room["images"] = sorted(set(best.values()))[:8]

    # --- Tien ich chung ---
    # Section "Vì Sao Chọn Chúng Tôi" co dang: so thu tu \n tieu de \n mo ta.
    # Uu tien section nay; cac <ul> tren trang chu chi la menu dieu huong nen khong dung.
    amenities = []
    home_text = home.get("text", "")
    m = re.search(r"Vì Sao Chọn Chúng Tôi(.{0,2500}?)(?:“|\"|Khám phá)", home_text, re.S)
    if m:
        for item in re.finditer(
            r"^\d{1,2}\s*\n(?P<title>[^\n]{5,60})\s*\n+(?P<desc>[^\n]{20,300})",
            m.group(1), re.M,
        ):
            amenities.append({
                "name": item.group("title").strip(),
                "description": " ".join(item.group("desc").split()),
                "available": True,
            })

    # Fallback: <ul> co ve la tien ich (loai menu dieu huong)
    if not amenities:
        NAV_WORDS = {"home", "gallery", "news", "event", "contact us", "rooms & suites"}
        for l in home.get("lists", []):
            if 4 <= len(l) <= 20 and not any(len(i) > 80 for i in l):
                if sum(1 for i in l if i.strip().lower() in NAV_WORDS) >= 2:
                    continue  # menu, khong phai tien ich
                amenities = [{"name": i, "available": True} for i in l]
                break

    all_images = []
    for p in pages:
        all_images.extend(p.get("images", []))

    return {
        "name": (home.get("title") or "").split("|")[0].strip(),
        "description": home.get("description") or "",
        "address": address,
        "phone": phone,
        "email": email,
        "location": "",
        "images": list(dict.fromkeys(all_images)),
        "amenities": amenities,
        "roomTypes": rooms,
        "sourceUrl": start_url,
        "crawledPages": len(pages),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--limit", type=int, default=40)
    ap.add_argument("--delay", type=float, default=0.8, help="giay nghi giua cac request")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    slug = args.out or re.sub(r"[^a-z0-9]+", "-", urlparse(args.url).netloc.replace("www.", ""))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[1/2] Crawl {args.url} (toi da {args.limit} trang)...")
    pages = crawl(args.url, args.limit, args.delay)
    print(f"      Xong {len(pages)} trang.")

    # raw.json — noi dung tung trang
    (OUTPUT_DIR / f"{slug}.raw.json").write_text(
        json.dumps(
            [{k: v for k, v in p.items() if k != "imgMeta"} for p in pages],
            ensure_ascii=False, indent=2),
        encoding="utf-8")

    # images.json — anh gom theo trang
    by_page = [{"url": p["url"], "title": p["title"], "images": p["images"]} for p in pages]
    all_imgs = list(dict.fromkeys(i for p in pages for i in p["images"]))
    (OUTPUT_DIR / f"{slug}.images.json").write_text(
        json.dumps({"total": len(all_imgs), "byPage": by_page, "all": all_imgs},
                   ensure_ascii=False, indent=2),
        encoding="utf-8")

    print("[2/2] Bok tach theo schema...")
    hotel = extract_hotel(pages, args.url)
    (OUTPUT_DIR / f"{slug}.json").write_text(
        json.dumps(hotel, ensure_ascii=False, indent=2), encoding="utf-8")

    rooms_with_img = sum(1 for r in hotel["roomTypes"] if r["images"])
    rooms_with_price = sum(1 for r in hotel["roomTypes"] if r["price"])
    print(f"\nXong. Ket qua: output/{slug}.json")
    print(f"  - {len(hotel['roomTypes'])} loai phong "
          f"({rooms_with_img} co anh, {rooms_with_price} co gia)")
    print(f"  - {len(hotel['amenities'])} tien ich")
    print(f"  - {len(hotel['images'])} anh — chi tiet: {slug}.images.json")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")  # tranh loi cp1252 tren Windows
    main()
