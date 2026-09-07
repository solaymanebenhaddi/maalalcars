'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewContactPage() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/contacts"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-sm sm:text-base font-black text-white">
            Ajouter un contact
          </h1>
        </div>
      </div>

      {/* Main Container matching Reference #18 Screen 15a */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        {/* Informations personnelles */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-[#202028] pb-2">
            Informations personnelles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Civilité <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>M.</option>
                <option>Mme</option>
                <option>Mlle</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Karim"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Laalou"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="+33 6 44 55 66 77"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="karim.laalou@gmail.com"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Date de naissance
              </label>
              <input
                type="date"
                defaultValue="1985-04-12"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Société
              </label>
              <input
                type="text"
                defaultValue="Laalou Consulting"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Type de contact <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>Prospect</option>
                <option>Client</option>
                <option>Fournisseur</option>
                <option>Vendeur</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
              Statut <span className="text-red-500">*</span>
            </label>
            <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
              <option>Nouveau</option>
              <option>Actif</option>
              <option>En relance</option>
              <option>Inactif</option>
            </select>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-[#202028] pb-2">
            Informations supplémentaires
          </h3>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
              Adresse
            </label>
            <input
              type="text"
              defaultValue="125 Rue de la République, 69002 Lyon"
              className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Segment <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>Prospect chaud</option>
                <option>VIP</option>
                <option>Fidèle</option>
                <option>Prospect froid</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Source
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>Site web</option>
                <option>Recommandation</option>
                <option>Réseaux sociaux</option>
                <option>Showroom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
              Notes
            </label>
            <textarea
              rows={2}
              defaultValue="Intéressé par Toyota Land Cruiser 2023."
              className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/contacts"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            Enregistrer le contact
          </button>
        </div>
      </div>
    </div>
  )
}
