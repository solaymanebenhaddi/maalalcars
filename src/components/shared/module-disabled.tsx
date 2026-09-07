import React from 'react'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'

interface ModuleDisabledProps {
  moduleName?: string
  featureKey?: string
}

export function ModuleDisabled({ moduleName, featureKey }: ModuleDisabledProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-[#282832] bg-[#121216] p-8 shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-950/30 text-red-500 shadow-inner">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <h2 className="text-xl font-black tracking-tight text-white">
          Ce module n&apos;est pas encore disponible
        </h2>

        {moduleName && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-red-400">
            {moduleName}
          </p>
        )}

        <p className="mt-3 text-xs leading-relaxed text-zinc-400">
          Ce module est actuellement désactivé dans le cadre de la configuration active du parc.
          Contactez votre administrateur pour l&apos;activer.
        </p>

        {featureKey && (
          <div className="mt-3 inline-block rounded-md border border-[#252530] bg-[#181820] px-2.5 py-1 text-[11px] font-mono text-zinc-500">
            clé: {featureKey}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Home className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
          <Link
            href="/vehicles"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#2e2e38] bg-[#181820] px-4 text-xs font-semibold text-zinc-300 hover:bg-[#22222c] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voir les véhicules
          </Link>
        </div>
      </div>
    </div>
  )
}
