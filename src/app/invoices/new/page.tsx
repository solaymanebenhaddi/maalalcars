'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Plus,
  Trash2,
  FileText,
  Save,
  Check,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPriceHT: number
  taxRate: number
}

const DEFAULT_LINES: LineItem[] = [
  { id: '1', description: '', quantity: 1, unitPriceHT: 0, taxRate: 20 },
]

const today = new Date().toISOString().split('T')[0]
const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

export default function NewInvoicePage() {
  const router = useRouter()
  const [lines, setLines] = useState<LineItem[]>(DEFAULT_LINES)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addLine = () => {
    setLines([
      ...lines,
      {
        id: String(Date.now()),
        description: 'Prestation additionnelle',
        quantity: 1,
        unitPriceHT: 500,
        taxRate: 20,
      },
    ])
  }

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter((l) => l.id !== id))
    }
  }

  const subtotalHT = lines.reduce((sum, l) => sum + l.quantity * l.unitPriceHT, 0)
  const taxAmount = lines.reduce(
    (sum, l) => sum + (l.quantity * l.unitPriceHT * l.taxRate) / 100,
    0
  )
  const totalTTC = subtotalHT + taxAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/invoices')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      <PageHeader
        title="Créer une facture"
        subtitle="Émettre une nouvelle facture de vente ou prestation avec calcul automatique de la TVA."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Factures', href: '/invoices' },
          { label: 'Créer une facture' },
        ]}
        actions={
          <Link
            href="/invoices"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour factures</span>
          </Link>
        }
      />

      {/* Main 2-column Grid matching Reference #13 Screen 2 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Card: Informations générales */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3.5 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>Informations générales</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  defaultValue=""
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">-- Sélectionner un client --</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Vente <span className="text-red-500">*</span>
                </label>
                <select
                  defaultValue=""
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">-- Sélectionner une vente --</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                    Date facture <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="date"
                      defaultValue={today}
                      className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                    Échéance <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="date"
                      defaultValue={dueDate}
                      className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Mode de paiement <span className="text-red-500">*</span>
                </label>
                <select
                  defaultValue="Virement bancaire"
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Virement bancaire">Virement bancaire</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Carte bancaire">Carte bancaire</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Adresse de facturation
                </label>
                <textarea
                  rows={2}
                  defaultValue=""
                  className="w-full rounded border border-[#282834] bg-[#18181f] p-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">Notes</label>
                <input
                  type="text"
                  defaultValue=""
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Right Card: Articles / Prestations */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3.5 shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center justify-between">
                <span>Articles / Prestations</span>
                <button
                  type="button"
                  onClick={addLine}
                  className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-semibold"
                >
                  <Plus className="h-3 w-3" />
                  <span>Ajouter une ligne</span>
                </button>
              </h2>

              {/* Line Items Table matching Reference #13 Screen 2 */}
              <div className="overflow-x-auto rounded border border-[#202028]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#222228] bg-[#16161c] text-[10px] text-zinc-400">
                      <th className="py-2 px-2.5">Description</th>
                      <th className="py-2 px-1 text-center">Qté</th>
                      <th className="py-2 px-2 text-right">PU HT</th>
                      <th className="py-2 px-1 text-center">TVA</th>
                      <th className="py-2 px-2 text-right">Total HT</th>
                      <th className="py-2 px-1 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e24]">
                    {lines.map((l) => (
                      <tr key={l.id} className="hover:bg-[#18181f]">
                        <td className="py-2 px-2.5 font-medium text-white text-[11px]">
                          {l.description}
                        </td>
                        <td className="py-2 px-1 text-center font-mono text-zinc-300">
                          {l.quantity}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-zinc-300">
                          {l.unitPriceHT.toLocaleString('fr-MA')} DH
                        </td>
                        <td className="py-2 px-1 text-center font-mono text-zinc-400">
                          {l.taxRate}%
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-white">
                          {(l.quantity * l.unitPriceHT).toLocaleString('fr-MA')} DH
                        </td>
                        <td className="py-2 px-1 text-center">
                          {lines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLine(l.id)}
                              className="text-zinc-500 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subtotals & Totals matching Reference #13 Screen 2 */}
            <div className="rounded-xl border border-[#222228] bg-[#18181f] p-3 space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Sous-total HT</span>
                <span className="font-mono text-white font-bold">
                  {subtotalHT.toLocaleString('fr-MA', { minimumFractionDigits: 0 })} DH
                </span>
              </div>

              <div className="flex justify-between text-xs text-zinc-400">
                <span>TVA (20%)</span>
                <span className="font-mono text-white font-bold">
                  {taxAmount.toLocaleString('fr-MA', { minimumFractionDigits: 0 })} DH
                </span>
              </div>

              <div className="flex justify-between text-sm text-white font-black border-t border-[#282834] pt-2">
                <span>Total TTC</span>
                <span className="font-mono text-red-400">
                  {totalTTC.toLocaleString('fr-MA', { minimumFractionDigits: 0 })} DH
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions matching Reference #13 Screen 2 */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222228]">
          <Link
            href="/invoices"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Save className="h-3.5 w-3.5 text-zinc-400" />
            <span>Enregistrer le brouillon</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Création...' : 'Finaliser la facture'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
