/**
 * Sinh hash bcrypt cho 4 tài khoản nhân viên demo — ticket 200-01 §6.5.
 *
 * Vì sao tách khỏi build-seed.ts: mật khẩu THÔ không được đi qua file sinh SQL,
 * và tuyệt đối không được commit vào seed (§6.5 / 000-03 §6.7). Script này chỉ
 * xuất `staff-hashes.json` (đã gitignore) chứa hash; mật khẩu thô in ra màn
 * hình đúng một lần để người chạy chép vào MANUAL.md M12.
 *
 * Cost 12 theo BE10 điều 2. Băm ở Node runtime, KHÔNG ở middleware Edge (BE11).
 *
 * Chạy:  node resources/scripts/seed/hash-staff-passwords.mjs
 *        node resources/scripts/seed/hash-staff-passwords.mjs --fixed
 *
 * `--fixed` dùng mật khẩu cố định đã ghi ở MANUAL.md M12 để sinh lại đúng bộ
 * hash cũ (hash bcrypt khác nhau mỗi lần vì salt ngẫu nhiên, nhưng cùng verify
 * được — nên chỉ chạy lại khi thật sự cần đổi mật khẩu).
 */

import { randomBytes } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import bcrypt from 'bcryptjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const COST = 12
const ROLES = ['owner', 'manager', 'receptionist', 'editor']

/**
 * Mật khẩu mặc định của bản demo. Đã ghi vào MANUAL.md M12.
 *
 * Đây là dữ liệu DEMO trên DB demo, không phải bí mật production — nhân viên
 * thật (M9) sẽ nhận mật khẩu ngẫu nhiên khi bàn giao ở 300-04. Ghi rõ ở đây để
 * QC đăng nhập được mà không phải đi hỏi ai (đang chặn 000-02 / 000-03).
 */
const FIXED_PASSWORDS = {
    owner: 'NamDu@Owner2026',
    manager: 'NamDu@Manager2026',
    receptionist: 'NamDu@Reception2026',
    editor: 'NamDu@Editor2026',
}

const useFixed = process.argv.includes('--fixed')

const passwords = {}
for (const role of ROLES) {
    passwords[role] = useFixed
        ? FIXED_PASSWORDS[role]
        : `${randomBytes(9).toString('base64url')}!Aa1`
}

const hashes = {}
for (const role of ROLES) {
    hashes[role] = bcrypt.hashSync(passwords[role], COST)
}

const outPath = resolve(HERE, 'staff-hashes.json')
writeFileSync(outPath, `${JSON.stringify(hashes, null, 4)}\n`, 'utf8')

console.log(`Đã ghi hash bcrypt (cost ${COST}) vào ${outPath}`)
console.log('')
console.log('Mật khẩu thô — chép vào MANUAL.md M12, KHÔNG commit file này:')
for (const role of ROLES) {
    console.log(`  ${role.padEnd(14)} ${passwords[role]}`)
}
