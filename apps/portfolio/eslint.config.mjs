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
        ignores: ['node_modules/**', '.next/**', 'out/**', 'next-env.d.ts'],
    },
]

export default config
