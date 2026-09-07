import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Download,
  ChevronDown,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface EventRecord {
  id: number
  date: string
  event: string
  details: string
  user: string
}

const EVENTS: EventRecord[] = [
  { id: 1, date: '30/05/2025 11:20', event: 'Commande créée', details: 'CMD-2025-028 • Toyota Land Cruiser 2023', user: 'Admin Maalal' },
  { id: 2, date: '30/05/2025 11:22', event: 'Facture émise', details: 'FAC-2025-0487 • 86 500 DH', user: 'Admin Maalal' },
  { id: 3, date: '29/05/2025 16:45', event: 'Paiement enregistré', details: '25 000 DH • Virement bancaire', user: 'Admin Maalal' },
  { id: 4, date: '25/05/2025 10:15', event: 'Commande créée', details: 'CMD-2025-027 • BMW X5 2021', user: 'Nadia K.' },
  { id: 5, date: '24/05/2025 14:30', event: 'Paiement enregistré', details: '20 000 DH • Espèces', user: 'Nadia K.' },
  { id: 6, date: '20/05/2025 09:50', event: 'Statut modifié', details: 'Encours mis à jour à 24 900 DH', user: 'Admin Maalal' },
  { id: 7, date: '18/05/2025 16:10', event: 'Paiement enregistré', details: '15 000 DH • Chèque', user: 'Admin Maalal' },
]

export default async function BuyerHistoryPage({ params }: Props) {
  const { id } = await params
  const code = id || 'CLT-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/buyers/${code}`}
            className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
        </div>

        <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
          <span>Action rapide</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </button>
      </div>

      {/* Main Container matching Reference #14 Screen 6 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Banner */}
        <div className="flex items-center justify-between border-b border-[#222228] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1e1e28] border border-[#2a2a38] text-base font-black text-white font-mono">
              IZ
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                Imane Zahiri
              </h1>
              <span className="text-zinc-400 text-xs">Historique de l&apos;acheteur</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <Link
            href={`/buyers/${code}`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Aperçu
          </Link>
          <Link
            href={`/buyers/${code}/transactions`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Transactions
          </Link>
          <Link
            href={`/buyers/${code}/payments`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Paiements
          </Link>
          <button className="font-bold text-white relative pb-1">
            <span>Historique</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <select className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
              <option>Tous les événements ⌄</option>
              <option>Commandes créées</option>
              <option>Factures émises</option>
              <option>Paiements enregistrés</option>
              <option>Statuts modifiés</option>
            </select>

            <select className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
              <option>Toutes les dates ⌄</option>
              <option>Mai 2025</option>
              <option>Avril 2025</option>
            </select>

            <div className="relative flex items-center min-w-[220px]">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Rechercher dans l'historique..."
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button className="flex h-8 items-center gap-1.5 rounded border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>

        {/* Events Table matching Reference #14 Screen 6 */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3">Événement</th>
                <th className="py-2.5 px-3">Détails</th>
                <th className="py-2.5 px-3">Utilisateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {EVENTS.map((e) => (
                <tr key={e.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{e.id}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{e.date}</td>
                  <td className="py-3 px-3 font-semibold text-white">{e.event}</td>
                  <td className="py-3 px-3 text-zinc-300">{e.details}</td>
                  <td className="py-3 px-3 font-medium text-zinc-300">{e.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400">
          <span>18 événements</span>
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
