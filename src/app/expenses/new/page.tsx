'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  UploadCloud,
  FileText,
  DollarSign,
  Car,
  Check,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

export default function NewExpensePage() {
  const router = useRouter()
  const [amountHT, setAmountHT] = useState(70.83)
  const [taxRate, setTaxRate] = useState(20)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const taxAmount = Number(((amountHT * taxRate) / 100).toFixed(2))
  const amountTTC = Number((amountHT + taxAmount).toFixed(2))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/expenses')
    }, 600)
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto text-xs text-white">
      <PageHeader
        title="Ajouter une dépense"
        subtitle="Enregistrer un nouveau frais engagé avec ventilation comptable et justificatif."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Dépenses', href: '/expenses' },
          { label: 'Ajouter une dépense' },
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

      {/* Main 4 Cards Container matching Reference #12 Screen 3 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Top 2 Cards: Informations générales & Montants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Informations générales */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>Informations générales</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  defaultValue="Transport"
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Transport">Transport</option>
                  <option value="Préparation">Préparation</option>
                  <option value="Atelier">Atelier</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Administratif">Administratif</option>
                  <option value="Autres">Autres</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Fournisseur <span className="text-red-500">*</span>
                </label>
                <select
                  defaultValue="TotalEnergies"
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="TotalEnergies">TotalEnergies</option>
                  <option value="Auto Clean Pro">Auto Clean Pro</option>
                  <option value="Garage Premium">Garage Premium</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="AXA">AXA</option>
                  <option value="Clean Car">Clean Car</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Libellé <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Plein carburant"
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  defaultValue="Plein de carburant pour Toyota Land Cruiser"
                  className="w-full rounded border border-[#282834] bg-[#18181f] p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="date"
                    defaultValue="2025-05-30"
                    className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Montants */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
              <span>Montants</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Montant HT <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    value={amountHT}
                    onChange={(e) => setAmountHT(Number(e.target.value))}
                    className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-3 pr-8 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                  <span className="absolute right-3 text-zinc-500 font-mono text-xs">DH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 mb-1">TVA (%)</label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value={20}>20%</option>
                    <option value={14}>14%</option>
                    <option value={10}>10%</option>
                    <option value={0}>0%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 mb-1">Montant TVA</label>
                  <div className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 flex items-center justify-between font-mono text-zinc-300 text-xs">
                    <span>{taxAmount.toFixed(2)}</span>
                    <span className="text-zinc-500">DH</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Montant TTC <span className="text-red-500">*</span>
                </label>
                <div className="h-8 rounded border border-[#282834] bg-[#16161c] px-2.5 flex items-center justify-between font-mono font-bold text-white text-xs">
                  <span>{amountTTC.toFixed(2)}</span>
                  <span className="text-red-400 font-bold">DH</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Mode de paiement <span className="text-red-500">*</span>
                </label>
                <select
                  defaultValue="Carte bancaire"
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Carte bancaire">Carte bancaire</option>
                  <option value="Virement">Virement</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Prélèvement">Prélèvement</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Statut <span className="text-red-500">*</span>
                </label>
                <select
                  defaultValue="Payée"
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Payée">Payée</option>
                  <option value="En attente">En attente</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 2 Cards: Affectation & Pièce jointe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 3: Affectation */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5 text-zinc-400" />
              <span>Affectation</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                  Véhicule / Projet
                </label>
                <select
                  defaultValue="Toyota Land Cruiser"
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Toyota Land Cruiser">Toyota Land Cruiser</option>
                  <option value="BMW X5">BMW X5</option>
                  <option value="Mercedes GLC">Mercedes GLC</option>
                  <option value="Audi Q7">Audi Q7</option>
                  <option value="—">Aucun (Frais général)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">Kilométrage</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    defaultValue={12650}
                    className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-3 pr-8 text-xs font-mono text-white focus:outline-none"
                  />
                  <span className="absolute right-3 text-zinc-500 font-mono text-xs">km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Pièce jointe */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
              <UploadCloud className="h-3.5 w-3.5 text-zinc-400" />
              <span>Pièce jointe</span>
            </h2>

            <div className="rounded-xl border-2 border-dashed border-[#282834] bg-[#18181f] p-4 text-center hover:border-red-500/50 transition-colors cursor-pointer">
              <UploadCloud className="h-6 w-6 text-zinc-400 mx-auto mb-1.5" />
              <div className="font-bold text-white text-xs">Ajouter un justificatif</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">PDF, JPG, PNG (max. 5 Mo)</div>
            </div>
          </div>
        </div>

        {/* Bottom Actions matching Reference #12 Screen 3 */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222228]">
          <Link
            href="/expenses"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer la dépense'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
