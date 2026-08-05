import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
})

const config = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        // `ignores` PHẢI đứng một mình trong object riêng.
        //
        // Trong ESLint flat config, `ignores` chỉ loại trừ toàn cục khi nó là
        // khoá DUY NHẤT của object. Đặt chung với `rules` thì nó biến thành
        // điều kiện áp dụng của riêng block đó — `.next/**` vẫn bị lint, và
        // ESLint quét luôn bundle đã minify. Đó là nguồn gốc của 4.566 lỗi
        // `no-unused-expressions` từng thấy ở package này.
        //
        // next-env.d.ts do Next tự sinh, bắt buộc dùng triple-slash reference
        // và không được sửa bằng tay → cũng loại khỏi phạm vi lint.
        //
        // `figma/` là bundle bàn giao từ công cụ thiết kế: prototype HTML +
        // `image-slot.js` / `support.js` (3.136 dòng scaffold). CLAUDE.md §3
        // ghi rõ KHÔNG port hai file này, và grep xác nhận không file nguồn
        // nào import chúng. Chúng là tư liệu tham chiếu, không phải code sản
        // xuất — giữ lại để đối chiếu thiết kế nhưng không lint.
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'next-env.d.ts',
            'figma/**',
        ],
    },
    {
        rules: {
            '@next/next/no-img-element': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
]

export default config
