import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Filter,
  Download,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface SellerTransaction {
  id: number
  type: string
  reference: string
  description: string
  date: string
  amount: string
  status: 'En attente' | 'Payé'
}

const TRANSACTIONS: SellerTransaction[] = [
  { id: 1, type: 'Paiement', reference: 'PAY-2025-0058', description: 'Toyota Land Cruiser VX-R 2023', date: '30/05/2025', amount: '435 000 DH', status: 'En attente' },
  { id: 2, type: 'Paiement', reference: 'PAY-2025-0057', description: 'BMW X5 xDrive30d 2021', date: '29/05/2025', amount: '266 000 DH', status: 'En attente' },
  { id: 3, type: 'Règlement', reference: 'REG-2025-0142', description: 'Acompte (virement)', date: '29/05/2025', amount: '150 000 DH', status: 'Payé' },
  { id: 4, type: 'Paiement', reference: 'PAY-2025-0056', description: 'Mercedes GLC 200 2022', date: '28/05/2025', amount: '295 000 DH', status: 'En attente' },
  { id: 5, type: 'Règlement', reference: 'REG-2025-0140', description: 'Règlement partiel', date: '27/05/2025', amount: '120 000 DH', status: 'Payé' },
]

export default async function SellerTransactionsPage({ params }: Props) {
  const { id } = await params
  const code = id || 'VEN-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/sellers/${code}`}
          className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au dossier</span>
        </Link>
      </div>

      {/* Main Container matching Reference #15 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-4">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
              Transactions de Youssef El Idrissi
            </h1>
            <p className="text-xs text-zinc-400">
              Toutes les transactions avec ce vendeur
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <span>Filtres</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs matching Reference #15 Screen 5 */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Toutes (32)</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">
            Paiements (17)
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">
            Règlements (15)
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Véhicule / Description</th>
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3 text-right">Montant (DH)</th>
                <th className="py-2.5 px-3 text-center">Actions / Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {TRANSACTIONS.map((t) => (
                <tr key={t.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{t.id}</td>
                  <td className="py-3 px-3 font-semibold text-zinc-300">{t.type}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{t.reference}</td>
                  <td className="py-3 px-3 text-zinc-300">{t.description}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{t.date}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {t.amount}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        t.status === 'Payé'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>5 résultats</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ‹
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
              1
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              2
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              3
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              4
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              5
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
