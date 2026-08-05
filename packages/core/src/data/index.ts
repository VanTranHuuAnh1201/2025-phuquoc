/**
 * ĐẦU MỐI DỮ LIỆU DUY NHẤT của toàn bộ nền tảng.
 *
 * Đây là "seed db common": MỘT bản `PropertyData`, cả N theme (h1…h4 và mọi
 * theme thêm sau) đọc chung đúng bản này qua `repository.ts` (luật R8). Không
 * được nhân bản dữ liệu theo theme — đổi giá một chỗ phải phản ánh ở cả N giao
 * diện, đó chính là lý do kiến trúc này tồn tại.
 *
 * Ai import cái gì:
 * - `repository.ts`  → import `propertyData` từ file này. Chỉ mình nó.
 * - `packages/theme-*` → KHÔNG import file này, cũng không import bất kỳ file
 *   nào trong `data/`. Theme đi qua `getProperty()`, `getRooms()`…
 *
 * Ba file dữ liệu trong thư mục này, để người sau khỏi phải đoán:
 * - `nam-du-hill.ts`                 dữ liệu thủ công, song ngữ đầy đủ mọi
 *                                    section — nền của mọi thứ.
 * - `nam-du-hill.seed.generated.ts`  dữ liệu crawl thô, SINH TỰ ĐỘNG, đừng sửa.
 * - `seed-dto.ts`                    ánh xạ crawl thô → kiểu core.
 * Không file nào trong số đó là điểm vào. Điểm vào là file này.
 */

import { namDuHill } from './nam-du-hill'
import { namDuHillSeed } from './nam-du-hill.seed.generated'
import { mergeSeed } from './seed-dto'
import { readEnv } from '@repo/utils'
import type { PropertyData } from '../types'

export type { SeedData, SeedRoomType, SeedPolicies } from './seed-dto'
export { mapSeedToRooms, mapSeedToRoomExtras, mergeSeed, propertyImages } from './seed-dto'

/**
 * Có bật nguồn crawl không?
 *
 * MẶC ĐỊNH: BẬT, kể cả ở production.
 *
 * Đây là bản POC dựng cho CHÍNH The Nam Du Hill xem — nội dung và ảnh crawl là
 * của họ, đưa lại cho họ. Vì vậy ngoại lệ so với luật R9: dữ liệu này được lên
 * production trong phạm vi bản demo này.
 *
 * Hệ quả phải nhớ khi bán cho khách KHÁC: bản seed này gắn với một cơ sở lưu
 * trú cụ thể, không phải nội dung dùng lại được. Khách mới thì tắt cờ đi và
 * thay bằng nội dung của họ:
 *     USE_CRAWLED_SEED=0
 *
 * Lưu ý còn tồn: phần tiếng Anh trong seed mới là bản sao tiếng Việt (xem các
 * `// TODO: dịch` trong `seed-dto.ts`), nên bản EN chưa dùng để chốt với khách.
 *
 * Vì sao là một cờ chứ không phải hai export song song (`namDuHill` và
 * `namDuHillWithSeed`)? Hai export nghĩa là mỗi nơi gọi tự chọn một bản, và chỉ
 * cần một theme chọn khác là hết "một nguồn sự thật". Một cờ, một đầu ra —
 * người dùng không phải chọn, và không thể chọn sai.
 */
const useCrawledSeed = readEnv('USE_CRAWLED_SEED') !== '0'

/**
 * Bản dữ liệu chính thức mà repository phục vụ.
 *
 * Khi thay bằng Supabase / REST, xoá hằng này và sửa THÂN các hàm trong
 * `repository.ts` — chữ ký giữ nguyên nên theme không phải sửa một dòng nào.
 */
export const propertyData: PropertyData = useCrawledSeed
    ? mergeSeed(namDuHill, namDuHillSeed)
    : namDuHill
