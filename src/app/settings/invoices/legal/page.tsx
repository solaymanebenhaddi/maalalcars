'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  FileText,
  CheckCircle2,
} from 'lucide-react'

export default function InvoiceLegalPage() {
  const [mentions, setMentions] = useState({
    social: true,
    ice: true,
    rc: true,
    address: true,
    phone: true,
    email: true,
    patent: true,
    capital: true,
  })

  const toggleMention = (key: keyof typeof mentions) => {
    setMentions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/settings/invoices"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux paramètres factures</span>
        </Link>
      </div>

      {/* Main Container matching Reference #30 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Informations légales &amp; pied de page
          </h1>
          <p className="text-xs text-zinc-400">
            Paramètres &gt; Factures &gt; Informations légales • Renseignez les identifiants fiscaux et personnalisez les mentions légales
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Formulaire & Pied de page */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-4">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-red-500" />
                <span>Informations légales</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Raison sociale <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="MAALAL CARS SARL"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    ICE <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="001234567890123"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    RC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="123456"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Patente
                  </label>
                  <input
                    type="text"
                    defaultValue="58789012"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Adresse du siège
                  </label>
                  <input
                    type="text"
                    defaultValue="Lot 123, Zone Industrielle Sidi Maarouf, Casablanca"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    defaultValue="+212 5 22 12 34 56"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="contact@maalalcars.ma"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Site web
                  </label>
                  <input
                    type="text"
                    defaultValue="www.maalalcars.ma"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Pied de page WYSIWYG */}
            <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-3">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-cyan-400" />
                <span>Pied de page</span>
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-1 border border-[#282834] bg-[#121216] p-1 rounded-t-lg text-zinc-400 text-xs">
                  <button type="button" className="px-2 py-0.5 font-bold hover:text-white">B</button>
                  <button type="button" className="px-2 py-0.5 italic hover:text-white">I</button>
                  <button type="button" className="px-2 py-0.5 underline hover:text-white">U</button>
                  <span className="text-zinc-700">|</span>
                  <span className="text-[10px] text-zinc-500 px-2">Éditeur de mentions légales</span>
                </div>

                <textarea
                  rows={3}
                  defaultValue="Merci pour votre confiance. Toute réclamation doit être faite dans un délai de 7 jours. Les marchandises restent notre propriété jusqu'au paiement intégral. Règlement par chèque à l'ordre de MAALAL CARS SARL."
                  className="w-full rounded-b-lg border border-[#282834] bg-[#121216] p-3 text-xs text-white focus:outline-none focus:border-red-500 -mt-2"
                />
              </div>
            </div>
          </div>

          {/* Right Col: Mentions légales Checkboxes */}
          <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Mentions légales
              </h3>

              <div className="space-y-2 text-[11px]">
                <label onClick={() => toggleMention('social')} className="flex items-center gap-2 cursor-pointer p-1.5 rounded bg-[#121216]">
                  <input type="checkbox" checked={mentions.social} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                  <span className="text-zinc-300">Raison sociale</span>
                </label>

                <label onClick={() => toggleMention('ice')} className="flex items-center gap-2 cursor-pointer p-1.5 rounded bg-[#121216]">
                  <input type="checkbox" checked={mentions.ice} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                  <span className="text-zinc-300">ICE (Identifiant Commun)</span>
                </label>

                <label onClick={() => toggleMention('rc')} className="flex items-center gap-2 cursor-pointer p-1.5 rounded bg-[#121216]">
                  <input type="checkbox" checked={mentions.rc} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                  <span className="text-zinc-300">RC (Registre du Commerce)</span>
                </label>

                <label onClick={() => toggleMention('address')} className="flex items-center gap-2 cursor-pointer p-1.5 rounded bg-[#121216]">
                  <input type="checkbox" checked={mentions.address} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                  <span className="text-zinc-300">Adresse du siège</span>
                </label>

                <label onClick={() => toggleMention('phone')} className="flex items-center gap-2 cursor-pointer p-1.5 rounded bg-[#121216]">
                  <input type="checkbox" checked={mentions.phone} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                  <span className="text-zinc-300">Téléphone</span>
                </label>

                <label onClick={() => toggleMention('email')} className="flex items-center gap-2 cursor-pointer p-1.5 rounded bg-[#121216]">
                  <input type="checkbox" checked={mentions.email} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                  <span className="text-zinc-300">Email</span>
                </label>

                <label onClick={() => toggleMention('patent')} className="flex items-center gap-2 cursor-pointer p-1.5 rounded bg-[#121216]">
                  <input type="checkbox" checked={mentions.patent} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                  <span className="text-zinc-300">Patente</span>
                </label>

                <label onClick={() => toggleMention('capital')} className="flex items-center gap-2 cursor-pointer p-1.5 rounded bg-[#121216]">
                  <input type="checkbox" checked={mentions.capital} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                  <span className="text-zinc-300">Capital social</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#202028]">
              <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
