/**
 * Sinh file src/data/rooms.ts cho apps/2026-thenamduhillresort từ seed-data.json.
 *
 * Chạy: node resources/scripts/crawl/emit-resort-data.mjs
 */

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..', '..')

const SEED_JSON = path.join(HERE, 'output', 'seed-data.json')
const TARGET_FILE = path.join(ROOT, 'apps', '2026-thenamduhillresort', 'src', 'data', 'rooms.ts')

const seed = JSON.parse(await readFile(SEED_JSON, 'utf8'))

const NAME_EN_MAP = {
  '#01': 'Family Room with Sea View',
  '#02': 'Double Room with Garden View',
  '#03-04': 'Double Room, Balcony & Sea View',
  '#05': 'Hexagon 360° Glass Room',
  '#06': 'Deluxe with Sea & Pool View',
  '#07': 'Superior King with Jacuzzi',
  '#08': 'Family Sea View, Mezzanine',
  '#09': 'Family Sea View, Mezzanine',
  '#10': 'Double Room with Courtyard',
  '#11': 'Family Room, Direct Sea View',
  '#12': 'Double Room with Balcony',
  '#13': 'Second Floor Family, Sea View',
  '#14': 'Rock Deluxe — Cave Room',
  '#15': 'Standard Double Room',
  '#16': 'First Floor Family, Sea View',
  '#17': 'Triple Room, Valley Side',
  '#18': 'Triple Room with Balcony',
  '#08-09': 'Two-Bedroom Suite for 8',
  '#10-11': 'Two-Bedroom Suite for 6',
  '#15-16': 'Two-Bedroom Suite for 6',
}

const VIEW_EN_MAP = {
  'Hướng thung lũng / biển': 'Valley & sea view',
  'Hướng vườn': 'Garden view',
  'Hướng biển': 'Sea view',
  'View biển & sân vườn': 'Sea & garden view',
  'View sân vườn': 'Garden view',
  'View biển & thung lũng': 'Sea & valley view',
  'View kính 360° biển & vườn': '360° glass, sea & garden',
  'View biển & hồ bơi': 'Sea & pool view',
  'Ngắm bình minh & hoàng hôn': 'Sunrise & sunset view',
  'View biển & chợ đêm': 'Sea & night-market view',
  'View sân trong & vườn': 'Courtyard & garden view',
  'View biển trực diện': 'Direct sea view',
  'View biển tầng 2': 'Second-floor sea view',
  'Hang đá tự nhiên & sân vườn': 'Natural rock cave & garden',
  'View biển & rừng cây': 'Sea & forest view',
  'View ban công thung lũng / biển': 'Balcony over valley & sea',
  'View trung tâm, biển & chợ đêm': 'Central, sea & night market',
  'View sân vườn xanh mát': 'Green garden view',
}

const SPECIAL_META = {
  '#05': {
    tag: 'KÍNH 360°',
    tagEn: '360° GLASS',
    hot: 1,
    blurb: 'Khối lục giác hai tầng bọc kính hoàn toàn. Nằm trên giường là thấy rừng, thấy vịnh, thấy trời — và về đêm thấy đèn chợ đêm Nam Du dưới chân đồi.',
    blurbEn: 'A two-storey hexagon wrapped entirely in glass. From the bed you see forest, bay and sky — and at night the lights of the Nam Du night market below.',
    reviews: [
      {
        who: 'Ngọc Anh · TP.HCM',
        score: '9.4',
        text: 'Nằm trên giường ngắm được cả hoàng hôn lẫn đèn chợ đêm. Không cần đi đâu.',
        textEn: 'From the bed you catch both the sunset and the night-market lights. No need to go anywhere.',
      },
    ],
  },
  '#07': {
    tag: 'JACUZZI',
    tagEn: 'JACUZZI',
    hot: 1,
    blurb: 'Rộng 53 m², bồn sục Jacuzzi riêng hướng thung lũng và bàn trang điểm gỗ mộc. Đây là phòng duy nhất đón được cả bình minh lẫn hoàng hôn mà không cần rời khỏi ban công.',
    blurbEn: '53 m² with a private Jacuzzi facing the valley and a raw-wood dressing table. The one room that catches both sunrise and sunset without leaving the balcony.',
    reviews: [
      {
        who: 'Minh Trí · Cần Thơ',
        score: '9.5',
        text: 'Ngâm Jacuzzi lúc mặt trời lặn là thứ đáng tiền nhất chuyến đi.',
        textEn: 'Sitting in the Jacuzzi at sunset was the best value of the whole trip.',
      },
    ],
  },
  '#14': {
    tag: 'ĐỘC BẢN',
    tagEn: 'ONE OF A KIND',
    hot: 2,
    darkTag: true,
    blurb: 'Phòng duy nhất trên đảo giữ nguyên vách đá tự nhiên trong phòng ngủ. Giường đặt trên mỏm đá nguyên khối, phòng tắm nằm trong hang, và đêm xuống nghe rõ tiếng suối chảy ngay ngoài cửa.',
    blurbEn: 'The only room on the island that keeps its natural cliff face indoors. The bed sits on a single boulder, the bathroom is carved into the cave, and at night you hear the stream just outside.',
    reviews: [
      {
        who: 'Hoài Thu · Hà Nội',
        score: '9.6',
        text: 'Phòng 14 không phải phòng trang trí theo chủ đề. Đó là vách đá thật trong phòng ngủ, đêm nghe rõ tiếng suối.',
        textEn: 'Room 14 is not a themed room. That is an actual cliff in the bedroom, and you can hear the stream at night.',
      },
      {
        who: 'Đức Anh · Đà Nẵng',
        score: '9.2',
        text: 'Ngủ trong hang đá nghe hơi lạ nhưng ấm và rất yên. Sáng dậy mở cửa là thấy vườn.',
        textEn: 'Sleeping in a cave sounds odd but it is warm and very quiet. You open the door onto the garden.',
      },
    ],
  },
  '#08-09': {
    tag: 'LỚN NHẤT',
    tagEn: 'LARGEST',
    hot: 1,
    blurb: 'Hai phòng ngủ gác lửng thông nhau, 70 m² cho tám người. Phù hợp cho gia đình nhiều thế hệ hoặc nhóm bạn muốn ở chung mà vẫn có không gian riêng.',
    blurbEn: 'Two connected mezzanine bedrooms, 70 m² for eight. Right for multi-generation families or groups who want to stay together but keep some privacy.',
    reviews: [
      {
        who: 'Gia đình Bảo Long · Rạch Giá',
        score: '9.0',
        text: 'Nhà tôi 8 người ở vừa đủ, không phải thuê 3 phòng rời.',
        textEn: 'Eight of us fitted comfortably instead of renting three separate rooms.',
      },
    ],
  },
}

