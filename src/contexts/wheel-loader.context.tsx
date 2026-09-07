'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { WheelSpinner } from '@/components/ui/wheel-spinner'

interface WheelLoaderContextType {
  showWheelLoader: (message?: string) => void
  hideWheelLoader: () => void
  withWheelLoader: <T>(action: () => Promise<T>, message?: string) => Promise<T>
  isLoading: boolean
  message: string
}

const WheelLoaderContext = createContext<WheelLoaderContextType | null>(null)

export function WheelLoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('Traitement en cours...')

  const showWheelLoader = useCallback((msg?: string) => {
    setMessage(msg || 'Traitement en cours...')
    setIsLoading(true)
  }, [])

  const hideWheelLoader = useCallback(() => {
    setIsLoading(false)
  }, [])

  const withWheelLoader = useCallback(
    async <T,>(action: () => Promise<T>, msg?: string): Promise<T> => {
      showWheelLoader(msg)
      try {
        const result = await action()
        return result
      } finally {
        hideWheelLoader()
      }
    },
    [showWheelLoader, hideWheelLoader]
  )

  React.useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>
      showWheelLoader(customEvent.detail?.message)
    }
    const handleEnd = () => {
      hideWheelLoader()
    }

    window.addEventListener('maalal-crud-start', handleStart)
    window.addEventListener('maalal-crud-end', handleEnd)

    return () => {
      window.removeEventListener('maalal-crud-start', handleStart)
      window.removeEventListener('maalal-crud-end', handleEnd)
    }
  }, [showWheelLoader, hideWheelLoader])

  return (
    <WheelLoaderContext.Provider
      value={{ showWheelLoader, hideWheelLoader, withWheelLoader, isLoading, message }}
    >
      {children}

      {/* Global CRUD Action Wheel Spinner (Offset Blurred Layer Focused on the Wheel) */}
      {isLoading && (
        <div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/65 backdrop-blur-xl animate-in fade-in duration-200 select-none"
          role="dialog"
          aria-modal="true"
          aria-label={message}
        >
          {/* Ambient radial vignette focusing attention on the center wheel */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Ambient Red Brake Glow behind the wheel */}
            <div
              className="absolute w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(239, 68, 68, 0.45) 0%, rgba(220, 38, 38, 0.15) 50%, transparent 75%)',
                filter: 'blur(24px)',
              }}
            />

            {/* Rotating Michelin wheel simulating the automotive action */}
            <WheelSpinner size="xl" speed="fast" glow showGroundShadow />

            {/* Minimalist Telemetry Pill below wheel */}
            <div className="mt-6 flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0c0d12]/80 px-5 py-2 shadow-2xl backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-bold tracking-wider text-zinc-200 font-mono uppercase">
                {message}
              </span>
            </div>
          </div>
        </div>
      )}
    </WheelLoaderContext.Provider>
  )
}

export function useWheelLoader() {
  const context = useContext(WheelLoaderContext)
  if (!context) {
    throw new Error('useWheelLoader must be used within a WheelLoaderProvider')
  }
  return context
}
