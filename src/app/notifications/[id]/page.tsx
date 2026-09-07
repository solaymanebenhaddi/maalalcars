'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react'

export default function NotificationDetailPage() {
  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/notifications"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour à la liste</span>
        </Link>
      </div>

      {/* Main Container matching Reference #20 Screen 17A */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Alert Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/15 border border-red-500/30 text-red-500 shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  Paiement en retard
                </h1>
                <span className="inline-flex items-center rounded bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
                  Critique
                </span>
                <span className="inline-flex items-center rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  Paiements
                </span>
              </div>
              <p className="text-[11px] text-zinc-300">
                Facture FAC-2025-0049 en retard de 12 jours.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-[11px] space-y-1 min-w-[200px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Statut</span>
              <span className="font-bold text-amber-400">Non résolue</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Reçue le</span>
              <span className="font-mono text-white">30/05/2025 à 10:32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Échéance</span>
              <span className="font-mono text-red-400 font-bold">20/05/2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Priorité</span>
              <span className="text-red-400 font-bold">Élevée</span>
            </div>
          </div>
        </div>

        {/* 4 Detailed Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Détails */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Détails
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Type d&apos;alerte</span>
                <span className="text-white font-medium">Paiement en retard</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Facture</span>
                <span className="font-mono font-bold text-white">FAC-2025-0049</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Client</span>
                <span className="font-semibold text-white">Imane Zahri</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Montant dû</span>
                <span className="font-mono font-black text-red-400 text-sm">24 900,00 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date d&apos;échéance</span>
                <span className="font-mono text-zinc-300">20/05/2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Jours de retard</span>
                <span className="font-mono font-bold text-red-400">12 jours</span>
              </div>
              <div className="flex justify-between border-t border-[#202028] pt-2">
                <span className="text-zinc-400">Assignée à</span>
                <span className="text-zinc-200 font-semibold">Admin Maalal</span>
              </div>
            </div>
          </div>

          {/* Contexte */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Contexte
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Paiement partiel reçu</span>
                <span className="font-mono text-zinc-300">0,00 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Reste à payer</span>
                <span className="font-mono font-bold text-white">24 900,00 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Mode de paiement</span>
                <span className="text-zinc-200">Virement bancaire</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Référence paiement</span>
                <span className="font-mono text-zinc-300">PAY-2025-0049</span>
              </div>
              <div className="flex justify-between border-t border-[#202028] pt-2">
                <span className="text-zinc-400">Dernier rappel envoyé</span>
                <span className="font-mono text-zinc-300">28/05/2025 à 09:15</span>
              </div>
            </div>
          </div>

          {/* Actions recommandées */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Actions recommandées
            </h3>

            <ul className="space-y-2 text-[11px] text-zinc-300">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Contacter le client pour le paiement</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>Vérifier le mode de paiement</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Envoyer un rappel automatique</span>
              </li>
            </ul>

            <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Marquer comme résolue</span>
            </button>
          </div>

          {/* Historique */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Historique
            </h3>

            <div className="space-y-3 text-[11px]">
              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-red-500/10 text-red-400 shrink-0">
                  <AlertTriangle className="h-3 w-3" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-zinc-400">30/05/2025 à 10:32</div>
                  <div className="font-bold text-white">Alerte créée automatiquement</div>
                  <div className="text-[10px] text-zinc-500">Système</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Send className="h-3 w-3" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-zinc-400">28/05/2025 à 09:15</div>
                  <div className="font-bold text-white">Rappel envoyé au client</div>
                  <div className="text-[10px] text-zinc-500">Admin Maalal</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/10 text-amber-400 shrink-0">
                  <Clock className="h-3 w-3" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-zinc-400">20/05/2025 à 00:00</div>
                  <div className="font-bold text-white">Échéance de paiement</div>
                  <div className="text-[10px] text-zinc-500">Système</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
