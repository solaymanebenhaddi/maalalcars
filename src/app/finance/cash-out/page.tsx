'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Download,
  Eye,
  Edit2,
} from 'lucide-react'

interface DecaissementRow {
  id: number
  date: string
  reference: string
  category: string
  beneficiary: string
  method: string
  amount: string
}

const DECAISSEMENTS: DecaissementRow[] = [
  { id: 1, date: '22/05/2025', reference: 'DEC-2025-0048', category: 'Achat véhicules', beneficiary: 'Auto Market Rabat', method: 'Virement', amount: '38 900 DH' },
  { id: 2, date: '21/05/2025', reference: 'DEC-2025-0047', category: 'Loyer', beneficiary: 'Local Maalal Cars', method: 'Virement', amount: '12 000 DH' },
  { id: 3, date: '20/05/2025', reference: 'DEC-2025-0046', category: 'Carburant', beneficiary: 'Afriquia', method: 'Carte bancaire', amount: '5 450 DH' },
  { id: 4, date: '20/05/2025', reference: 'DEC-2025-0045', category: 'Assurance', beneficiary: 'Atlanta Assurance', method: 'Virement', amount: '8 750 DH' },
  { id: 5, date: '19/05/2025', reference: 'DEC-2025-0044', category: 'Salaires', beneficiary: 'Personnel Maalal Cars', method: 'Virement', amount: '56 000 DH' },
  { id: 6, date: '18/05/2025', reference: 'DEC-2025-0043', category: 'Marketing', beneficiary: 'Agence Digital Pro', method: 'Virement', amount: '4 600 DH' },
  { id: 7, date: '17/05/2025', reference: 'DEC-2025-0042', category: 'Entretien atelier', beneficiary: 'Garage Express', method: 'Espèces', amount: '3 250 DH' },
]

export default function CashOutPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/finance"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au tableau de bord</span>
        </Link>
      </div>

      {/* Main Container matching Reference #23 Screen 2 (Cash Out) */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              Décaissements
            </h1>
            <p className="text-xs text-zinc-400">
              Finance &gt; Décaissements
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Ce mois</option>
              <option>Ce trimestre</option>
              <option>Cette année</option>
            </select>

            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* 5 Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Total décaissements</div>
            <div className="font-mono font-black text-red-400 text-sm sm:text-base mt-1">276 310 DH</div>
            <div className="text-[9px] text-red-400 font-semibold mt-0.5">↑ 9,6% ce mois</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Charges fixes</div>
            <div className="font-mono font-bold text-white text-xs sm:text-sm mt-1">98 450 DH</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">35,6%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Achats &amp; Stock</div>
            <div className="font-mono font-bold text-white text-xs sm:text-sm mt-1">112 750 DH</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">40,8%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Frais d&apos;exploitation</div>
            <div className="font-mono font-bold text-white text-xs sm:text-sm mt-1">41 860 DH</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">15,1%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Autres</div>
            <div className="font-mono font-bold text-white text-xs sm:text-sm mt-1">23 250 DH</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">8,4%</div>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex items-center justify-between pt-2">
          <h3 className="text-xs font-bold text-white">Liste des décaissements</h3>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>Nouveau décaissement</span>
          </button>
        </div>

        {/* 7-row Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Fournisseur / Bénéficiaire</th>
                <th className="py-2.5 px-3">Mode de paiement</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {DECAISSEMENTS.map((d) => (
                <tr key={d.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-mono text-zinc-400 text-[11px]">{d.date}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{d.reference}</td>
                  <td className="py-3 px-3 text-zinc-300">{d.category}</td>
                  <td className="py-3 px-3 font-medium text-white">{d.beneficiary}</td>
                  <td className="py-3 px-3 text-zinc-300">{d.method}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-red-400">{d.amount}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Voir">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Modifier">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-2 text-[11px] text-zinc-400">
          Voir tout (52)
        </div>
      </div>
    </div>
  )
}
