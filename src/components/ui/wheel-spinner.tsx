'use client'

import React from 'react'

export type WheelSpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type WheelSpinnerSpeed = 'slow' | 'normal' | 'fast' | 'accel'

export interface WheelSpinnerProps {
  size?: WheelSpinnerSize | number
  speed?: WheelSpinnerSpeed
  className?: string
  glow?: boolean
  showGroundShadow?: boolean
  alt?: string
}

const SIZE_MAP: Record<WheelSpinnerSize, { wheel: number; shadow: number }> = {
  xs: { wheel: 18, shadow: 14 },
  sm: { wheel: 24, shadow: 18 },
  md: { wheel: 42, shadow: 32 },
  lg: { wheel: 64, shadow: 48 },
  xl: { wheel: 110, shadow: 80 },
}

export function WheelSpinner({
  size = 'md',
  speed = 'normal',
  className = '',
  glow = true,
  showGroundShadow = false,
  alt = 'Chargement...',
}: WheelSpinnerProps) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size]?.wheel || 42
  const shadowWidth = typeof size === 'number' ? Math.round(size * 0.75) : SIZE_MAP[size]?.shadow || 32

  const speedClass =
    speed === 'fast'
      ? 'animate-wheel-spin-fast'
      : speed === 'slow'
      ? '[animation:realistic-wheel-spin_1.5s_linear_infinite]'
      : speed === 'accel'
      ? 'animate-wheel-accel'
      : 'animate-wheel-spin'

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: showGroundShadow ? pixelSize + 8 : pixelSize }}
      role="status"
      aria-label={alt}
    >
      {/* Outer ambient red caliper glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity"
          style={{
            background:
              'radial-gradient(circle at 45% 45%, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.1) 50%, transparent 75%)',
            transform: 'scale(1.25)',
            filter: 'blur(4px)',
          }}
        />
      )}

      {/* Rotating Wheel Container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: pixelSize, height: pixelSize }}
      >
        {/* The rotating Michelin Cup 2 R wheel */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wheel.png"
          alt={alt}
          width={pixelSize}
          height={pixelSize}
          draggable={false}
          className={`w-full h-full object-contain pointer-events-none will-change-transform ${speedClass}`}
          style={{
            filter: glow
              ? 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.45)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))'
              : 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5))',
          }}
        />

        {/* Stationary specular optical highlight: gives authentic 3D realism to the spinning rim */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            background:
              'radial-gradient(ellipse at 32% 24%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 30%, transparent 60%)',
          }}
        />
      </div>

      {/* Realistic contact patch ground shadow */}
      {showGroundShadow && (
        <div
          className="mt-0.5 h-1.5 rounded-[100%] bg-black/80 blur-[2px] animate-wheel-shadow pointer-events-none"
          style={{ width: shadowWidth }}
        />
      )}
    </div>
  )
}
