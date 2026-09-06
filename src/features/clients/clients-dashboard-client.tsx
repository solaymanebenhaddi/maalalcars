'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  UserPlus,
  UserCheck,
  CreditCard,
  AlertCircle,
  HeartHandshake,
  Search,
  Download,
  Plus,
  Eye,
  Edit2,
  MoreHorizontal,
  MapPin,
  Building,
} from 'lucide-react'
import { ClientsSegmentationDonut } from './clients-segmentation-donut'

interface ClientRow {
  id: number
  code: string
  name: string
  subtitle: string
  contactsCount: number
  type: string
  segment: string
  status: 'Actif' | 'Inactif'
  phone: string
  email: string
  city: string
  totalCA: string
  lastInteraction: string
}

const CLIENTS: ClientRow[] = []

const REGIONS: { name: string; pct: string }[] = []

const TOP_CLIENTS: { id: number; name: string; amount: string }[] = []

export function ClientsDashboardClient() {
  const [search, setSearch] = useState('')

  const filteredClients = CLIENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #21 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Tableau de bord clients
          </h1>
          <p className="text-xs text-zinc-400">
            Vue d&apos;ensemble de votre base clients et de la qualité de vos relations.
          </p>
        </div>
      </div>

      {/* 6 KPI Cards matching Reference #21 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Clients totaux */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Clients totaux</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
              <Users className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            2 458
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            +12,5% vs mois dernier
          </div>
        </div>

        {/* Nouveaux clients */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Nouveaux clients</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
              <UserPlus className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            128
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            +18,2% vs mois dernier
          </div>
        </div>

        {/* Clients actifs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Clients actifs</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
              <UserCheck className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            1 986
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            80,9% du total
          </div>
        </div>

        {/* Chiffre d'affaires */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Chiffre d&apos;affaires</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
              <CreditCard className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-amber-400 text-sm sm:text-base">
            1 248 500 €
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            +14,3% vs mois dernier
          </div>
        </div>

        {/* Tickets ouverts */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Tickets ouverts</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-red-500/10 text-red-400">
              <AlertCircle className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-red-400 text-base sm:text-lg">
            24
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            -8,3% vs mois dernier
          </div>
        </div>

        {/* Taux de fidélisation */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Taux de fidélisation</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
              <HeartHandshake className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-purple-400 text-base sm:text-lg">
            68,7%
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            +5,4% vs mois dernier
          </div>
        </div>
      </div>

      {/* 3 Middle Widgets matching Reference #21 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <ClientsSegmentationDonut />

        {/* Répartition géographique */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Répartition géographique
            </h3>
            <MapPin className="h-3.5 w-3.5 text-zinc-500" />
          </div>

          <div className="space-y-1.5 py-1 text-[10px]">
            {REGIONS.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="text-zinc-300">{r.name}</span>
                <span className="font-mono font-bold text-white">{r.pct}</span>
              </div>
            ))}
          </div>

          <div className="text-[9px] text-zinc-500 text-right">
            France métropolitaine & Maroc
          </div>
        </div>

        {/* Top par chiffre d'affaires */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Top par chiffre d&apos;affaires
            </h3>
            <span className="text-[10px] text-zinc-500">Voir le classement</span>
          </div>

          <div className="space-y-2 py-1">
            {TOP_CLIENTS.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg bg-[#16161c] px-3 py-1.5 border border-[#202028] hover:border-[#2e2e3a] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-zinc-500 text-[10px] font-bold w-3">{c.id}</span>
                  <Building className="h-3 w-3 text-zinc-400" />
                  <span className="font-bold text-white text-[11px]">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-white text-xs">{c.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters Bar matching Reference #21 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-white">Recherche avancée</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, entreprise, email, téléphone..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Type de client: Tous</option>
            <option>Particulier</option>
            <option>Professionnel</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Statut: Tous</option>
            <option>Actif</option>
            <option>Inactif</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Segment: Tous</option>
            <option>Particulier</option>
            <option>Entreprise</option>
            <option>Flotte</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Commercial: Tous</option>
            <option>Admin Maalal</option>
            <option>Yassine Benali</option>
          </select>

          <button className="h-8 rounded-lg bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-700 transition-colors">
            Rechercher
          </button>
        </div>
      </div>

      {/* Main Table Container matching Reference #21 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        {/* Table Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold text-white">Liste des clients (2 458)</h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Export</span>
            </button>

            <Link
              href="/clients/new"
              className="flex items-center gap-1.5 h-8 rounded-lg bg-red-600 px-3.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Ajouter un client</span>
            </Link>
          </div>
        </div>

        {/* 5-row Clients Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3 text-center">Contacts</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Segment</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3">Téléphone</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Ville</th>
                <th className="py-2.5 px-3 text-right">CA total</th>
                <th className="py-2.5 px-3">Dernière interaction</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredClients.map((c) => (
                <tr key={c.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3">
                    <Link
                      href={`/clients/${c.code}`}
                      className="font-bold text-white hover:text-red-400 transition-colors block"
                    >
                      {c.name}
                    </Link>
                    <span className="text-[10px] text-zinc-500">{c.subtitle}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-zinc-300">{c.contactsCount}</td>
                  <td className="py-3 px-3 text-zinc-300">{c.type}</td>
                  <td className="py-3 px-3 text-zinc-400">{c.segment}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        c.status === 'Actif'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-700/30 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-300">{c.phone}</td>
                  <td className="py-3 px-3 text-zinc-400">{c.email}</td>
                  <td className="py-3 px-3 text-zinc-300">{c.city}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">{c.totalCA}</td>
                  <td className="py-3 px-3 text-zinc-400 text-[11px]">{c.lastInteraction}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/clients/${c.code}`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Voir"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Modifier">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Plus">
                        <MoreHorizontal className="h-3.5 w-3.5" />
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
          <span>Affichage 1 à 5 sur 2 458 clients</span>
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
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              5
            </button>
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              50
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
