'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  User,
} from 'lucide-react'

export default function NewDeliveryPage() {
  const [step, setStep] = useState(1)

  const steps = [
    { num: 1, label: 'Informations' },
    { num: 2, label: 'Détails' },
    { num: 3, label: 'Documents' },
    { num: 4, label: 'Confirmation' },
  ]

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/deliveries"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white">
              Planifier une livraison
            </h1>
            <p className="text-[10px] text-zinc-400">
              Livraisons &gt; Planifier une livraison
            </p>
          </div>
        </div>
      </div>

      {/* Main Container matching Reference #26 Screen 26A */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Col: Informations générales */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-red-500" />
              <span>Informations générales</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Sophie Martin (CLI-1524)</option>
                <option>Julien Moreau (CLI-1525)</option>
                <option>Thomas Bernard (CLI-1526)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Véhicule à livrer <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Mercedes GLE 53 AMG (WW-325-KL)</option>
                <option>BMW X5 xDrive 40i (GH-241-PL)</option>
                <option>Audi Q7 50 TDI (FN-789-LM)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Immatriculation
                </label>
                <input
                  type="text"
                  defaultValue="WW-325-KL"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-zinc-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  N° Commande / Vente
                </label>
                <input
                  type="text"
                  defaultValue="CMD-2025-0487"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-zinc-300 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Commercial responsable <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Yassine Benali</option>
                <option>Sarah Martin</option>
                <option>Adrien Maalal</option>
              </select>
            </div>
          </div>

          {/* Right Col: Planification */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              <span>Planification</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Date de remise <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  defaultValue="2025-05-20"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Heure <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  defaultValue="10:30"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Lieu de remise <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                <option>MAALAL CARS — Showroom Casablanca</option>
                <option>MAALAL CARS — Showroom Rabat</option>
                <option>Livraison à domicile VIP</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Type de remise
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Remise standard (Showroom &amp; Explication)</option>
                <option>Remise express</option>
                <option>Remise premium avec champagne &amp; housse</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Notes &amp; Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Instructions complémentaires..."
                className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/deliveries"
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
