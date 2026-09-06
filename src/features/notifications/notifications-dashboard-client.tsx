'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  AlertTriangle,
  Calendar,
  Info,
  Search,
  CheckCircle2,
  FileText,
  CreditCard,
  UserPlus,
  Car,
  Wrench,
  Sliders,
  Settings,
} from 'lucide-react'

interface NotificationItem {
  id: number
  code: string
  title: string
  description: string
  category: 'Stock' | 'Paiements' | 'Documents' | 'Réservations' | 'Factures' | 'Clients' | 'Entretien'
  categoryColor: string
  timeAgo: string
  type: 'critical' | 'warning' | 'info' | 'success'
  unread: boolean
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    code: 'ALT-001',
    title: 'Stock âgé détecté',
    description: '5 véhicules en stock depuis plus de 90 jours.',
    category: 'Stock',
    categoryColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    timeAgo: 'Il y a 15 min',
    type: 'critical',
    unread: true,
  },
  {
    id: 2,
    code: 'ALT-002',
    title: 'Paiement en retard',
    description: 'Facture FAC-2025-0049 en retard de 12 jours.',
    category: 'Paiements',
    categoryColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    timeAgo: 'Il y a 45 min',
    type: 'warning',
    unread: true,
  },
  {
    id: 3,
    code: 'ALT-003',
    title: 'Document expirant bientôt',
    description: 'Assurance Toyota Land Cruiser expire le 15/06/2025.',
    category: 'Documents',
    categoryColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    timeAgo: 'Il y a 1 heure',
    type: 'warning',
    unread: true,
  },
  {
    id: 4,
    code: 'ALT-004',
    title: 'Réservation à confirmer',
    description: 'Réservation #RES-2025-0158 en attente de confirmation client.',
    category: 'Réservations',
    categoryColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    timeAgo: 'Il y a 2 heures',
    type: 'info',
    unread: true,
  },
  {
    id: 5,
    code: 'ALT-005',
    title: 'Facture envoyée',
    description: 'Facture FAC-2025-0156 envoyée à Imane Zahri.',
    category: 'Factures',
    categoryColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    timeAgo: 'Il y a 3 heures',
    type: 'success',
    unread: false,
  },
  {
    id: 6,
    code: 'ALT-006',
    title: 'Nouveau client ajouté',
    description: 'Youssef El Idrissi a été ajouté comme nouveau client.',
    category: 'Clients',
    categoryColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    timeAgo: 'Il y a 4 heures',
    type: 'info',
    unread: false,
  },
  {
    id: 7,
    code: 'ALT-007',
    title: 'Stock critique',
    description: 'Le stock du modèle BMW X5 est inférieur au seuil minimum.',
    category: 'Stock',
    categoryColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    timeAgo: 'Il y a 5 heures',
    type: 'critical',
    unread: false,
  },
  {
    id: 8,
    code: 'ALT-008',
    title: 'Rappel d\'entretien',
    description: 'Entretien planifié pour Toyota Land Cruiser le 20/05/2025.',
    category: 'Entretien',
    categoryColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    timeAgo: 'Il y a 6 heures',
    type: 'warning',
    unread: false,
  },
]

