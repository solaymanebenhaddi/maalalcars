import React from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Edit2,
  Phone,
  LayoutDashboard,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SellerRow {
  id: number
  code: string
  name: string
  phone: string
  email: string
  city: string
  status: 'Actif' | 'Inactif' | 'Suspendu'
  volume: string
}

const SELLERS: SellerRow[] = [
  { id: 1, code: 'VEN-001', name: 'Youssef El Idrissi', phone: '+212 6 61 12 34 56', email: 'y.elidrissi@gmail.com', city: 'Casablanca', status: 'Actif', volume: '682 500 DH' },
  { id: 2, code: 'VEN-002', name: 'Omar Bennani', phone: '+212 6 62 23 45 67', email: 'omar.bennani@menara.ma', city: 'Rabat', status: 'Actif', volume: '541 250 DH' },
  { id: 3, code: 'VEN-003', name: 'Imane Zahiri', phone: '+212 6 63 34 56 78', email: 'imane.zahiri@outlook.com', city: 'Marrakech', status: 'Actif', volume: '438 900 DH' },
  { id: 4, code: 'VEN-004', name: 'Karim Talbi', phone: '+212 6 64 45 67 89', email: 'k.talbi@gmail.com', city: 'Fès', status: 'Actif', volume: '356 750 DH' },
  { id: 5, code: 'VEN-005', name: 'Nadia Kabbaj', phone: '+212 6 65 56 78 90', email: 'nadia.kabbaj@live.com', city: 'Tanger', status: 'Actif', volume: '287 300 DH' },
  { id: 6, code: 'VEN-006', name: 'Mehdi Amrani', phone: '+212 6 66 67 89 01', email: 'mehdi.amrani@mail.com', city: 'Agadir', status: 'Inactif', volume: '165 000 DH' },
  { id: 7, code: 'VEN-007', name: 'Said El Alami', phone: '+212 6 67 78 90 12', email: 'said.alami@gmail.com', city: 'Casablanca', status: 'Actif', volume: '142 200 DH' },
  { id: 8, code: 'VEN-008', name: 'Hicham El Fassi', phone: '+212 6 68 89 01 23', email: 'hicham.fassi@gmail.com', city: 'Meknès', status: 'Suspendu', volume: '98 600 DH' },
  { id: 9, code: 'VEN-009', name: 'Salma Belkhayat', phone: '+212 6 69 90 12 34', email: 'salma.belkhayat@mail.com', city: 'Rabat', status: 'Actif', volume: '76 500 DH' },
  { id: 10, code: 'VEN-010', name: 'Reda El Harfi', phone: '+212 6 70 01 23 45', email: 'reda.harfi@gmail.com', city: 'Oujda', status: 'Actif', volume: '54 200 DH' },
]

export default function SellersListPage() {
  return (
    <div className="space-y-4">
      {/* Top Header matching Reference #15 Screen 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/sellers"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Tableau de bord</span>
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Liste des vendeurs
            </h1>
            <p className="text-xs text-zinc-400">
              Gérez votre réseau de vendeurs
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>Ajouter un vendeur</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Filter className="h-3.5 w-3.5 text-zinc-400" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Main Table Container matching Reference #15 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative flex items-center max-w-md">
          <Search className="absolute left-3 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher un vendeur..."
            className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* 10-row Data Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Nom complet</th>
                <th className="py-2.5 px-3">Téléphone</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Villes</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-right">Volume d&apos;achats</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {SELLERS.map((s) => (
                <tr key={s.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{s.id}</td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/sellers/${s.code}`}
                      className="font-bold text-white hover:text-red-400 transition-colors"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-300">
                    <a
                      href={`tel:${s.phone}`}
                      className="flex items-center gap-1 hover:text-emerald-400"
                    >
                      <Phone className="h-3 w-3 text-zinc-500" />
                      <span>{s.phone}</span>
                    </a>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{s.email}</td>
                  <td className="py-3 px-3 text-zinc-300 font-medium">{s.city}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        s.status === 'Actif'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'Suspendu'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-zinc-700/30 text-zinc-400 border border-zinc-700/50'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {s.volume}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/sellers/${s.code}`}
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination matching Reference #15 Screen 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>10 par page ⌄</span>
          </div>

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
              13
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
