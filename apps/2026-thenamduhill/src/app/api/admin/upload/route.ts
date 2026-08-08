import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { fail, ok } from '@/lib/auth/errors'
import { withAuthGuard } from '@/lib/auth/guard'

/**
 * `POST /api/admin/upload` — tải ảnh lên và TỰ TỐI ƯU.
 *
 * Yêu cầu gốc của chủ resort: *"tải ảnh lên và hệ thống tự tối ưu hình ảnh để
 * không phải xử lý thủ công trước khi đăng"*. Người dùng kéo thẳng ảnh 8MB từ
 * máy ảnh vào; route này nén, đổi sang WebP và trả về đường dẫn dùng được ngay.
 *
 * ─── VÌ SAO GHI VÀO `public/uploads/` CHỨ KHÔNG PHẢI BLOB STORAGE ───────────
 *
 * Đây là lựa chọn "nhanh nhất, nâng cấp sau" đã chốt với chủ dự án. Ưu điểm:
 * không tài khoản, không khoá API, không chi phí, chạy được ngay ở máy local.
 *
 * ⚠️ GIỚI HẠN PHẢI BIẾT TRƯỚC KHI LÊN PRODUCTION: filesystem của Vercel là
 * **ephemeral** — ảnh tải lên sẽ MẤT sau mỗi lần deploy, và hai instance
 * serverless không thấy file của nhau. Ở môi trường dev/demo thì hoàn toàn ổn.
 *
 * ĐƯỜNG NÂNG CẤP đã chừa sẵn: đổi đúng thân hàm `persist()` bên dưới sang
 * Supabase Storage (dự án đã có `@supabase/supabase-js`) hoặc Vercel Blob.
 * Hợp đồng request/response KHÔNG đổi, nên phía CMS không phải sửa dòng nào.
 *
 * ─── BẢO MẬT ───────────────────────────────────────────────────────────────
 *
 * Bọc `withAuthGuard(..., 'content.edit')` (luật BE2): chỉ tài khoản có quyền
 * sửa nội dung mới tải được ảnh. Không có nó thì đây là chỗ cho người lạ ghi
 * file tuỳ ý lên máy chủ.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Thư mục đích, tính từ gốc app. `public/` được Next phục vụ tĩnh. */
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

/** Tiền tố URL tương ứng với `UPLOAD_DIR`. */
const PUBLIC_PREFIX = '/uploads'

/** Trần dung lượng ảnh GỐC nhận vào. Ảnh máy ảnh full-frame hiếm khi vượt. */
const MAX_BYTES = 15 * 1024 * 1024

/**
 * Bề ngang tối đa sau khi nén.
 *
 * 2000px đủ cho ảnh hero tràn màn hình ở màn 2x mà vẫn cắt được phần lớn dung
 * lượng: ảnh 6000px từ máy ảnh xuống 2000px là giảm ~90% số điểm ảnh. Không
 * phóng to ảnh nhỏ hơn mức này (`withoutEnlargement`).
 */
const MAX_WIDTH = 2000

/** Định dạng ảnh chấp nhận. SVG bị loại — nó có thể chứa script. */
const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

/**
 * Tên file an toàn, giữ lại phần tên gốc để người dùng còn nhận ra ảnh của mình.
 *
 * Bỏ hết ký tự ngoài `[a-z0-9-]` (kể cả dấu tiếng Việt và dấu chấm) rồi gắn
 * hậu tố ngẫu nhiên. Hai việc cùng lúc: chặn path traversal (`../../etc`) và
 * chặn ghi đè khi hai người tải trùng tên file.
 */
function safeName(original: string): string {
    const base = path
        .basename(original, path.extname(original))
        .normalize('NFD')
        // Dải combining diacritics — viết bằng escape `\u` chứ không dán ký tự
        // dấu trực tiếp: file này sẽ bị sửa lại nhiều lần, mà dấu tổ hợp dán
        // thô rất dễ mất khi công cụ đổi bảng mã.
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60)

    const suffix = crypto.randomUUID().slice(0, 8)
    return `${base || 'anh'}-${suffix}.webp`
}

/**
 * Ghi ảnh đã nén xuống nơi lưu trữ, trả về URL công khai.
 *
 * ĐÂY LÀ ĐIỂM DUY NHẤT CẦN ĐỔI khi chuyển sang Supabase Storage / Vercel Blob.
 * Mọi thứ khác trong file (kiểm quyền, kiểm định dạng, nén) giữ nguyên.
 */
async function persist(fileName: string, data: Buffer): Promise<string> {
    // `recursive: true` để lần chạy đầu trên máy mới không vỡ vì thiếu thư mục.
    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(path.join(UPLOAD_DIR, fileName), data)
    return `${PUBLIC_PREFIX}/${fileName}`
}

export const POST = withAuthGuard(async (req) => {
    const form = await req.formData()
    const entry = form.get('file')

    if (!(entry instanceof File)) {
        return fail(400, 'NO_FILE', {
            vi: 'Chưa chọn ảnh. Chọn một tệp ảnh rồi tải lên lại.',
            en: 'No image selected. Pick an image file and upload again.',
        })
    }

    if (!ACCEPTED.has(entry.type)) {
        return fail(400, 'UNSUPPORTED_TYPE', {
            vi: 'Chỉ nhận ảnh JPG, PNG, WebP hoặc AVIF.',
            en: 'Only JPG, PNG, WebP or AVIF images are accepted.',
        })
    }

    if (entry.size > MAX_BYTES) {
        return fail(400, 'FILE_TOO_LARGE', {
            vi: `Ảnh vượt quá ${MAX_BYTES / 1024 / 1024}MB. Chọn ảnh nhỏ hơn.`,
            en: `Image exceeds ${MAX_BYTES / 1024 / 1024}MB. Choose a smaller file.`,
        })
    }

    const input = Buffer.from(await entry.arrayBuffer())

    let output: Buffer
    try {
        output = await sharp(input)
            // Xoay theo EXIF TRƯỚC khi resize: ảnh chụp dọc bằng điện thoại
            // mang cờ orientation, bỏ qua bước này thì ảnh nằm ngang khi hiển
            // thị. `rotate()` không tham số = đọc EXIF.
            .rotate()
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            // WebP quality 82: ngưỡng mắt thường không phân biệt được với bản
            // gốc trên ảnh phong cảnh, mà dung lượng chỉ còn ~15% JPEG gốc.
            .webp({ quality: 82 })
            .toBuffer()
    } catch (e) {
        // C3 — không nuốt lỗi. File hỏng hoặc không phải ảnh thật (đuôi giả)
        // rơi vào đây; trả 400 vì đó là lỗi dữ liệu vào, không phải lỗi máy chủ.
        console.error('[upload] sharp không xử lý được ảnh', {
            name: entry.name,
            type: entry.type,
            error: e,
        })
        return fail(400, 'INVALID_IMAGE', {
            vi: 'Không đọc được tệp ảnh. Thử lại với ảnh khác.',
            en: 'Could not read the image file. Try a different image.',
        })
    }

    const fileName = safeName(entry.name)
    const url = await persist(fileName, output)

    return ok(
        {
            url,
            fileName,
            /** Byte trước/sau nén — CMS hiện cho người dùng thấy đã tiết kiệm bao nhiêu. */
            originalBytes: entry.size,
            optimizedBytes: output.byteLength,
        },
        201,
    )
}, 'content.edit')