export function NotificationsDashboardClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'critical' | 'reminders' | 'info'>('all')
  const [search, setSearch] = useState('')

  const getIcon = (item: NotificationItem) => {
    switch (item.category) {
      case 'Stock':
        return <Car className="h-4 w-4 text-red-400" />
      case 'Paiements':
        return <CreditCard className="h-4 w-4 text-amber-400" />
      case 'Documents':
        return <FileText className="h-4 w-4 text-amber-400" />
      case 'Réservations':
        return <Calendar className="h-4 w-4 text-cyan-400" />
      case 'Factures':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case 'Clients':
        return <UserPlus className="h-4 w-4 text-blue-400" />
      case 'Entretien':
        return <Wrench className="h-4 w-4 text-amber-400" />
      default:
        return <Bell className="h-4 w-4 text-zinc-400" />
    }
  }

  const getDotColor = (item: NotificationItem) => {
    switch (item.type) {
      case 'critical':
        return 'bg-red-500'
      case 'warning':
        return 'bg-amber-500'
      case 'info':
        return 'bg-cyan-500'
      case 'success':
        return 'bg-emerald-500'
      default:
        return 'bg-zinc-500'
    }
  }

  const filteredNotifications = NOTIFICATIONS.filter((n) => {
    if (activeTab === 'unread' && !n.unread) return false
    if (activeTab === 'critical' && n.type !== 'critical') return false
    if (activeTab === 'reminders' && n.category !== 'Entretien' && n.category !== 'Réservations') return false
    if (activeTab === 'info' && n.type !== 'info' && n.type !== 'success') return false

    if (search) {
      const q = search.toLowerCase()
      return n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #20 Screen 17 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Centre de notifications
          </h1>
          <p className="text-xs text-zinc-400">
            Gardez le contrôle grâce à des alertes en temps réel et des rappels intelligents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/notifications/rules"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>Règles d&apos;automatisation</span>
          </Link>

          <Link
            href="/notifications/reminders"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            <span>Rappels planifiés</span>
          </Link>

          <Link
            href="/notifications/settings"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Settings className="h-3.5 w-3.5 text-zinc-400" />
            <span>Préférences</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards matching Reference #20 Screen 17 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Non lues */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Non lues</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Bell className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            12
          </div>
          <div className="mt-1 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
            <span>↑ 4 nouvelles</span>
          </div>
        </div>

        {/* Alertes critiques */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Alertes critiques</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-red-400 text-lg sm:text-xl">
            3
          </div>
          <div className="mt-1 text-[10px] text-red-400 flex items-center gap-1 font-semibold">
            <span>Action requise</span>
          </div>
        </div>

        {/* Rappels du jour */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Rappels du jour</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-amber-400 text-lg sm:text-xl">
            7
          </div>
          <div className="mt-1 text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
            <span>↑ 2 aujourd&apos;hui</span>
          </div>
        </div>

        {/* Information */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Information</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Info className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            24
          </div>
          <div className="mt-1 text-[10px] text-zinc-400 flex items-center gap-1">
            <span>Notifications système</span>
          </div>
        </div>
      </div>

      {/* Main List Container matching Reference #20 Screen 17 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        {/* Filter Tabs & Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#202028] pb-3">
          <div className="flex items-center gap-4 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`font-semibold pb-1 relative whitespace-nowrap ${
                activeTab === 'all' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Toutes</span>
              {activeTab === 'all' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
            </button>

            <button
              onClick={() => setActiveTab('unread')}
              className={`font-semibold pb-1 relative whitespace-nowrap ${
                activeTab === 'unread' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Non lues <span className="text-[10px] font-mono text-cyan-400">(12)</span></span>
              {activeTab === 'unread' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
            </button>

            <button
              onClick={() => setActiveTab('critical')}
              className={`font-semibold pb-1 relative whitespace-nowrap ${
                activeTab === 'critical' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Critiques <span className="text-[10px] font-mono text-red-400">(3)</span></span>
              {activeTab === 'critical' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
            </button>

            <button
              onClick={() => setActiveTab('reminders')}
              className={`font-semibold pb-1 relative whitespace-nowrap ${
                activeTab === 'reminders' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Rappels <span className="text-[10px] font-mono text-amber-400">(7)</span></span>
              {activeTab === 'reminders' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
            </button>

            <button
              onClick={() => setActiveTab('info')}
              className={`font-semibold pb-1 relative whitespace-nowrap ${
                activeTab === 'info' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Informations <span className="text-[10px] font-mono text-blue-400">(24)</span></span>
              {activeTab === 'info' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher dans les notifications..."
                className="h-8 w-56 rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Plus récentes</option>
              <option>Priorité</option>
              <option>Par catégorie</option>
            </select>
          </div>
        </div>

        {/* Notification 8 Items List */}
        <div className="space-y-2">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#22222a] bg-[#16161c] p-3 hover:border-[#2e2e3e] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a24] shrink-0 border border-[#262634]">
                  {getIcon(item)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{item.title}</span>
                    <span className={`inline-flex items-center rounded border px-2 py-0.2 text-[9px] font-bold ${item.categoryColor}`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[10px] text-zinc-400 whitespace-nowrap">{item.timeAgo}</span>
                <Link
                  href={`/notifications/${item.code}`}
                  className="rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Voir
                </Link>
                <span className={`h-2 w-2 rounded-full shrink-0 ${getDotColor(item)}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 8 sur 12 notifications</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
              1
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              2
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
