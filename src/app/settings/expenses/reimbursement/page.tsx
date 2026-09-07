'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  FileCheck,
  Check,
  Edit2,
  Save,
  CheckCircle2,
} from 'lucide-react'

interface RequiredDocsItem {
  id: number
  category: string
  invoiceReceipt: boolean
  receiptOver50: boolean
  expenseReport: boolean
  otherDoc: boolean
}

const INITIAL_REQUIRED_DOCS: RequiredDocsItem[] = [
  { id: 1, category: 'Carburant', invoiceReceipt: true, receiptOver50: true, expenseReport: false, otherDoc: false },
  { id: 2, category: 'Entretien & Réparations', invoiceReceipt: true, receiptOver50: true, expenseReport: true, otherDoc: false },
  { id: 3, category: 'Péages & Stationnement', invoiceReceipt: true, receiptOver50: true, expenseReport: false, otherDoc: false },
  { id: 4, category: 'Hébergement', invoiceReceipt: true, receiptOver50: true, expenseReport: true, otherDoc: false },
  { id: 5, category: 'Restauration', invoiceReceipt: true, receiptOver50: true, expenseReport: false, otherDoc: false },
  { id: 6, category: 'Transports', invoiceReceipt: true, receiptOver50: false, expenseReport: false, otherDoc: true },
  { id: 7, category: 'Fournitures de bureau', invoiceReceipt: true, receiptOver50: false, expenseReport: false, otherDoc: false },
  { id: 8, category: 'Télécommunications', invoiceReceipt: true, receiptOver50: false, expenseReport: false, otherDoc: false },
]

export default function ExpenseReimbursementSettingsPage() {
  const [maxDays, setMaxDays] = useState(15)
  const [currency, setCurrency] = useState('MAD - Dirham marocain')
  const [defaultMethod, setDefaultMethod] = useState('Virement bancaire')
  const [autoReimbursement, setAutoReimbursement] = useState(false)

  // Other params toggles
  const [allowAdvances, setAllowAdvances] = useState(false)
  const [requireExpenseReport, setRequireExpenseReport] = useState(true)
  const [groupByCategory, setGroupByCategory] = useState(false)

  const [docsList, setDocsList] = useState<RequiredDocsItem[]>(INITIAL_REQUIRED_DOCS)
  const [savedToast, setSavedToast] = useState(false)

  const toggleDoc = (id: number, key: keyof Omit<RequiredDocsItem, 'id' | 'category'>) => {
    setDocsList(
      docsList.map((item) =>
        item.id === id ? { ...item, [key]: !item[key] } : item
      )
    )
  }

  const handleSave = () => {
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs matching Reference #32 Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
          <span className="font-semibold text-white">Remboursement &amp; justificatifs</span>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Enregistrer les modifications</span>
        </button>
      </div>

      <div className="border-b border-[#222228] pb-3">
        <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-cyan-400" />
          <span>Remboursement &amp; justificatifs</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Définissez les règles de remboursement et les documents obligatoires.
        </p>
      </div>

      {/* Top 2-Column Grid matching Reference #32 Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Règles de remboursement (span-5) */}
        <div className="lg:col-span-5 rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Règles de remboursement
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Délai maximum de remboursement
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={maxDays}
                  onChange={(e) => setMaxDays(Number(e.target.value) || 0)}
                  className="h-8 w-24 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
                <span className="text-zinc-400">jours</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Devise de remboursement
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option value="MAD - Dirham marocain">MAD - Dirham marocain</option>
                <option value="EUR - Euro">EUR - Euro</option>
                <option value="USD - Dollar américain">USD - Dollar américain</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Mode de remboursement par défaut
              </label>
              <select
                value={defaultMethod}
                onChange={(e) => setDefaultMethod(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Virement bancaire">Virement bancaire</option>
                <option value="Chèque">Chèque</option>
                <option value="Espèces">Espèces</option>
              </select>
            </div>

            <div className="pt-2 border-t border-[#1e1e24] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Remboursement automatique</div>
                <div className="text-[10px] text-zinc-400">
                  Activer le remboursement automatique pour les dépenses approuvées
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoReimbursement(!autoReimbursement)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  autoReimbursement ? 'bg-emerald-500' : 'bg-[#282834]'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    autoReimbursement ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Documents obligatoires par catégorie (span-7) */}
        <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Documents obligatoires par catégorie
          </h2>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Catégorie</th>
                  <th className="py-2.5 px-2 text-center">Facture / Reçu</th>
                  <th className="py-2.5 px-2 text-center">Justificatif (&gt;50DH)</th>
                  <th className="py-2.5 px-2 text-center">Note de frais</th>
                  <th className="py-2.5 px-2 text-center">Autre document</th>
                  <th className="py-2.5 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {docsList.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white">{doc.category}</td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => toggleDoc(doc.id, 'invoiceReceipt')}
                        className={`inline-flex h-5 w-5 items-center justify-center rounded transition-colors ${
                          doc.invoiceReceipt
                            ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                            : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {doc.invoiceReceipt && <Check className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => toggleDoc(doc.id, 'receiptOver50')}
                        className={`inline-flex h-5 w-5 items-center justify-center rounded transition-colors ${
                          doc.receiptOver50
                            ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                            : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {doc.receiptOver50 && <Check className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => toggleDoc(doc.id, 'expenseReport')}
                        className={`inline-flex h-5 w-5 items-center justify-center rounded transition-colors ${
                          doc.expenseReport
                            ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                            : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {doc.expenseReport && <Check className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => toggleDoc(doc.id, 'otherDoc')}
                        className={`inline-flex h-5 w-5 items-center justify-center rounded transition-colors ${
                          doc.otherDoc
                            ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                            : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {doc.otherDoc && <Check className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800">
                        <Edit2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Card: Autres paramètres matching Reference #32 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
          Autres paramètres
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Autoriser les avances de frais</div>
              <div className="text-[11px] text-zinc-400">Permettre les demandes d&apos;avance sur frais de déplacement</div>
            </div>
            <button
              type="button"
              onClick={() => setAllowAdvances(!allowAdvances)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                allowAdvances ? 'bg-emerald-500' : 'bg-[#282834]'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  allowAdvances ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Exiger une note de frais</div>
              <div className="text-[11px] text-zinc-400">Toujours exiger une note de frais détaillée pour chaque remboursement</div>
            </div>
            <button
              type="button"
              onClick={() => setRequireExpenseReport(!requireExpenseReport)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                requireExpenseReport ? 'bg-emerald-500' : 'bg-[#282834]'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  requireExpenseReport ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] flex items-center justify-between md:col-span-2">
            <div>
              <div className="font-semibold text-white">Regrouper par catégories</div>
              <div className="text-[11px] text-zinc-400">
                Autoriser le regroupement de dépenses par même catégorie et date pour un traitement consolidé
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGroupByCategory(!groupByCategory)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                groupByCategory ? 'bg-emerald-500' : 'bg-[#282834]'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  groupByCategory ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Paramètres de remboursement enregistrés !</span>
        </div>
      )}
    </div>
  )
}
