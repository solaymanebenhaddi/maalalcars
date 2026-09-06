'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Truck,
  Calendar,
  Clock,
  CheckCircle2,
  Search,
  Plus,
  Download,
  CheckSquare,
  FileText,
  SlidersHorizontal,
  Car,
} from 'lucide-react'

interface UpcomingDeliveryCard {
  id: number
  badge: string
  vehicle: string
  matricule: string
  client: string
  phone: string
  status: 'À remettre' | 'Planifiée'
  statusColor: string
}

const UPCOMING_DELIVERIES: UpcomingDeliveryCard[] = []

interface DeliveryRow {
  id: number
  reference: string
  vehicle: string
  matricule: string
  client: string
  dateTime: string
  status: 'À remettre' | 'Planifiée' | 'Livrée'
  statusColor: string
  salesperson: string
  documents: string
}

const DELIVERIES_TABLE: DeliveryRow[] = [
  { id: 1, reference: 'LDV-2025-0056', vehicle: 'Mercedes GLE 53 AMG', matricule: 'WW-325-KL', client: 'Sophie Martin', dateTime: '20/05/2025 10:30', status: 'À remettre', statusColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', salesperson: 'Yassine B.', documents: '3/3' },
  { id: 2, reference: 'LDV-2025-0055', vehicle: 'BMW X5 xDrive 40i', matricule: 'GH-241-PL', client: 'Julien Moreau', dateTime: '20/05/2025 14:00', status: 'À remettre', statusColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', salesperson: 'Yassine B.', documents: '3/3' },
  { id: 3, reference: 'LDV-2025-0054', vehicle: 'Audi Q7 50 TDI', matricule: 'FN-789-LM', client: 'Thomas Bernard', dateTime: '21/05/2025 09:30', status: 'Planifiée', statusColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30', salesperson: 'Sarah M.', documents: '2/3' },
  { id: 4, reference: 'LDV-2025-0053', vehicle: 'Porsche Macan S', matricule: 'FK-112-RT', client: 'Laura Petit', dateTime: '21/05/2025 15:00', status: 'Planifiée', statusColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30', salesperson: 'Sarah M.', documents: '2/3' },
  { id: 5, reference: 'LDV-2025-0052', vehicle: 'Range Rover Sport', matricule: 'GP-456-VB', client: 'Nicolas Blanc', dateTime: '24/05/2025 11:00', status: 'Planifiée', statusColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30', salesperson: 'Adrien M.', documents: '2/3' },
]

export function DeliveriesDashboardClient() {
  const [search, setSearch] = useState('')

  const filteredDeliveries = DELIVERIES_TABLE.filter(
    (d) =>
      d.reference.toLowerCase().includes(search.toLowerCase()) ||
      d.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      d.client.toLowerCase().includes(search.toLowerCase()) ||
      d.matricule.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #26 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Livraisons / Remises — Liste / Tableau de bord
          </h1>
          <p className="text-xs text-zinc-400">
            Pilotez chaque livraison et remise client avec précision et une expérience premium.
          </p>
        </div>

        <Link
          href="/deliveries/new"
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nouvelle livraison</span>
        </Link>
      </div>

      {/* 6 KPI Cards matching Reference #26 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Livraisons ce mois */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Livraisons ce mois</span>
            <Truck className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            36
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            ▲ 12,5% vs mois dernier
          </div>
        </div>

        {/* Remises à venir */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Remises à venir</span>
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-2 font-mono font-black text-amber-400 text-base sm:text-lg">
            18
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ▲ 8,2%
          </div>
        </div>

        {/* En attente de remise */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>En attente de remise</span>
            <Car className="h-3.5 w-3.5 text-red-400" />
          </div>
          <div className="mt-2 font-mono font-black text-red-400 text-base sm:text-lg">
            9
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            ▲ 3,1%
          </div>
        </div>

        {/* Livraisons réalisées */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Livraisons réalisées</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono font-black text-emerald-400 text-base sm:text-lg">
            27
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ▲ 19,3%
          </div>
        </div>

        {/* Taux de satisfaction */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Taux de satisfaction</span>
            <span className="font-bold text-amber-400 text-xs">★</span>
          </div>
          <div className="mt-2 font-mono font-black text-amber-400 text-base sm:text-lg">
            4.8 <span className="text-xs text-zinc-400 font-normal">/ 5 ★</span>
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ▲ 0,2 pts
          </div>
        </div>

        {/* Remises en retard */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Remises en retard</span>
            <Clock className="h-3.5 w-3.5 text-red-400" />
          </div>
          <div className="mt-2 font-mono font-black text-red-400 text-base sm:text-lg">
            3
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            ▲ 1 vs hier
          </div>
        </div>
      </div>

      {/* Remises à venir (Horizontal Cards) matching Reference #26 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-wide">
            Remises à venir
          </h3>
          <span className="text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer">
            Voir toutes (18) &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {UPCOMING_DELIVERIES.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 flex flex-col justify-between space-y-2 hover:border-zinc-500 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between text-[9px]">
                <span className="font-mono text-zinc-400 font-semibold">{c.badge}</span>
              </div>

              <div className="h-16 w-full rounded-lg bg-zinc-900 border border-[#262632] flex items-center justify-center text-zinc-500 text-[10px] font-bold">
                {c.vehicle}
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-white text-xs truncate">{c.vehicle}</div>
                <div className="font-mono text-[10px] text-zinc-400">{c.matricule}</div>
                <div className="text-[10px] text-zinc-300">{c.client}</div>
                <div className="text-[9px] text-zinc-500 font-mono">{c.phone}</div>
              </div>

              <div className="pt-1">
                <Link
                  href={`/deliveries/LDV-2025-0056/checklist`}
                  className={`w-full block text-center rounded border py-1 text-[10px] font-bold ${c.statusColor}`}
                >
                  {c.status}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rechercher une livraison & Filtres */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-white">Rechercher une livraison</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          <div className="relative col-span-2 sm:col-span-4 lg:col-span-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (client, véhicule...)"
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Statut : Tous</option>
            <option>À remettre</option>
            <option>Planifiée</option>
            <option>Livrée</option>
          </select>

          <input
            type="text"
            placeholder="Date de remise (Du — Au)"
            defaultValue="Du — Au"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Commercial : Tous</option>
            <option>Yassine Benali</option>
            <option>Sarah Martin</option>
            <option>Adrien Maalal</option>
          </select>

          <div className="flex items-center gap-1 col-span-2 sm:col-span-4 lg:col-span-1">
            <button className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] text-xs text-zinc-300 hover:text-white flex items-center justify-center gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              <span>Plus de filtres</span>
            </button>
            <button className="h-8 px-4 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-700">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Main Deliveries Table */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white">Liste des livraisons</h3>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>

        {/* 5-row Deliveries Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">N°</th>
                <th className="py-2.5 px-3">Véhicule</th>
                <th className="py-2.5 px-3">Immatriculation</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3 font-mono">Date de remise</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3">Commercial</th>
                <th className="py-2.5 px-3 text-center">Documents</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredDeliveries.map((d) => (
                <tr key={d.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3">
                    <Link
                      href={`/deliveries/${d.reference}/checklist`}
                      className="font-mono font-bold text-white hover:text-red-400"
                    >
                      {d.reference}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">{d.vehicle}</td>
                  <td className="py-3 px-3 font-mono text-zinc-300">{d.matricule}</td>
                  <td className="py-3 px-3 font-medium text-white">{d.client}</td>
                  <td className="py-3 px-3 font-mono text-zinc-400 text-[11px]">{d.dateTime}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${d.statusColor}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{d.salesperson}</td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">{d.documents}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/deliveries/${d.reference}/checklist`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Checklist de remise"
                      >
                        <CheckSquare className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/deliveries/${d.reference}/receipt`}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                        title="Bon de livraison"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/deliveries/${d.reference}/history`}
                        className="rounded p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800"
                        title="Historique"
                      >
                        <Clock className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 5 sur 18 livraisons</span>
          <div className="flex items-center gap-1">
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
          </div>
        </div>
      </div>
    </div>
  )
}
