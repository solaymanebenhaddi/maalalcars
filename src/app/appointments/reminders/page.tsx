'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Send,
  Bell,
  Clock,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

interface ReminderItem {
  id: string
  title: string
  client: string
  vehicle: string
  time: string
  status: 'UPCOMING' | 'SCHEDULED'
}

const REMINDERS: ReminderItem[] = [
  { id: '1', title: 'Entretien 20 000 km', client: 'Sami Martin', vehicle: 'Peugeot 308 (WW-123-AA)', time: '09:30', status: 'UPCOMING' },
  { id: '2', title: 'Contrôle technique', client: 'Karim Benali', vehicle: 'Renault Clio (AB-456-CD)', time: '11:00', status: 'UPCOMING' },
  { id: '3', title: 'Révision complète', client: 'Yassine Raoui', vehicle: 'BMW Série 3 (EF-789-GH)', time: '14:00', status: 'UPCOMING' },
  { id: '4', title: 'Diagnostic électronique', client: 'Mehdi Larbi', vehicle: 'Audi A3 (IJ-012-KL)', time: '16:30', status: 'UPCOMING' },
  { id: '5', title: 'Vidange + Filtres', client: 'Nadia Amrani', vehicle: 'Volkswagen Golf (MN-345-OP)', time: '18:00', status: 'SCHEDULED' },
]

export default function AppointmentRemindersPage() {
  const [activeTab, setActiveTab] = useState<'Rappels' | 'Notifications'>('Rappels')
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({})
  const [isSendingAll, setIsSendingAll] = useState(false)

  const handleSendSingle = (id: string) => {
    setSentMap((prev) => ({ ...prev, [id]: true }))
  }

  const handleSendAll = () => {
    setIsSendingAll(true)
    setTimeout(() => {
      const all: Record<string, boolean> = {}
      REMINDERS.forEach((r) => {
        all[r.id] = true
      })
      setSentMap(all)
      setIsSendingAll(false)
    }, 500)
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto text-xs text-white">
      <PageHeader
        title="Rappels & Notifications"
        subtitle="Automatisez et envoyez les rappels de rendez-vous par SMS et Email."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Agenda & RDV', href: '/appointments' },
          { label: 'Rappels' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/appointments"
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour agenda</span>
            </Link>
            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500">
              <Plus className="h-3.5 w-3.5" />
              <span>+ Nouveau rappel</span>
            </button>
          </div>
        }
      />

      {/* Main Container matching Reference #11 Screen 28D */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-3 text-xs">
          <button
            onClick={() => setActiveTab('Rappels')}
            className={`font-bold transition-all relative pb-1 ${
              activeTab === 'Rappels' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Rappels</span>
            {activeTab === 'Rappels' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('Notifications')}
            className={`font-semibold transition-all ${
              activeTab === 'Notifications' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Notifications</span>
          </button>
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap items-center gap-3">
          <select className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
            <option>Tous les types ⌄</option>
            <option>SMS</option>
            <option>Email</option>
            <option>WhatsApp</option>
          </select>

          <select className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
            <option>Tous les statuts ⌄</option>
            <option>À venir</option>
            <option>Programmé</option>
            <option>Envoyé</option>
          </select>

          <select className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
            <option>Aujourd’hui ⌄</option>
            <option>Demain</option>
            <option>Cette semaine</option>
          </select>
        </div>

        {/* Reminders List matching Reference #11 Screen 28D */}
        <div className="space-y-2.5">
          {REMINDERS.map((r) => {
            const isSent = sentMap[r.id]
            return (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#24242e] bg-[#16161c] p-3.5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                      r.status === 'SCHEDULED'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}
                  >
                    {r.status === 'SCHEDULED' ? (
                      <CalendarCheck className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-xs">{r.title}</div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {r.client} — {r.vehicle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono font-bold text-white text-xs">{r.time}</span>

                  <span
                    className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${
                      isSent
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : r.status === 'SCHEDULED'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isSent ? 'Envoyé ✓' : r.status === 'SCHEDULED' ? 'Programmé' : 'À venir'}
                  </span>

                  <button
                    onClick={() => handleSendSingle(r.id)}
                    disabled={isSent}
                    className="flex h-8 w-8 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white hover:border-red-500/50 disabled:opacity-40"
                    title="Envoyer maintenant"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Bulk Action matching Reference #11 Screen 28D */}
        <div className="flex items-center justify-between pt-3 border-t border-[#222228]">
          <span className="text-zinc-500 text-[11px] flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>5 rappels prévus pour la journée</span>
          </span>

          <button
            onClick={handleSendAll}
            disabled={isSendingAll}
            className="flex items-center gap-2 rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-bold text-white hover:bg-[#202028] hover:border-zinc-600 transition-all disabled:opacity-50"
          >
            {isSendingAll ? (
              <span>Envoi en cours...</span>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Envoyer tous les rappels (5)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