function parseArea(str) {
  const m = (str || '').match(/(\d+)/)
  return m ? Number(m[1]) : 20
}

function determineGroup(roomNumber, cap, name) {
  if (cap >= 6 || roomNumber.includes('-') || /suite/i.test(name)) return 'suite'
  if (cap >= 3 || /gia đình/i.test(name)) return 'family'
  return 'couple'
}

const rooms = seed.roomTypes.map((r) => {
  const code = `#${r.roomNumber}`
  const area = parseArea(r.detailSize || r.size)
  const nameEn = NAME_EN_MAP[code] || r.name
  const viewEn = VIEW_EN_MAP[r.view] || r.view || 'Valley & sea view'
  const group = determineGroup(r.roomNumber, r.capacity, r.name)
  const special = SPECIAL_META[code] || {}

  const amenitiesPairs = r.amenities.map((a) => [a, a])

  return {
    code,
    name: r.name,
    nameEn,
    area,
    cap: r.capacity,
    price: r.price,
    exPrice: r.extraBedFee,
    view: r.view || 'Hướng thung lũng / biển',
    viewEn,
    group,
    ...(special.tag ? { tag: special.tag, tagEn: special.tagEn } : {}),
    ...(special.hot ? { hot: special.hot } : {}),
    ...(special.darkTag ? { darkTag: special.darkTag } : {}),
    blurb: special.blurb || r.summary,
    blurbEn: special.blurbEn || r.summary,
    amenities: amenitiesPairs,
    conditions: r.conditions || [],
    description: r.description || [],
    images: r.images || [],
    reviews: special.reviews || [],
    shots: (r.images || []).length || 8,
  }
})

const code = `export interface RoomReview {
  who: string
  score: string
  text: string
  textEn: string
}

export interface Room {
  code: string
  name: string
  nameEn: string
  area: number
  cap: number
  price: number
  exPrice: number
  view: string
  viewEn: string
  group: 'couple' | 'family' | 'suite'
  tag?: string
  tagEn?: string
  hot?: number
  darkTag?: boolean
  blurb?: string
  blurbEn?: string
  amenities?: Array<[string, string]>
  conditions?: string[]
  description?: string[]
  images: string[]
  reviews?: RoomReview[]
  shots?: number
}

export const ROOMS: Room[] = ${JSON.stringify(rooms, null, 2)}

export const BASE_AMENITIES: Array<[string, string]> = [
  ['Phòng tắm riêng', 'Private bathroom'],
  ['Két an toàn', 'In-room safe'],
  ['Ấm đun nước', 'Electric kettle'],
  ['Wi-Fi miễn phí', 'Free Wi-Fi'],
  ['Ga trải giường & khăn tắm', 'Linen & towels'],
  ['Đưa đón bến tàu miễn phí', 'Free pier transfer'],
]

export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + '₫'
}

export function roomSlug(code: string): string {
  return 'ndh-room-' + code.replace(/[#]/g, '').replace(/-/g, '_')
}
`

await writeFile(TARGET_FILE, code, 'utf8')
console.log(`Đã ghi ${TARGET_FILE} — ${rooms.length} phòng với ảnh crawl.`)
