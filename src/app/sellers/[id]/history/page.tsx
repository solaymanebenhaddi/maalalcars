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

interface ActivityEvent {
  id: number
  datetime: string
  user: string
  action: string
  details: string
}

const EVENTS: ActivityEvent[] = [
  { id: 1, datetime: '30/05/2025 11:32', user: 'Admin Maalal', action: 'Ajout approvisionnement', details: 'Toyota Land Cruiser VX-R 2023 (435 000 DH)' },
  { id: 2, datetime: '29/05/2025 10:15', user: 'Admin Maalal', action: 'Ajout approvisionnement', details: 'BMW X5 xDrive30d 2021 (365 000 DH)' },
  { id: 3, datetime: '28/05/2025 16:45', user: 'Sarah Martin', action: 'Enregistrement paiement', details: 'Acompte 150 000 DH (virement)' },
  { id: 4, datetime: '28/05/2025 09:20', user: 'Admin Maalal', action: 'Ajout approvisionnement', details: 'Mercedes-Benz GLC 200 2022 (295 000 DH)' },
  { id: 5, datetime: '27/05/2025 14:30', user: 'Sarah Martin', action: 'Règlement partiel', details: 'Règlement 130 000 DH' },
  { id: 6, datetime: '26/05/2025 12:05', user: 'Admin Maalal', action: 'Ajout approvisionnement', details: 'Hyundai Tucson 2.0 CRDi 2021 (142 000 DH)' },
]

export default async function SellerHistoryPage({ params }: Props) {
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

      {/* Main Container matching Reference #15 Screen 6 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-4">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
              Historique d&apos;activité – Youssef El Idrissi
            </h1>
            <p className="text-xs text-zinc-400">
              Journal des activités et événements
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

        {/* Activity Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3 font-mono">Date &amp; Heure</th>
                <th className="py-2.5 px-3">Utilisateur</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {EVENTS.map((e) => (
                <tr key={e.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{e.id}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{e.datetime}</td>
                  <td className="py-3 px-3 font-medium text-white">{e.user}</td>
                  <td className="py-3 px-3 font-semibold text-zinc-200">{e.action}</td>
                  <td className="py-3 px-3 text-zinc-300">{e.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>6 résultats</span>
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
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
