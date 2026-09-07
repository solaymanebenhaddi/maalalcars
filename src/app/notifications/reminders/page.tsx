'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Clock,
} from 'lucide-react'

interface ScheduledReminder {
  id: number
  title: string
  type: string
  dateTime: string
  recurrence: string
  assignedTo: string
  status: 'Planifié' | 'Terminé' | 'Annulé'
}

const REMINDERS: ScheduledReminder[] = [
  { id: 1, title: 'Relance paiement Imane Zahri', type: 'Paiement', dateTime: '03/06/2025 10:00', recurrence: 'Aucune', assignedTo: 'Admin Maalal', status: 'Planifié' },
  { id: 2, title: 'Contrôle technique BMW X5', type: 'Entretien', dateTime: '05/06/2025 09:00', recurrence: 'Aucune', assignedTo: 'Atelier', status: 'Planifié' },
  { id: 3, title: 'Assurance Toyota Land Cruiser', type: 'Document', dateTime: '15/06/2025 00:00', recurrence: 'Aucune', assignedTo: 'Admin Maalal', status: 'Planifié' },
  { id: 4, title: 'Réservation #RES-2025-0158', type: 'Réservation', dateTime: '02/06/2025 14:00', recurrence: 'Aucune', assignedTo: 'Ventes', status: 'Planifié' },
  { id: 5, title: 'Facture FAC-2025-0157', type: 'Facture', dateTime: '06/06/2025 11:00', recurrence: 'Hebdomadaire', assignedTo: 'Comptabilité', status: 'Planifié' },
]

export default function ScheduledRemindersPage() {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'history'>('scheduled')

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/notifications"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux notifications</span>
        </Link>
      </div>

      {/* Main Container matching Reference #20 Screen 17D */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-4">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
              Rappels planifiés
            </h1>
            <p className="text-xs text-zinc-400">
              Gérez vos rappels planifiés et consultez l&apos;historique.
            </p>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>Nouveau rappel</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`font-semibold pb-1 relative ${
              activeTab === 'scheduled' ? 'font-bold text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Planifiés</span>
            {activeTab === 'scheduled' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`font-semibold pb-1 relative ${
              activeTab === 'history' ? 'font-bold text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Historique</span>
            {activeTab === 'history' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
          </button>
        </div>

        {/* 5-row Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Titre du rappel</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 font-mono">Date / Heure</th>
                <th className="py-2.5 px-3">Récurrence</th>
                <th className="py-2.5 px-3">Assigné à</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {REMINDERS.map((r) => (
                <tr key={r.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{r.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{r.type}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-300">{r.dateTime}</td>
                  <td className="py-3 px-3 text-zinc-400">{r.recurrence}</td>
                  <td className="py-3 px-3 text-zinc-300 font-medium">{r.assignedTo}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Modifier">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800" title="Supprimer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-2 text-[11px] text-zinc-400">
          Affichage 1 à 5 sur 5 rappels planifiés
        </div>
      </div>
    </div>
  )
}
