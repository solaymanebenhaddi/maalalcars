'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  Phone,
} from 'lucide-react'

interface BuyerRecord {
  id: number
  code: string
  name: string
  phone: string
  email: string
  city: string
  totalVolume: number
  debt: number
  status: 'ACTIVE' | 'INACTIVE'
  lastPurchase: string
}

const BUYERS_LIST: BuyerRecord[] = [
  { id: 1, code: 'CLT-001', name: 'Imane Zahiri', phone: '+212 6 12 34 56 78', email: 'imane.zahiri@gmail.com', city: 'Casablanca', totalVolume: 1248500, debt: 24900, status: 'ACTIVE', lastPurchase: '30/05/2025' },
  { id: 2, code: 'CLT-002', name: 'Youssef El Idrissi', phone: '+212 6 23 45 67 89', email: 'youssef.elidrissi@gmail.com', city: 'Rabat', totalVolume: 980400, debt: 0, status: 'ACTIVE', lastPurchase: '29/05/2025' },
  { id: 3, code: 'CLT-003', name: 'Karim Bennani', phone: '+212 6 34 56 78 90', email: 'karim.bennani@gmail.com', city: 'Tanger', totalVolume: 856200, debt: 12600, status: 'ACTIVE', lastPurchase: '28/05/2025' },
  { id: 4, code: 'CLT-004', name: 'Omar Bennis', phone: '+212 6 45 67 89 01', email: 'omar.bennis@gmail.com', city: 'Fès', totalVolume: 745600, debt: 36200, status: 'ACTIVE', lastPurchase: '27/05/2025' },
  { id: 5, code: 'CLT-005', name: 'Nadia K.', phone: '+212 6 56 78 90 12', email: 'nadia.k@gmail.com', city: 'Marrakech', totalVolume: 653300, debt: 19300, status: 'ACTIVE', lastPurchase: '26/05/2025' },
  { id: 6, code: 'CLT-006', name: 'Mehdi Amrani', phone: '+212 6 67 89 01 23', email: 'mehdi.amrani@gmail.com', city: 'Casablanca', totalVolume: 612800, debt: 0, status: 'INACTIVE', lastPurchase: '25/05/2025' },
  { id: 7, code: 'CLT-007', name: 'Salma El Alaoui', phone: '+212 6 78 90 12 34', email: 'salma.alaoui@gmail.com', city: 'Agadir', totalVolume: 598400, debt: 8750, status: 'ACTIVE', lastPurchase: '24/05/2025' },
  { id: 8, code: 'CLT-008', name: 'Hicham El Khayat', phone: '+212 6 89 01 23 45', email: 'hicham.elkhayat@gmail.com', city: 'Meknès', totalVolume: 487200, debt: 22100, status: 'ACTIVE', lastPurchase: '27/05/2025' },
  { id: 9, code: 'CLT-009', name: 'Yassine Chraibi', phone: '+212 6 90 12 34 56', email: 'yassine.chraibi@gmail.com', city: 'Casablanca', totalVolume: 412600, debt: 15400, status: 'ACTIVE', lastPurchase: '22/05/2025' },
  { id: 10, code: 'CLT-010', name: 'Zakaria Slaoui', phone: '+212 6 01 23 45 67', email: 'zakaria.slaoui@gmail.com', city: 'Rabat', totalVolume: 398100, debt: 0, status: 'INACTIVE', lastPurchase: '21/05/2025' },
]

export default function BuyersListPage() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredBuyers = BUYERS_LIST.filter((b) => {
    if (statusFilter === 'ACTIVE' && b.status !== 'ACTIVE') return false
    if (statusFilter === 'INACTIVE' && b.status !== 'INACTIVE') return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.phone.includes(q)
      if (!match) return false
    }

    return true
  })

  return (
    <div className="space-y-4 text-xs text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/buyers"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Tableau de bord</span>
          </Link>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Liste des acheteurs
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3.5 shadow-xl">
        {/* Filter Bar matching Reference #14 Screen 2 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Tous les statuts ⌄</option>
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
            </select>

            {/* Search Input */}
            <div className="relative flex items-center min-w-[260px]">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex h-8 items-center gap-1.5 rounded border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* 10-Row Data Table matching Reference #14 Screen 2 */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Acheteur</th>
                <th className="py-2.5 px-3">Téléphone</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Ville</th>
                <th className="py-2.5 px-3 text-right">Achats totaux</th>
                <th className="py-2.5 px-3 text-right">Encours</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 font-mono">Dernier achat</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredBuyers.map((b) => (
                <tr key={b.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{b.id}</td>
                  <td className="py-3 px-3 font-medium text-white">
                    <Link
                      href={`/buyers/${b.code}`}
                      className="hover:text-red-400 font-bold transition-colors"
                    >
                      {b.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-300">
                    <a href={`tel:${b.phone}`} className="hover:text-cyan-400 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-zinc-500" />
                      <span>{b.phone}</span>
                    </a>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{b.email}</td>
                  <td className="py-3 px-3 text-zinc-300 font-medium">{b.city}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {b.totalVolume.toLocaleString('fr-MA')} DH
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-mono font-bold ${
                      b.debt > 0 ? 'text-amber-400' : 'text-zinc-400'
                    }`}
                  >
                    {b.debt.toLocaleString('fr-MA')} DH
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        b.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {b.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">
                    {b.lastPurchase}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/buyers/${b.code}`}
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Voir détail"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/buyers/${b.code}`}
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Modifier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Options"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination matching Reference #14 Screen 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>10 par page ⌄</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ‹
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                  currentPage === page
                    ? 'bg-red-600 text-white shadow'
                    : 'border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-zinc-600 px-1">...</span>
            <button
              onClick={() => setCurrentPage(25)}
              className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white text-xs font-bold"
            >
              25
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
