'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Check,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

interface RecurringItem {
  id: string
  code: string
  category: string
  supplier: string
  frequency: string
  amountTTC: number
  status: 'PENDING_VALIDATION' | 'VALIDATED'
}

const RECURRING_EXPENSES: RecurringItem[] = [
  { id: '1', code: 'R-2025-001', category: 'Assurance', supplier: 'AXA', frequency: 'Mensuelle', amountTTC: 620.0, status: 'PENDING_VALIDATION' },
  { id: '2', code: 'R-2025-002', category: 'Abonnement', supplier: 'Odoo', frequency: 'Mensuelle', amountTTC: 25.0, status: 'PENDING_VALIDATION' },
  { id: '3', code: 'R-2025-003', category: 'Hébergement', supplier: 'OVH', frequency: 'Mensuelle', amountTTC: 15.0, status: 'PENDING_VALIDATION' },
  { id: '4', code: 'R-2025-004', category: 'Comptable', supplier: 'ExpertCom', frequency: 'Mensuelle', amountTTC: 150.0, status: 'PENDING_VALIDATION' },
  { id: '5', code: 'R-2025-005', category: 'Location bureaux', supplier: 'OfficeRent', frequency: 'Mensuelle', amountTTC: 350.0, status: 'PENDING_VALIDATION' },
]

export default function RecurringExpensesPage() {
  const [activeTab, setActiveTab] = useState<'recurring' | 'monthlyValidation'>('monthlyValidation')
  const [validatedMap, setValidatedMap] = useState<Record<string, boolean>>({})
  const [isValidatingAll, setIsValidatingAll] = useState(false)

  const handleValidateSingle = (id: string) => {
    setValidatedMap((prev) => ({ ...prev, [id]: true }))
  }

  const handleValidateAll = () => {
    setIsValidatingAll(true)
    setTimeout(() => {
      const all: Record<string, boolean> = {}
      RECURRING_EXPENSES.forEach((r) => {
        all[r.id] = true
      })
      setValidatedMap(all)
      setIsValidatingAll(false)
    }, 500)
  }

  const totalValidated = RECURRING_EXPENSES.reduce(
    (sum, r) => sum + (validatedMap[r.id] ? r.amountTTC : 0),
    0
  )
  const totalToValidate = 1160.0 - totalValidated

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      <PageHeader
        title="Dépenses récurrentes / Validation"
        subtitle="Validez les dépenses récurrentes de ce mois avant leur enregistrement comptable."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Dépenses', href: '/expenses' },
          { label: 'Récurrentes & Validation' },
        ]}
        actions={
          <Link
            href="/expenses"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour dépenses</span>
          </Link>
        }
      />

      {/* Main Container matching Reference #12 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button
            onClick={() => setActiveTab('recurring')}
            className={`font-semibold transition-all ${
              activeTab === 'recurring' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Dépenses récurrentes</span>
          </button>
          <button
            onClick={() => setActiveTab('monthlyValidation')}
            className={`font-bold transition-all relative pb-1 ${
              activeTab === 'monthlyValidation' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Validation mensuelle</span>
            {activeTab === 'monthlyValidation' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>
        </div>

        <p className="text-zinc-400 text-xs">
          Validez les dépenses récurrentes de ce mois avant leur enregistrement comptable.
        </p>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Dépense récurrente</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Fournisseur</th>
                <th className="py-2.5 px-3">Fréquence</th>
                <th className="py-2.5 px-3 text-right">Montant TTC</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {RECURRING_EXPENSES.map((r, idx) => {
                const isValidated = validatedMap[r.id]
                return (
                  <tr key={r.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">{r.code}</td>
                    <td className="py-3 px-3 font-medium text-white">{r.category}</td>
                    <td className="py-3 px-3 text-zinc-300">{r.supplier}</td>
                    <td className="py-3 px-3 text-zinc-400 font-medium">{r.frequency}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {r.amountTTC.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                          isValidated
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {isValidated ? 'Validée ✓' : 'À valider'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleValidateSingle(r.id)}
                          disabled={isValidated}
                          className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 disabled:opacity-40"
                          title="Valider"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                          title="Détails"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 3 Summary Cards matching Reference #12 Screen 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3.5 text-center">
            <span className="text-[10px] text-zinc-400 font-medium block mb-0.5">Total à valider</span>
            <span className="text-base font-black font-mono text-white">
              {totalToValidate.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
            </span>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3.5 text-center">
            <span className="text-[10px] text-zinc-400 font-medium block mb-0.5">Déjà validé</span>
            <span className="text-base font-black font-mono text-emerald-400">
              {totalValidated.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
            </span>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3.5 text-center">
            <span className="text-[10px] text-zinc-400 font-medium block mb-0.5">Total mois prochain</span>
            <span className="text-base font-black font-mono text-white">1 160,00 DH</span>
          </div>
        </div>

        {/* Bottom CTA Action matching Reference #12 Screen 5 */}
        <div className="flex items-center justify-end pt-3 border-t border-[#222228]">
          <button
            onClick={handleValidateAll}
            disabled={isValidatingAll}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isValidatingAll ? 'Validation en cours...' : 'Valider toutes les dépenses'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
