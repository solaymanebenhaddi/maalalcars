import React from 'react'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  brand?: string
  className?: string
  size?: number
}

/**
 * Normalizes brand name for logo matching
 */
function normalizeBrandKey(brand?: string): string {
  if (!brand) return ''
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

/**
 * High-definition vector SVG automotive brand emblems
 */
export function CarBrandLogo({ brand, className = 'h-5 w-5', size }: BrandLogoProps) {
  const key = normalizeBrandKey(brand)
  const style = size ? { width: size, height: size } : undefined

  switch (key) {
    case 'mercedes':
    case 'mercedesbenz':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Mercedes-Benz">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 2.5V12L4.5 17.5M12 12L19.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )

    case 'bmw':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="BMW">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1" />
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1" />
          <path d="M12 5A7 7 0 0 1 19 12H12V5Z" fill="#2563EB" opacity="0.85" />
          <path d="M5 12A7 7 0 0 1 12 19V12H5Z" fill="#2563EB" opacity="0.85" />
        </svg>
      )

    case 'audi':
      return (
        <svg viewBox="0 0 32 20" fill="none" className={className} style={style} aria-label="Audi">
          <circle cx="7" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="13" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="19" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="25" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )

    case 'porsche':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Porsche">
          <path
            d="M5 4H19C19.5 4 20 4.5 19.8 5L17.5 16C16.5 19.5 12 21 12 21C12 21 7.5 19.5 6.5 16L4.2 5C4 4.5 4.5 4 5 4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="#B45309"
            fillOpacity="0.2"
          />
          <path d="M8 8H16M9 12H15M10 16H14" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="#DC2626" />
        </svg>
      )

    case 'volkswagen':
    case 'vw':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Volkswagen">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M5.5 8.5L9.5 18L12 11.5L14.5 18L18.5 8.5M8 6.5L12 15L16 6.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'landrover':
    case 'rangerover':
      return (
        <svg viewBox="0 0 32 18" fill="none" className={className} style={style} aria-label="Land Rover / Range Rover">
          <ellipse cx="16" cy="9" rx="15" ry="8" stroke="#16A34A" strokeWidth="1.5" fill="#14532D" fillOpacity="0.3" />
          <path d="M7 9H25M9 7L13 11M23 7L19 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )

    case 'toyota':
      return (
        <svg viewBox="0 0 28 20" fill="none" className={className} style={style} aria-label="Toyota">
          <ellipse cx="14" cy="10" rx="13" ry="9" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="14" cy="7" rx="8" ry="4.5" stroke="currentColor" strokeWidth="1.3" />
          <ellipse cx="14" cy="10" rx="3.5" ry="7.5" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )

    case 'renault':
      return (
        <svg viewBox="0 0 20 24" fill="none" className={className} style={style} aria-label="Renault">
          <path
            d="M10 2L18 10L10 22L2 10L10 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M10 6L14 10L10 17L6 10L10 6Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'peugeot':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Peugeot">
          <path
            d="M6 3H18L19.5 12C19.5 17 12 21.5 12 21.5C12 21.5 4.5 17 4.5 12L6 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="#27272A"
          />
          <path
            d="M9 8C10 7 13 7 14 9C15 11 13 12 12 13V15M10 17H14"
            stroke="#38BDF8"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'dacia':
      return (
        <svg viewBox="0 0 28 18" fill="none" className={className} style={style} aria-label="Dacia">
          <rect x="2" y="2" width="24" height="14" rx="3" stroke="#CA8A04" strokeWidth="1.5" fill="#422006" fillOpacity="0.2" />
          <path d="M7 6H11L14 12H10L7 6ZM21 6H17L14 12H18L21 6Z" fill="#EAB308" />
        </svg>
      )

    case 'hyundai':
      return (
        <svg viewBox="0 0 28 20" fill="none" className={className} style={style} aria-label="Hyundai">
          <ellipse cx="14" cy="10" rx="13" ry="8" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M8.5 15L11 5M17 15L19.5 5M9.8 10H18.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'kia':
      return (
        <svg viewBox="0 0 28 16" fill="none" className={className} style={style} aria-label="Kia">
          <rect x="1.5" y="1.5" width="25" height="13" rx="3" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M5 12V4M5 8L9 4M5 8L9 12M12 12V4M15 12L18 4L21 12M16 10H20"
            stroke="#DC2626"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'jeep':
      return (
        <svg viewBox="0 0 28 16" fill="none" className={className} style={style} aria-label="Jeep">
          <rect x="1" y="2" width="26" height="12" rx="3" stroke="#EAB308" strokeWidth="1.2" fill="#713F12" fillOpacity="0.2" />
          <path d="M5 8V11C5 12 4 12 3 12M9 5V11M14 5V11M19 5V11M24 5H22C20.5 5 20.5 11 22 11H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )

    case 'volvo':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Volvo">
          <circle cx="11" cy="13" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 8L21 3M21 3H17M21 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="11.5" width="16" height="3" fill="#1E3A8A" rx="0.5" />
        </svg>
      )

    case 'ford':
      return (
        <svg viewBox="0 0 32 18" fill="none" className={className} style={style} aria-label="Ford">
          <ellipse cx="16" cy="9" rx="15" ry="8" stroke="#3B82F6" strokeWidth="1.5" fill="#1E3A8A" fillOpacity="0.4" />
          <path d="M10 11C12 7 15 6 18 8C20 10 22 11 24 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )

    case 'nissan':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Nissan">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2" y="10" width="20" height="4" rx="0.5" fill="#18181B" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )

    case 'cupra':
    case 'seat':
      return (
        <svg viewBox="0 0 24 20" fill="none" className={className} style={style} aria-label="Cupra">
          <path
            d="M4 3L12 11L20 3M8 17L12 13L16 17"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'ferrari':
      return (
        <svg viewBox="0 0 20 24" fill="none" className={className} style={style} aria-label="Ferrari">
          <rect x="2" y="2" width="16" height="20" rx="3" stroke="#EAB308" strokeWidth="1.5" fill="#FEF08A" fillOpacity="0.2" />
          <path d="M10 6C10 6 7 8 7 12C7 15 9 17 10 19C11 17 13 15 13 12C13 8 10 6 10 6Z" fill="#DC2626" />
        </svg>
      )

    case 'maserati':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Maserati">
          <path d="M12 2V18M6 8L12 18L18 8M7 4L6 8M17 4L18 8" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="20" r="1.5" fill="#0284C7" />
        </svg>
      )

    case 'lamborghini':
      return (
        <svg viewBox="0 0 22 24" fill="none" className={className} style={style} aria-label="Lamborghini">
          <path
            d="M11 2L20 6L18 19L11 23L4 19L2 6L11 2Z"
            stroke="#EAB308"
            strokeWidth="1.5"
            fill="#18181B"
          />
          <circle cx="11" cy="12" r="3" fill="#EAB308" />
        </svg>
      )

    case 'mini':
      return (
        <svg viewBox="0 0 32 18" fill="none" className={className} style={style} aria-label="Mini">
          <circle cx="16" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 7H10L8 11H2M30 7H22L24 11H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )

    case 'fiat':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Fiat">
          <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.5" fill="#991B1B" fillOpacity="0.2" />
          <text x="12" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            FIAT
          </text>
        </svg>
      )

    case 'citroen':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Citroën">
          <path d="M6 9L12 4L18 9M6 16L12 11L18 16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )

    case 'alfaromeo':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-label="Alfa Romeo">
          <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.5" fill="#18181B" />
          <path d="M7 12H12M9.5 9.5V14.5M14 9C15.5 9 17 10.5 17 12C17 13.5 15.5 15 14 15" stroke="#38BDF8" strokeWidth="1.3" />
        </svg>
      )

    default:
      // Monogram metallic fallback badge for any other brand
      const initials = (brand || 'CAR')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

      return (
        <div
          className={cn(
            'flex items-center justify-center rounded-md bg-[#252530] text-zinc-300 font-black text-[10px] border border-white/10 shadow-sm shrink-0',
            className
          )}
          style={style}
        >
          {initials}
        </div>
      )
  }
}
