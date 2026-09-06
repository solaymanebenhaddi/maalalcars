'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  UserCheck,
  Target,
  Truck,
  Briefcase,
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit2,
  MoreHorizontal,
  ArrowUpRight,
  PieChart,
} from 'lucide-react'

interface ContactItem {
  id: number
  code: string
  name: string
  company: string
  type: 'Client' | 'Prospect' | 'Fournisseur' | 'Vendeur'
  status: 'Actif' | 'Nouveau' | 'En relance' | 'Inactif'
  phone: string
  email: string
  segment: 'VIP' | 'Fidèle' | 'Prospect chaud' | 'Prospect froid' | 'Fournisseur'
  lastContact: string
}

const CONTACTS: ContactItem[] = []

export function ContactsDashboardClient() {
  const [search, setSearch] = useState('')

  const filteredContacts = CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Top Header matching Reference #18 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Contacts — CRM
          </h1>
          <p className="text-xs text-zinc-400">
            Gestion globale des clients, prospects, fournisseurs et partenaires
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contacts/segments"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <PieChart className="h-3.5 w-3.5 text-cyan-400" />
            <span>Segments & Relances</span>
          </Link>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>

          <Link
            href="/contacts/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Ajouter un contact</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Cards matching Reference #18 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total contacts */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Total contacts</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            1 248
          </div>
          <div className="mt-1 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>12 ce mois</span>
          </div>
        </div>

        {/* Clients actifs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Clients actifs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            428
          </div>
          <div className="mt-1 text-[10px] text-red-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>8 ce mois</span>
          </div>
        </div>

        {/* Prospects */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Prospects</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Target className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            512
          </div>
          <div className="mt-1 text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>15 ce mois</span>
          </div>
        </div>

        {/* Fournisseurs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Fournisseurs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Truck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            86
          </div>
          <div className="mt-1 text-[10px] text-purple-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>3 ce mois</span>
          </div>
        </div>

        {/* Vendeurs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Vendeurs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Briefcase className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            12
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>1 ce mois</span>
          </div>
        </div>
      </div>

      {/* Main Table Container matching Reference #18 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un contact, email, téléphone..."
              className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Tous les statuts</option>
              <option>Actif</option>
              <option>Nouveau</option>
              <option>En relance</option>
            </select>

            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Tous les types</option>
              <option>Client</option>
              <option>Prospect</option>
              <option>Fournisseur</option>
            </select>

            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Tous les segments</option>
              <option>VIP</option>
              <option>Fidèle</option>
              <option>Prospect chaud</option>
              <option>Prospect froid</option>
            </select>

            <button className="flex items-center gap-1.5 h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <span>Plus de filtres</span>
            </button>
          </div>
        </div>

        {/* 8-row Contacts Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Nom complet</th>
                <th className="py-2.5 px-3">Société</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3">Téléphone</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3 text-center">Segment</th>
                <th className="py-2.5 px-3">Dernier contact</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{c.id}</td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/contacts/${c.code}`}
                      className="font-bold text-white hover:text-red-400 transition-colors"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{c.company}</td>
                  <td className="py-3 px-3 text-zinc-300">{c.type}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        c.status === 'Actif'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : c.status === 'Nouveau'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">{c.phone}</td>
                  <td className="py-3 px-3 text-zinc-400">{c.email}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        c.segment === 'VIP'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : c.segment === 'Fidèle'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : c.segment === 'Prospect chaud'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : c.segment === 'Prospect froid'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400 text-[11px]">{c.lastContact}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/contacts/${c.code}`}
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

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>8 résultats</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ‹
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
              1
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
