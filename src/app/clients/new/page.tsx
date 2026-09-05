'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewClientPage() {
  const [emailOffers, setEmailOffers] = useState(true)
  const [smsOffers, setSmsOffers] = useState(false)
  const [allowCalls, setAllowCalls] = useState(true)

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/clients"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-sm sm:text-base font-black text-white">
            Ajouter un client
          </h1>
        </div>
      </div>

      {/* Main Container matching Reference #21 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Left: Informations principales */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations principales
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Type de client <span className="text-red-500">*</span>
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Particulier</option>
                  <option>Professionnel</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Civilité
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Monsieur</option>
                  <option>Madame</option>
                  <option>Mlle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Entreprise
              </label>
              <input
                type="text"
                placeholder="-"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Top Right: Adresse */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Adresse
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Adresse
              </label>
              <input
                type="text"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Complément
              </label>
              <input
                type="text"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Ville
                </label>
                <input
                  type="text"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Pays
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>France</option>
                <option>Maroc</option>
                <option>Belgique</option>
                <option>Suisse</option>
              </select>
            </div>
          </div>

          {/* Bottom Left: Classification */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Classification
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Segment <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>Particulier Premium</option>
                <option>Particulier Standard</option>
                <option>Entreprise</option>
                <option>Flotte</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Source
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>Recommandation</option>
                <option>Site web</option>
                <option>Showroom</option>
                <option>Réseaux sociaux</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Commercial assigné
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option value="">Non assigné</option>
              </select>
            </div>
          </div>

          {/* Bottom Right: Préférences & communication */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Préférences & communication
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#18181f] border border-[#24242e]">
                <span className="text-zinc-300">Recevoir les offres par email</span>
                <button
                  type="button"
                  onClick={() => setEmailOffers(!emailOffers)}
                  className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    emailOffers ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      emailOffers ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#18181f] border border-[#24242e]">
                <span className="text-zinc-300">Recevoir les offres par SMS</span>
                <button
                  type="button"
                  onClick={() => setSmsOffers(!smsOffers)}
                  className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    smsOffers ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      smsOffers ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#18181f] border border-[#24242e]">
                <span className="text-zinc-300">Autoriser les appels</span>
                <button
                  type="button"
                  onClick={() => setAllowCalls(!allowCalls)}
                  className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    allowCalls ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      allowCalls ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Langue
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Français</option>
                  <option>Arabe</option>
                  <option>Anglais</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/clients"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            Enregistrer le client
          </button>
        </div>
      </div>
    </div>
  )
}
