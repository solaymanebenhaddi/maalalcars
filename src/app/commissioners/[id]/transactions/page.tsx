import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Eye,
  Edit2,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface BrokerTransaction {
  id: number
  reference: string
  client: string
  vehicle: string
  amount: string
  status: 'Confirmée' | 'En attente' | 'Annulée' | 'Perdue'
  date: string
}

const TRANSACTIONS: BrokerTransaction[] = [
  { id: 1, reference: 'VEN-2025-0156', client: 'Mohamed Idrissi', vehicle: 'Toyota Land Cruiser 2023', amount: '860 000 DH', status: 'Confirmée', date: '30/05/2025' },
  { id: 2, reference: 'VEN-2025-0142', client: 'Said Amrani', vehicle: 'BMW X5 2022', amount: '720 000 DH', status: 'Confirmée', date: '28/05/2025' },
  { id: 3, reference: 'VEN-2025-0129', client: 'Omar El Fassi', vehicle: 'Mercedes-Benz GLC 2023', amount: '650 000 DH', status: 'Confirmée', date: '25/05/2025' },
  { id: 4, reference: 'VEN-2025-0117', client: 'Youssef Hajji', vehicle: 'Audi Q7 2023', amount: '540 000 DH', status: 'En attente', date: '22/05/2025' },
  { id: 5, reference: 'VEN-2025-0104', client: 'Khalid Benbrahim', vehicle: 'Toyota RAV4 2023', amount: '310 000 DH', status: 'Confirmée', date: '19/05/2025' },
  { id: 6, reference: 'VEN-2025-0096', client: 'Souad Kabbaj', vehicle: 'Hyundai Tucson 2023', amount: '280 000 DH', status: 'Annulée', date: '18/05/2025' },
  { id: 7, reference: 'VEN-2025-0083', client: 'Anas Moutaouakil', vehicle: 'Dacia Duster 2023', amount: '190 000 DH', status: 'Perdue', date: '14/05/2025' },
]

export default async function CommissionerTransactionsPage({ params }: Props) {
  const { id } = await params
  const code = id || 'COM-00048'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/commissioners/${code}`}
          className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour Yassine Benali</span>
        </Link>
      </div>

      {/* Main Container matching Reference #16 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Transactions du commissionnaire
          </h1>
          <p className="text-xs text-zinc-400">
            Journal de toutes les ventes apportées par Yassine Benali
          </p>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Véhicule</th>
                <th className="py-2.5 px-3 text-right">Montant (DH)</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {TRANSACTIONS.map((t) => (
                <tr key={t.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{t.id}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{t.reference}</td>
                  <td className="py-3 px-3 font-medium text-zinc-300">{t.client}</td>
                  <td className="py-3 px-3 font-semibold text-white">{t.vehicle}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">{t.amount}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        t.status === 'Confirmée'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : t.status === 'En attente'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : t.status === 'Annulée'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-zinc-700/30 text-zinc-400 border border-zinc-700/50'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{t.date}</td>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 7 sur 26 transactions</span>
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
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
