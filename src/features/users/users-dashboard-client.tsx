'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  UserPlus,
  Shield,
  Activity,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
} from 'lucide-react'

interface UserItem {
  id: number
  name: string
  avatar: string
  email: string
  role: string
  status: 'Actif' | 'Inactif'
  statusColor: string
  lastLogin: string
}

const USERS_LIST: UserItem[] = []

export function UsersDashboardClient() {
  const [search, setSearch] = useState('')

  const filteredUsers = USERS_LIST.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #28 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Utilisateurs — administration
          </h1>
          <p className="text-xs text-zinc-400">
            Gérez les accès, rôles et permissions de votre équipe
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/users/roles"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Shield className="h-3.5 w-3.5 text-red-500" />
            <span>Rôles &amp; Permissions</span>
          </Link>

          <Link
            href="/users/audit-log"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>Journal d&apos;activité</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards matching Reference #28 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Utilisateurs actifs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Utilisateurs actifs</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            24
          </div>
          <div className="mt-1 text-[9px] text-cyan-400 font-semibold">
            ↑ 12,5% ce mois
          </div>
        </div>

        {/* Invitations en attente */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Invitations en attente</span>
            <UserPlus className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 font-mono font-black text-red-400 text-lg sm:text-xl">
            5
          </div>
          <div className="mt-1 text-[9px] text-red-400 font-semibold">
            ↓ 1 ce mois
          </div>
        </div>

        {/* Rôles définis */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Rôles définis</span>
            <Shield className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 font-mono font-black text-amber-400 text-lg sm:text-xl">
            6
          </div>
          <div className="mt-1 text-[9px] text-zinc-500 font-medium">
            Aucun changement
          </div>
        </div>

        {/* Activité récente */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Activité récente</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono font-black text-emerald-400 text-lg sm:text-xl">
            128
          </div>
          <div className="mt-1 text-[9px] text-emerald-400 font-semibold">
            ↑ 18,2% ce mois
          </div>
        </div>
      </div>

      {/* Main Table Container matching Reference #28 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-white">Liste des utilisateurs</h3>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <span>Filtres</span>
            </button>

            <Link
              href="/users/new"
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Ajouter un utilisateur</span>
            </Link>
          </div>
        </div>

        {/* 8-row Users Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">#</th>
                <th className="py-2.5 px-3">Utilisateur</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Rôle</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 font-mono">Dernière connexion</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-mono text-zinc-500">{u.id}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 text-red-500 font-bold text-[10px] border border-red-600/30">
                        {u.avatar}
                      </div>
                      <Link
                        href={`/users/${u.id}`}
                        className="font-bold text-white hover:text-red-400"
                      >
                        {u.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className="text-zinc-200 font-medium">{u.role}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${u.statusColor}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-400 text-[11px]">{u.lastLogin}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/users/${u.id}`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Consulter"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                        title="Modifier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Plus d'options"
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

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Afficher 1 à 8 sur 24 utilisateurs</span>
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
          </div>
        </div>
      </div>
    </div>
  )
}
