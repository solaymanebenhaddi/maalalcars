import React from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit2,
  Phone,
  LayoutDashboard,
  MoreHorizontal,
  MapPin,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface CommissionerRow {
  id: number
  code: string
  name: string
  phone: string
  city: string
  status: 'Actif' | 'En attente' | 'Inactif'
  transactions: number
  salesVolume: string
  commissionEarned: string
  conversionRate: string
}

const COMMISSIONERS: CommissionerRow[] = [
  { id: 1, code: 'COM-00048', name: 'Yassine Benali', phone: '+212 6 61 23 45 67', city: 'Casablanca', status: 'Actif', transactions: 26, salesVolume: '5 845 000 DH', commissionEarned: '58 450 DH', conversionRate: '28,4%' },
  { id: 2, code: 'COM-00049', name: 'Karim Laalou', phone: '+212 6 62 34 56 78', city: 'Rabat', status: 'Actif', transactions: 22, salesVolume: '4 680 000 DH', commissionEarned: '46 800 DH', conversionRate: '24,1%' },
  { id: 3, code: 'COM-00050', name: 'Samira El Amrani', phone: '+212 6 63 45 67 89', city: 'Marrakech', status: 'Actif', transactions: 19, salesVolume: '3 920 000 DH', commissionEarned: '39 200 DH', conversionRate: '22,6%' },
  { id: 4, code: 'COM-00051', name: 'Mehdi Aït Taleb', phone: '+212 6 64 56 78 90', city: 'Tanger', status: 'Actif', transactions: 15, salesVolume: '3 160 000 DH', commissionEarned: '31 600 DH', conversionRate: '20,3%' },
  { id: 5, code: 'COM-00052', name: 'Reda El Fassi', phone: '+212 6 65 67 89 01', city: 'Fès', status: 'Actif', transactions: 12, salesVolume: '2 455 000 DH', commissionEarned: '24 550 DH', conversionRate: '18,9%' },
  { id: 6, code: 'COM-00053', name: 'Hicham Bennis', phone: '+212 6 66 78 90 12', city: 'Meknès', status: 'En attente', transactions: 8, salesVolume: '1 680 000 DH', commissionEarned: '16 800 DH', conversionRate: '16,2%' },
  { id: 7, code: 'COM-00054', name: 'Fatima Zahra', phone: '+212 6 67 89 01 23', city: 'Agadir', status: 'Actif', transactions: 7, salesVolume: '1 420 000 DH', commissionEarned: '14 200 DH', conversionRate: '15,6%' },
  { id: 8, code: 'COM-00055', name: 'Omar Touhami', phone: '+212 6 68 90 12 34', city: 'Oujda', status: 'Inactif', transactions: 3, salesVolume: '620 000 DH', commissionEarned: '6 200 DH', conversionRate: '8,7%' },
]

export default function CommissionersListPage() {
  return (
    <div className="space-y-4">
      {/* Top Header matching Reference #16 Screen 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/commissioners"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Tableau de bord</span>
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Liste des commissionnaires
            </h1>
            <p className="text-xs text-zinc-400">
              Gérez votre réseau de commissionnaires et courtiers par ville
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/commissioners/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Ajouter</span>
          </Link>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Main Table Container matching Reference #16 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        {/* Search Bar */}
        <div className="relative flex items-center max-w-md">
          <Search className="absolute left-3 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher un commissionnaire, une ville..."
            className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* 8-row Data Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Commissionnaire</th>
                <th className="py-2.5 px-3">Ville</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Transactions</th>
                <th className="py-2.5 px-3 text-right">Ventes (DH)</th>
                <th className="py-2.5 px-3 text-right">Commission (DH)</th>
                <th className="py-2.5 px-3 text-center">Taux conv.</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {COMMISSIONERS.map((c) => (
                <tr key={c.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{c.id}</td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/commissioners/${c.code}`}
                      className="font-bold text-white hover:text-red-400 transition-colors block"
                    >
                      {c.name}
                    </Link>
                    <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Phone className="h-2.5 w-2.5" />
                      <span>{c.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 rounded bg-[#1c1c24] border border-[#282834] px-2 py-0.5 text-[11px] text-zinc-300 font-medium">
                      <MapPin className="h-2.5 w-2.5 text-red-500" />
                      <span>{c.city}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        c.status === 'Actif'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : c.status === 'En attente'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-zinc-700/30 text-zinc-400 border border-zinc-700/50'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-white">
                    {c.transactions}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {c.salesVolume}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-cyan-400">
                    {c.commissionEarned}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-zinc-300">
                    {c.conversionRate}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/commissioners/${c.code}`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Voir détail"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Modifier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Plus"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 8 sur 48 commissionnaires</span>

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
