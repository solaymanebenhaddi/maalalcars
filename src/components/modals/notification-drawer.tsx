'use client'

import React from 'react'
import Link from 'next/link'
import {
  X,
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  ExternalLink,
  Check,
} from 'lucide-react'
import clsx from 'clsx'

interface NotificationItem {
  id: string
  title: string
  message: string
  category: string
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS' | string
  link?: string
  isRead: boolean
  createdAt: string | Date
}

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
  notifications?: NotificationItem[]
  onMarkAllAsRead?: () => void
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Stock âgé détecté (>90 jours)',
    message: 'Le véhicule Dacia Duster (V-2026-0007) est en stock depuis plus de 105 jours.',
    category: 'Stock',
    severity: 'CRITICAL',
    link: '/stock',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'n2',
    title: 'Paiement en attente de solde',
    message: 'Facture FAC-2026-0001 : reste dû de 24 900 DH pour Mme Imane Zahiri.',
    category: 'Paiements',
    severity: 'WARNING',
    link: '/invoices',
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: 'n3',
    title: 'Document expirant bientôt (15j)',
    message: 'Contrôle technique du Peugeot 3008 expire le 15/06/2026.',
    category: 'Documents',
    severity: 'WARNING',
    link: '/documents',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'n4',
    title: 'Réservation active',
    message: 'Réservation RES-2026-0001 pour BMW X5 expire dans 7 jours.',
    category: 'Réservations',
    severity: 'INFO',
    link: '/reservations',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
]

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications = mockNotifications,
  onMarkAllAsRead,
}: NotificationDrawerProps) {
  if (!isOpen) return null

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'SUCCESS':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      default:
        return <Info className="h-4 w-4 text-cyan-500" />
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-red-500/30 bg-red-500/10 text-red-400'
      case 'WARNING':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
      case 'SUCCESS':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
      default:
        return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col border-l border-[#282832] bg-[#0e0e12] shadow-2xl transition-transform animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#222228] px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Centre de Notifications</h2>
              <p className="text-[11px] text-zinc-400">Alertes, rappels et activités système</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-[#1c1c24] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-[#222228] bg-[#121216] px-5 py-2.5">
          <span className="text-xs font-semibold text-zinc-300">
            {notifications.filter((n) => !n.isRead).length} non lues
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Tout marquer comme lu</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={clsx(
                'group rounded-xl border p-3.5 transition-all',
                n.isRead
                  ? 'border-[#222228] bg-[#141418]/60 text-zinc-400'
                  : 'border-[#2e2e38] bg-[#18181f] text-white shadow-md'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(n.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      {n.title}
                    </span>
                    <span
                      className={clsx(
                        'rounded-full px-2 py-0.5 text-[9px] font-bold border',
                        getSeverityBg(n.severity)
                      )}
                    >
                      {n.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-300 leading-relaxed">{n.message}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                      <Clock className="h-3 w-3" />
                      {new Date(n.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={onClose}
                        className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300"
                      >
                        <span>Voir</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="border-t border-[#222228] p-4 bg-[#0a0a0c]">
          <Link
            href="/notifications"
            onClick={onClose}
            className="flex h-10 w-full items-center justify-center rounded-lg border border-[#2c2c36] bg-[#16161c] text-xs font-bold text-zinc-200 transition-all hover:bg-[#1e1e26] hover:text-white"
          >
            Voir toutes les notifications & règles
          </Link>
        </div>
      </div>
    </>
  )
}
