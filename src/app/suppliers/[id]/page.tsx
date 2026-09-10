'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'

export default function SupplierDetailPage() {
  const params = useParams()
  const code = (params?.id as string) || 'SUP-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/suppliers"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux fournisseurs</span>
        </Link>
      </div>

      {/* Main Container matching Reference #19 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Profile Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-28 items-center justify-center rounded-xl bg-white p-2.5 shadow-inner shrink-0">
              <span className="font-black text-red-600 text-lg tracking-wider">BOSCH</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  Bosch Automotive
                </h1>
                <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Actif
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Catégorie : Électronique</p>
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-400">
                <span>Contact : <strong className="text-zinc-300">Jean Dupont</strong></span>
                <span>jean.dupont@bosch.com</span>
                <span className="font-mono">+33 1 40 10 20 30</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-[11px] space-y-0.5 min-w-[160px] text-right">
              <div className="text-zinc-400 text-[10px]">Achats cumulés (2025)</div>
              <div className="font-mono font-black text-white text-base">198 450 €</div>
              <div className="text-[10px] text-zinc-500">24 commandes</div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
                <span>Actions</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
          <button className="font-bold text-white relative pb-1 shrink-0">
            <span>Aperçu</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Informations</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Contacts</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Produits</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Documents</button>
          <Link href={`/suppliers/${code}/purchases`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Achats
          </Link>
          <Link href={`/suppliers/${code}/evaluations`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Évaluations
          </Link>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Paiements</button>
        </div>

        {/* 3 Panels matching Reference #19 Screen 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Informations clés */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations clés
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Statut</span>
                <span className="text-emerald-400 font-bold">Actif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Catégorie</span>
                <span className="text-zinc-200">Électronique</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Sous-catégorie</span>
                <span className="text-zinc-200">Systèmes d&apos;injection</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Pays</span>
                <span className="text-zinc-200">Maroc 🇲🇦</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Ville</span>
                <span className="text-zinc-200 font-semibold text-red-400">Casablanca</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Adresse</span>
                <span className="text-zinc-300">Lot 12, Z.I. Sidi Maârouf</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">ICE / SIRET</span>
                <span className="font-mono text-zinc-300">002345678000034</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Site web</span>
                <a href="https://www.bosch.fr" target="_blank" rel="noreferrer" className="text-red-400 hover:text-red-300 flex items-center gap-0.5 font-mono">
                  <span>https://www.bosch.fr</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <div className="flex justify-between border-t border-[#202028] pt-2">
                <span className="text-zinc-400">Date d&apos;enregistrement</span>
                <span className="font-mono text-zinc-300">15/03/2018</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Performance</h3>
              <div className="font-mono font-black text-amber-400 text-sm">4,6 / 5 ★</div>
            </div>

            <div className="space-y-2.5 text-[11px]">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Qualité des produits</span>
                  <span className="font-mono font-bold text-white">4,7 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Respect des délais</span>
                  <span className="font-mono font-bold text-white">4,5 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service client</span>
                  <span className="font-mono font-bold text-white">4,6 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Compétitivité prix</span>
                  <span className="font-mono font-bold text-white">4,4 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Conformité</span>
                  <span className="font-mono font-bold text-white">4,7 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Résumé financier (2025) */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Résumé financier (2025)
            </h3>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Achats cumulés</span>
                <span className="font-mono font-bold text-white">198 450 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Montants payés</span>
                <span className="font-mono font-bold text-cyan-400">186 000 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Montants dus</span>
                <span className="font-mono font-bold text-red-400">12 450 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Nombre de commandes</span>
                <span className="font-mono font-bold text-white">24</span>
              </div>
              <div className="flex justify-between border-t border-[#202028] pt-2">
                <span className="text-zinc-400">Délai de paiement moyen</span>
                <span className="font-mono text-zinc-300">28 jours</span>
              </div>
            </div>

            <div className="rounded-lg bg-[#121216] border border-[#22222c] p-2 text-[10px] text-zinc-400 text-center">
              Conditions de paiement : <strong className="text-white">30 jours fin de mois</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
