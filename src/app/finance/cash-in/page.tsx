import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Download,
  Eye,
  Edit2,
} from 'lucide-react'

interface EncaissementRow {
  id: number
  date: string
  reference: string
  client: string
  method: string
  amount: string
  status: 'Reçu' | 'En attente'
}

const ENCAISSEMENTS: EncaissementRow[] = [
  { id: 1, date: '22/05/2025', reference: 'ENC-2025-0056', client: 'Imane Zahri', method: 'Virement bancaire', amount: '28 900 DH', status: 'Reçu' },
  { id: 2, date: '21/05/2025', reference: 'ENC-2025-0055', client: 'Youssef El Idrissi', method: 'Espèces', amount: '12 400 DH', status: 'Reçu' },
  { id: 3, date: '20/05/2025', reference: 'ENC-2025-0054', client: 'Karim Tala', method: 'Chèque', amount: '9 800 DH', status: 'Reçu' },
  { id: 4, date: '20/05/2025', reference: 'ENC-2025-0053', client: 'Sarah Benali', method: 'Virement bancaire', amount: '16 200 DH', status: 'Reçu' },
  { id: 5, date: '19/05/2025', reference: 'ENC-2025-0052', client: 'Omar Bennis', method: 'Espèces', amount: '7 350 DH', status: 'Reçu' },
  { id: 6, date: '18/05/2025', reference: 'ENC-2025-0051', client: 'Ayoub M\'rabet', method: 'Virement bancaire', amount: '24 900 DH', status: 'Reçu' },
  { id: 7, date: '18/05/2025', reference: 'ENC-2025-0050', client: 'Najla Zohra', method: 'Autre', amount: '3 600 DH', status: 'Reçu' },
]

export default function CashInPage() {
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

      {/* Main Container matching Reference #23 Screen 1 (Cash In) */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              Encaissements
            </h1>
            <p className="text-xs text-zinc-400">
              Finance &gt; Encaissements
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
            <div className="text-[10px] text-zinc-400">Total encaissé</div>
            <div className="font-mono font-black text-cyan-400 text-sm sm:text-base mt-1">458 760 DH</div>
            <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">↑ 18,2% ce mois</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Virements</div>
            <div className="font-mono font-bold text-white text-xs sm:text-sm mt-1">310 450 DH</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">67,6%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Espèces</div>
            <div className="font-mono font-bold text-white text-xs sm:text-sm mt-1">102 690 DH</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">22,4%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Chèques</div>
            <div className="font-mono font-bold text-white text-xs sm:text-sm mt-1">45 620 DH</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">10,0%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Autres</div>
            <div className="font-mono font-bold text-zinc-400 text-xs sm:text-sm mt-1">0 DH</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">0,0%</div>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex items-center justify-between pt-2">
          <h3 className="text-xs font-bold text-white">Liste des encaissements</h3>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>Nouvel encaissement</span>
          </button>
        </div>

        {/* 7-row Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Mode de paiement</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {ENCAISSEMENTS.map((e) => (
                <tr key={e.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-mono text-zinc-400 text-[11px]">{e.date}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{e.reference}</td>
                  <td className="py-3 px-3 font-medium text-white">{e.client}</td>
                  <td className="py-3 px-3 text-zinc-300">{e.method}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">{e.amount}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {e.status}
                    </span>
                  </td>
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
          Voir tout (48)
        </div>
      </div>
    </div>
  )
}
