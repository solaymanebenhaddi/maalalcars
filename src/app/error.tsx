'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home, Car } from 'lucide-react'

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log unexpected runtime errors for diagnostic auditing
    console.error('Captured by Next.js Global Error Boundary:', error)
  }, [error])

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-red-500/30 bg-[#121216]/95 backdrop-blur-xl p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/30 flex items-center justify-center text-red-500 shadow-inner">
          <AlertTriangle className="h-8 w-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            Alerte Système
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight pt-2">
            Une opération a rencontré un imprévu
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            {error?.message || 'L\'opération demandée n\'a pas pu aboutir. Vos données restent en sécurité.'}
          </p>
        </div>

        {error?.digest && (
          <div className="text-[10px] font-mono text-zinc-500 bg-[#0c0c0e] py-1 px-3 rounded-lg border border-[#202028] max-w-xs mx-auto truncate">
            Code d&apos;incident : {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Réessayer l&apos;action</span>
          </button>

          <Link
            href="/vehicles"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#2e2e38] bg-[#181820] text-zinc-300 font-semibold text-xs hover:bg-[#22222c] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Car className="h-4 w-4" />
            <span>Véhicules</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#2e2e38] bg-[#181820] text-zinc-300 font-semibold text-xs hover:bg-[#22222c] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Accueil</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
