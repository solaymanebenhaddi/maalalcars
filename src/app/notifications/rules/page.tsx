'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react'

interface AutomationRule {
  id: number
  name: string
  trigger: string
  condition: string
  recipients: string
  enabled: boolean
}

const INITIAL_RULES: AutomationRule[] = [
  { id: 1, name: 'Stock âgé', trigger: 'Véhicule en stock', condition: '> 90 jours', recipients: 'Admin, Stock Manager', enabled: true },
  { id: 2, name: 'Paiement en retard', trigger: 'Échéance dépassée', condition: '> 5 jours', recipients: 'Admin, Comptabilité', enabled: true },
  { id: 3, name: 'Document expirant', trigger: 'Expiration document', condition: '< 15 jours', recipients: 'Admin, Documents', enabled: true },
  { id: 4, name: 'Réservation à confirmer', trigger: 'Réservation créée', condition: 'Non confirmée > 24h', recipients: 'Admin, Ventes', enabled: true },
  { id: 5, name: 'Entretien planifié', trigger: 'Date d\'entretien', condition: 'À venir < 3 jours', recipients: 'Admin, Atelier', enabled: true },
  { id: 6, name: 'Facture envoyée', trigger: 'Facture créée', condition: 'Toujours', recipients: 'Client, Admin', enabled: true },
]

export default function AutomationRulesPage() {
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES)

  const toggleRule = (id: number) => {
    setRules(
      rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    )
  }

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

      {/* Main Container matching Reference #20 Screen 17B */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-4">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
              Règles d&apos;automatisation
            </h1>
            <p className="text-xs text-zinc-400">
              Créez des règles pour générer automatiquement des notifications.
            </p>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>Nouvelle règle</span>
          </button>
        </div>

        {/* 6-row Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Nom de la règle</th>
                <th className="py-2.5 px-3">Déclencheur</th>
                <th className="py-2.5 px-3">Conditions</th>
                <th className="py-2.5 px-3">Destinataires</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{r.name}</td>
                  <td className="py-3 px-3 text-zinc-300">{r.trigger}</td>
                  <td className="py-3 px-3 font-mono text-zinc-300">{r.condition}</td>
                  <td className="py-3 px-3 text-zinc-400">{r.recipients}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleRule(r.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        r.enabled ? 'bg-emerald-600' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          r.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
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
          Affichage 1 à 6 sur 6 règles
        </div>
      </div>
    </div>
  )
}
