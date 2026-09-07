'use client'

import React, { useEffect, useState } from 'react'

const BRAND_LETTERS = ['M', 'A', 'A', 'L', 'A', 'L', ' ', 'C', 'A', 'R'] as const

export function AppInitialLoader() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [progress, setProgress] = useState(12)
  const [activeLetterCount, setActiveLetterCount] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    let fadeTimeout: NodeJS.Timeout | null = null

    const runAnimation = () => {
      if (interval) clearInterval(interval)
      if (fadeTimeout) clearTimeout(fadeTimeout)

      setProgress(0)
      setActiveLetterCount(0)
      setIsFadingOut(false)
      setIsVisible(true)

      const startTime = Date.now()
      const totalDuration = 3000 // 3.0 seconds total intro

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const rawPct = Math.min(100, Math.round((elapsed / (totalDuration - 500)) * 100))
        setProgress(rawPct)

        // Stagger letters reveal: 10 letters spread across the first 1.5s
        const letterIndex = Math.min(
          BRAND_LETTERS.length,
          Math.max(1, Math.floor((elapsed / 1500) * BRAND_LETTERS.length) + 1)
        )
        setActiveLetterCount(letterIndex)

        if (elapsed >= totalDuration) {
          if (interval) clearInterval(interval)
          setIsFadingOut(true)
          sessionStorage.setItem('maalal_app_initial_loaded', 'true')
          fadeTimeout = setTimeout(() => {
            setIsVisible(false)
          }, 650)
        }
      }, 35)
    }

    // Run on initial load if not seen in this session
    const hasLoaded = sessionStorage.getItem('maalal_app_initial_loaded')
    if (!hasLoaded) {
      runAnimation()
    }

    // Listen for custom replay event (e.g. from topbar button or login)
    const handleReplay = () => {
      sessionStorage.removeItem('maalal_app_initial_loaded')
      runAnimation()
    }

    // Reset flag on page reload so F5/Refresh plays the intro animation
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('maalal_app_initial_loaded')
    }

    window.addEventListener('replay-maalal-intro', handleReplay)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      if (interval) clearInterval(interval)
      if (fadeTimeout) clearTimeout(fadeTimeout)
      window.removeEventListener('replay-maalal-intro', handleReplay)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070709] transition-all duration-700 select-none cursor-default ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(220, 38, 38, 0.22) 0%, rgba(18, 18, 24, 0.85) 45%, #070709 85%),
          linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
      }}
      aria-label="Chargement initial de l'application MAALAL CARS"
    >

      {/* Main Wheel Staging Area */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Ambient Red Glow Halo behind wheel */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '320px',
            height: '320px',
            background:
              'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.15) 45%, transparent 75%)',
            filter: 'blur(28px)',
            animation: 'wheel-shadow-pulse 2s ease-in-out infinite',
          }}
        />

        {/* Speed streak particles radiating when wheel speeds up */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            transform: 'scale(1.28)',
            border: '2px dashed rgba(239, 68, 68, 0.25)',
            borderRadius: '50%',
            animation: 'realistic-wheel-spin 1.2s linear infinite',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            transform: 'scale(1.42)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animation: 'realistic-wheel-spin 3s linear infinite reverse',
          }}
        />

        {/* Wheel Assembly (Tire + Specular Highlight + Acceleration) */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
          {/* Rotating Wheel image: accelerates realistically from slow to fast */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wheel.png"
            alt="Roue Michelin Pilot Sport Cup 2 R - MAALAL CARS"
            width={260}
            height={260}
            draggable={false}
            className="w-full h-full object-contain pointer-events-none animate-wheel-accel"
            style={{
              filter:
                'drop-shadow(0 0 20px rgba(220, 38, 38, 0.5)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.9))',
            }}
          />

          {/* Stationary Specular Highlight: stationary light reflection across spinning rim spokes */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay opacity-50"
            style={{
              background:
                'radial-gradient(ellipse at 32% 24%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.25) 30%, transparent 65%)',
            }}
          />

          {/* Caliper Red Highlight Flare */}
          <div
            className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, transparent 70%)',
              filter: 'blur(6px)',
              animation: 'wheel-caliper-glow 1.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Realistic Ground Shadow & Showroom Asphalt Reflection */}
        <div className="relative -mt-3 flex flex-col items-center">
          {/* Main contact patch ground shadow */}
          <div
            className="h-4 rounded-[100%] bg-black/90 blur-[5px] pointer-events-none animate-wheel-shadow"
            style={{ width: '180px' }}
          />
          {/* Secondary ambient shadow */}
          <div
            className="h-2 -mt-2 rounded-[100%] bg-red-950/40 blur-[8px] pointer-events-none"
            style={{ width: '220px' }}
          />
        </div>
      </div>

      {/* Brand Title: "MAALAL CAR" Letter-by-Letter in CHANGA ONE Font */}
      <div className="mt-8 flex flex-col items-center">
        <div
          className="font-changa flex items-center tracking-widest text-3xl sm:text-5xl md:text-6xl font-black uppercase select-none"
          style={{
            fontFamily: "'Changa One', cursive, sans-serif",
            letterSpacing: '0.18em',
          }}
        >
          {BRAND_LETTERS.map((char: string, index: number) => {
            const isRevealed = index < activeLetterCount
            if (char === ' ') {
              return (
                <span key={index} className="inline-block w-4 sm:w-6">
                  &nbsp;
                </span>
              )
            }
            return (
              <span
                key={index}
                className="inline-block transition-all duration-300"
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.6)',
                  filter: isRevealed ? 'blur(0px)' : 'blur(8px)',
                  color: index >= 7 ? '#ef4444' : '#ffffff',
                  textShadow: isRevealed
                    ? index >= 7
                      ? '0 0 25px rgba(239, 68, 68, 0.9), 0 0 50px rgba(220, 38, 38, 0.6), 0 4px 10px rgba(0,0,0,0.9)'
                      : '0 0 20px rgba(255, 255, 255, 0.6), 0 0 35px rgba(220, 38, 38, 0.4), 0 4px 10px rgba(0,0,0,0.9)'
                    : 'none',
                }}
              >
                {char}
              </span>
            )
          })}
        </div>

        {/* Subtitle / Telemetry */}
        <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
          <span>Plateforme Automobile Premium</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500 font-bold">Maroc</span>
        </div>

        {/* High-Tech Gauge Progress Bar */}
        <div className="mt-6 w-64 sm:w-80 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="text-red-400 font-bold">RPM</span>
              <span className="text-zinc-500">ACCÉLÉRATION</span>
            </span>
            <span className="font-bold text-white font-mono">{progress}%</span>
          </div>

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-900 border border-zinc-800">
            {/* Red Gradient progress fill */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-amber-400 transition-all duration-75"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.8)',
              }}
            />
          </div>

          <div className="flex justify-between text-[9px] font-mono text-zinc-600 pt-0.5">
            <span>0 KM/H</span>
            <span>INITIALISATION DU SYSTÈME</span>
            <span>MAX REV</span>
          </div>
        </div>
      </div>
    </div>
  )
}
