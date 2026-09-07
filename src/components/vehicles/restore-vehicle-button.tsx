'use client'

import React, { useState } from 'react'
import { RotateCcw, Lock, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { WheelSpinner } from '@/components/ui/wheel-spinner'

interface Props {
  vehicleId: string
  vehicleTitle?: string
  isSuperAdmin: boolean
}

export function RestoreVehicleButton({ vehicleId, isSuperAdmin }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRestore = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isSuperAdmin) return
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/restore`, {
        method: 'POST',
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la restauration')
      }

      setSuccess(true)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-[#141418] py-2 px-2 text-[11px] text-zinc-400">
        <Lock className="h-3 w-3 text-amber-500" />
        <span>Restauration réservée au Super Admin</span>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 px-2 text-[11px] font-bold text-emerald-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Restauré en stock actif !</span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-1">
      {error && <div className="text-[10px] text-red-400 text-center">{error}</div>}
      <button
        type="button"
        onClick={handleRestore}
        disabled={isLoading}
        className="w-full flex h-8 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/50 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 hover:from-emerald-600/30 hover:to-emerald-500/30 text-emerald-300 px-3 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <WheelSpinner size="xs" speed="normal" glow={false} />
            <span>Restauration...</span>
          </>
        ) : (
          <>
            <RotateCcw className="h-3.5 w-3.5 text-emerald-400" />
            <span>Restaurer en stock (Super Admin)</span>
          </>
        )}
      </button>
    </div>
  )
}
