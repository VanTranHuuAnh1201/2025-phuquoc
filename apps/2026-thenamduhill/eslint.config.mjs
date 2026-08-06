import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
})

const config = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        // next-env.d.ts do Next tu sinh, bat buoc dung triple-slash reference
        // va khong duoc sua bang tay -> loai khoi pham vi lint.
        //
        // `.next-build/**` phai co MOT DONG RIENG voi `.next/**`: tu khi
        // `next.config.ts` tach distDir cho ban production, `pnpm build` ghi
        // vao thu muc do. Thieu no thi ESLint quet ca code Next tu sinh —
        // 5.650 loi gia (252 error) tu `types/routes.d.ts` va `validator.ts`,
        // du code that hoan toan sach.
        ignores: [
            'node_modules/**',
            '.next/**',
            '.next-build/**',
            'out/**',
            'next-env.d.ts',
        ],
    },
]

export default config
