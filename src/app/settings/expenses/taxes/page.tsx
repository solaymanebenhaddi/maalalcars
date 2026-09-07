'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Receipt,
  CheckCircle2,
  Save,
} from 'lucide-react'

export default function ExpenseTaxesSettingsPage() {
  const [defaultTaxRate, setDefaultTaxRate] = useState(20)
  const [deductibleRate, setDeductibleRate] = useState(100)
  const [recoverableVatEnabled, setRecoverableVatEnabled] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/settings/expenses"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux paramètres dépenses</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Paramètres</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="text-zinc-300">Dépenses</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">TVA &amp; fiscalité</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-purple-400" />
              <span>TVA &amp; fiscalité des dépenses</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configurez la TVA, la déductibilité et les règles fiscales applicables (Code Général des Impôts Marocain).
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Enregistrer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[#202028] bg-[#16161c] space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Taux de TVA standard
            </h3>
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Taux normal par défaut (Maroc)
              </label>
              <select
                value={defaultTaxRate}
                onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option value={20}>20% (Taux normal standard)</option>
                <option value={14}>14% (Prestations de transport)</option>
                <option value={10}>10% (Hôtellerie et restauration)</option>
                <option value={7}>7% (Fournitures scolaires)</option>
                <option value={0}>0% (Exonération art. 91-92 CGI)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#202028] bg-[#16161c] space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Déductibilité fiscale
            </h3>
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Plafond de déductibilité des charges véhicules
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={deductibleRate}
                  onChange={(e) => setDeductibleRate(Number(e.target.value))}
                  className="h-8 w-24 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                />
                <span className="text-zinc-400">% de la charge TTC</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#202028] bg-[#16161c] flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Gestion de la TVA récupérable</div>
            <div className="text-[11px] text-zinc-400">
              Isoler automatiquement la TVA déductible dans le journal des achats et exports comptables
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRecoverableVatEnabled(!recoverableVatEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              recoverableVatEnabled ? 'bg-emerald-500' : 'bg-[#282834]'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                recoverableVatEnabled ? 'translate-x-4.5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Paramètres fiscaux enregistrés avec succès !</span>
        </div>
      )}
    </div>
  )
}
