import React from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

interface ActionAlertProps {
  error?: string | null
  success?: string | null
  info?: string | null
  dismissHref: string
}

export function ActionAlert({ error, success, info, dismissHref }: ActionAlertProps) {
  if (!error && !success && !info) return null

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/50 via-red-900/20 to-[#121216] p-4 shadow-lg flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30 mt-0.5">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Opération non effectuée</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                Alerte
              </span>
            </h4>
            <p className="text-xs text-red-200/90 mt-1 leading-relaxed">{error}</p>
          </div>
        </div>

        <Link
          href={dismissHref}
          className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors"
          title="Fermer cette notification"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/50 via-emerald-900/20 to-[#121216] p-4 shadow-lg flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-0.5">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Opération réussie</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Succès
              </span>
            </h4>
            <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">{success}</p>
          </div>
        </div>

        <Link
          href={dismissHref}
          className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors"
          title="Fermer cette notification"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  if (info) {
    return (
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/50 via-cyan-900/20 to-[#121216] p-4 shadow-lg flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30 mt-0.5">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Information</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Info
              </span>
            </h4>
            <p className="text-xs text-cyan-200/90 mt-1 leading-relaxed">{info}</p>
          </div>
        </div>

        <Link
          href={dismissHref}
          className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors"
          title="Fermer cette notification"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return null
}
