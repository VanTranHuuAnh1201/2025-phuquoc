"""
Chuyen output cua crawl-playwright.py -> seed data TypeScript.

Cach chay:
    py to-seed.py thenamduhill-com
    py to-seed.py thenamduhill-com --id namdu-hill --no-images

Ket qua: output/<slug>.seed.ts
"""

import argparse
import json
import re
import sys
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "output"

# Key co the viet tran trong object literal cua TS (khong can dau nhay)
IDENT_RE = re.compile(r"[A-Za-z_$][\w$]*")

# Map ten tien ich tu do -> bo icon UI dang dung (giong ICON_RULES trong to-seed.ts)
ICON_RULES = [
    (re.compile(r"wi-?fi|internet", re.I), "wifi"),
    (re.compile(r"đỗ xe|parking|bãi xe", re.I), "parking"),
    (re.compile(r"hồ bơi|pool|bể bơi", re.I), "pool"),
    (re.compile(r"điều ho[àa]|air ?con", re.I), "ac"),
    (re.compile(r"nhà hàng|restaurant|ẩm thực", re.I), "restaurant"),
    (re.compile(r"an ninh|security|cctv|bảo vệ", re.I), "security"),
    (re.compile(r"spa|massage", re.I), "spa"),
    (re.compile(r"gym|thể hình|fitness", re.I), "gym"),
    (re.compile(r"bar|café|cafe|quầy", re.I), "bar"),
    (re.compile(r"đưa đón|đón|tiễn|shuttle|transport|xe", re.I), "transport"),
    (re.compile(r"bãi biển|beach|biển|view|thiên nhiên", re.I), "beach"),
    (re.compile(r"bbq|nướng", re.I), "bbq"),
    (re.compile(r"tour|trải nghiệm|lặn", re.I), "activity"),
    (re.compile(r"phòng ốc|chất lượng|sạch", re.I), "room"),
    (re.compile(r"24/7|phục vụ|hỗ trợ|lễ tân", re.I), "service"),
]


def icon_for(name: str) -> str:
    for rx, icon in ICON_RULES:
        if rx.search(name):
            return icon
    return "check"


def ts_value(v, indent: int = 0) -> str:
    """Serialize sang TypeScript literal. Dung dau nhay kep, giu tieng Viet."""
    pad, pad_in = "    " * indent, "    " * (indent + 1)

    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, int):
        # So tien: viet dang 1_886_000 cho de doc
        return f"{v:_}" if v >= 100_000 else str(v)
    if isinstance(v, float):
        return str(v)
    if isinstance(v, str):
        esc = v.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
        return f'"{esc}"'
    if isinstance(v, list):
        if not v:
            return "[]"
        items = ",\n".join(pad_in + ts_value(i, indent + 1) for i in v)
        return "[\n" + items + f",\n{pad}]"
    if isinstance(v, dict):
        if not v:
            return "{}"
        # Key hop le trong TS thi de tran, con lai boc trong dau nhay
        items = ",\n".join(
            pad_in
            + (k if IDENT_RE.fullmatch(k) else json.dumps(k))
            + ": "
            + ts_value(val, indent + 1)
            for k, val in v.items()
        )
        return "{\n" + items + f",\n{pad}}}"
    raise TypeError(f"Khong serialize duoc: {type(v)}")


def build_seed(hotel: dict, hotel_id: str, keep_images: bool) -> dict:
    rooms = []
    for r in hotel.get("roomTypes", []):
        room = {
            "id": r["id"],
            "name": r["name"],
            "roomNumber": r.get("roomNumber", ""),
            "size": r.get("size", ""),
            "bedType": r.get("bedType", ""),
            "capacity": r.get("capacity") or r.get("defaultCapacity") or 2,
            "price": r.get("price") or 0,
            "currency": "VND",
            "view": r.get("view", ""),
            "description": r.get("description", ""),
            "amenities": r.get("amenities", []),
            "images": r.get("images", []) if keep_images else [],
            "availability": True,
        }
        if r.get("defaultCapacity"):
            room["defaultCapacity"] = r["defaultCapacity"]
        if r.get("extraBedFee"):
            room["extraBedFee"] = r["extraBedFee"]
        rooms.append(room)

    amenities = []
    for a in hotel.get("amenities", []):
        name = a["name"] if isinstance(a, dict) else a
        item = {"icon": icon_for(name), "name": name, "available": True}
        if isinstance(a, dict) and a.get("description"):
            item["description"] = a["description"]
        amenities.append(item)

    return {
        hotel_id: {
            "id": hotel_id,
            "name": hotel.get("name", ""),
            "location": hotel.get("location") or "",
            "address": hotel.get("address") or "",
            "rating": hotel.get("rating") or 0,
            "reviewCount": hotel.get("reviewCount") or 0,
            "images": hotel.get("images", []) if keep_images else [],
            "description": hotel.get("description") or "",
            "contact": {
                "phone": hotel.get("phone") or "",
                "email": hotel.get("email") or "",
            },
            "amenities": amenities,
            "roomTypes": rooms,
            "policies": {
                "checkIn": "14:00",
                "checkOut": "12:00",
                "cancellation": "",
                "children": "",
                "pets": "",
            },
            "location_details": {
                "nearbyAttractions": hotel.get("nearbyAttractions", []),
                "coordinates": {"lat": 0, "lng": 0},
            },
        }
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--id", default=None, help="key cua hotel trong seed (mac dinh = slug)")
    ap.add_argument("--no-images", action="store_true",
                    help="de trong moi mang images (tranh dung anh co ban quyen)")
    args = ap.parse_args()

    src = OUTPUT_DIR / f"{args.slug}.json"
    if not src.exists():
        sys.exit(f"Khong thay {src}. Chay crawl-playwright.py truoc.")

    hotel = json.loads(src.read_text(encoding="utf-8"))
    hotel_id = args.id or args.slug
    keep_images = not args.no_images

    seed = build_seed(hotel, hotel_id, keep_images)

    note = (
        "// Anh de trong co chu dich — thay bang anh cua ban truoc khi len production.\n"
        if not keep_images else
        "// LUU Y: `images` tro toi anh tren website nguon. Kiem tra ban quyen truoc khi dung.\n"
    )

    contents = (
        f"// Sinh tu dong boi scripts/crawl/to-seed.py tu {args.slug}.json\n"
        f"// Nguon: {hotel.get('sourceUrl', '')}\n"
        f"// Kiem tra lai gia truoc khi merge vao mockData.ts\n"
        f"{note}\n"
        f"export const hotelSeed = {ts_value(seed)} as const;\n"
    )

    out = OUTPUT_DIR / f"{args.slug}.seed.ts"
    out.write_text(contents, encoding="utf-8")

    rooms = seed[hotel_id]["roomTypes"]
    print(f"Da ghi {out.name}")
    print(f"  - {len(rooms)} phong, {len(seed[hotel_id]['amenities'])} tien ich")
    print(f"  - anh: {'giu nguyen URL' if keep_images else 'de trong'}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
