'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface FeatureFlagDetail {
  id: string
  key: string
  label: string
  description: string | null
  enabled: boolean
  category: string
  sortOrder: number
}

interface FeaturesContextType {
  flags: Record<string, boolean>
  details: FeatureFlagDetail[]
  isEnabled: (key: string) => boolean
  isLoading: boolean
  refreshFeatures: () => Promise<void>
}

// Fallback initial flags matching the MVP approved spec
const DEFAULT_FLAGS: Record<string, boolean> = {
  dashboard: true,
  vehicles: true,
  repairs: true,
  reservations: true,
  sales: true,
  documents: true,
  settings: true,
}

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined)

export function FeaturesProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<Record<string, boolean>>(DEFAULT_FLAGS)
  const [details, setDetails] = useState<FeatureFlagDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshFeatures = useCallback(async () => {
    try {
      const res = await fetch('/api/features')
      if (res.ok) {
        const data = await res.json()
        if (data.flags) setFlags(data.flags)
        if (data.details) setDetails(data.details)
      }
    } catch (err) {
      console.error('Failed to reload feature flags:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    fetch('/api/features')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          if (data.flags) setFlags(data.flags)
          if (data.details) setDetails(data.details)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load feature flags:', err)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  const isEnabled = useCallback(
    (key: string): boolean => {
      // If flag is explicitly in the dictionary, return its boolean value; otherwise default to false
      return flags[key] ?? false
    },
    [flags]
  )

  return (
    <FeaturesContext.Provider
      value={{
        flags,
        details,
        isEnabled,
        isLoading,
        refreshFeatures,
      }}
    >
      {children}
    </FeaturesContext.Provider>
  )
}

export function useFeatures() {
  const context = useContext(FeaturesContext)
  if (!context) {
    throw new Error('useFeatures must be used within a FeaturesProvider')
  }
  return context
}
