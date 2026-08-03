'use client'

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  radius?: '6px' | '8px' | '12px' | 'full'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  radius = '6px',
  className = '',
  children,
  ...props
}: ButtonProps) {
  // Height & Text Size Mapping
  const sizeClasses = {
    xs: 'h-[30px] px-3 text-xs font-semibold',
    sm: 'h-[36px] px-3.5 text-xs font-semibold',
    md: 'h-[42px] px-5 text-sm font-semibold',
    lg: 'h-[46px] px-6 text-sm sm:text-[15px] font-semibold',
  }

  // Variant Styles Mapping
  const variantClasses = {
    primary: 'bg-[#1D4E89] hover:bg-[#163B6C] text-white shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-[#F5F7FA] hover:bg-[#E5E7EB] text-[#1D4E89] font-semibold active:scale-[0.98]',
    outline: 'bg-white border border-[#1D4E89] text-[#1D4E89] hover:bg-[#F5F7FA] active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-[#F5F7FA] text-[#1D4E89] active:scale-[0.98]',
    danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white active:scale-[0.98]',
  }

  // Radius Mapping (Default 6px per Figma reference)
  const radiusClasses = {
    '6px': 'rounded-[6px]',
    '8px': 'rounded-[8px]',
    '12px': 'rounded-[12px]',
    full: 'rounded-full',
  }

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${radiusClasses[radius]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
