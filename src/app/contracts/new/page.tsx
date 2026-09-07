'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewContractPage() {
  const [step, setStep] = useState(1)

  const steps = [
    { num: 1, label: 'Informations' },
    { num: 2, label: 'Parties' },
    { num: 3, label: 'Conditions' },
    { num: 4, label: 'Documents' },
    { num: 5, label: 'Récapitulatif' },
  ]

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/contracts"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white">
              Créer un contrat
            </h1>
            <p className="text-[10px] text-zinc-400">
              Contrats &gt; Créer un contrat
            </p>
          </div>
        </div>
      </div>

      {/* Main Container matching Reference #24 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        {/* Stepper */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-4 overflow-x-auto text-xs">
          {steps.map((s) => (
            <div
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 cursor-pointer font-semibold ${
                step === s.num ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${
                  step === s.num ? 'bg-red-600 text-white' : 'border border-[#282834] bg-[#18181f] text-zinc-400'
                }`}
              >
                {s.num}
              </div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Informations générales */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations générales
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Titre du contrat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Contrat de maintenance flotte"
                placeholder="Ex : Contrat de maintenance flotte"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Type de contrat <span className="text-red-500">*</span>
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Maintenance</option>
                  <option>Fourniture</option>
                  <option>Location</option>
                  <option>Assurance</option>
                  <option>Partenariat</option>
                  <option>Service</option>
                  <option>NDA</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Référence
                </label>
                <input
                  type="text"
                  defaultValue="CTR-2025-00128"
                  placeholder="Auto-générée"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Description
              </label>
              <textarea
                rows={5}
                defaultValue="Contrat de maintenance préventive et corrective pour la flotte de véhicules de l'entreprise Groupe TransLog."
                placeholder="Décrivez l'objet du contrat, les objectifs et les principales clauses..."
                className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Right 1 Col: Paramètres clés */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Paramètres clés
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Date de début <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                defaultValue="2025-05-01"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Date de fin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                defaultValue="2026-04-30"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Durée
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>12 mois</option>
                <option>6 mois</option>
                <option>24 mois</option>
                <option>36 mois</option>
                <option>Indéterminée</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Devise <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>EUR - Euro</option>
                <option>MAD - Dirham marocain</option>
                <option>USD - Dollar US</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Montant HT
              </label>
              <input
                type="number"
                defaultValue={48500}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/contracts"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button className="rounded-lg bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            Suivant
          </button>
        </div>
      </div>
    </div>
  )
}
