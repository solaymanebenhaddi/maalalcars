'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'

export default function NewSupplierPage() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/suppliers"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-sm sm:text-base font-black text-white">
            Ajouter un fournisseur
          </h1>
        </div>
      </div>

      {/* Main Container matching Reference #19 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        {/* 5-Step Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-[#202028] pb-4 text-center text-[10px]">
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-red-600/15 border border-red-500/30 p-2 font-bold text-red-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] text-white">1</span>
            <span>Informations générales</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#16161c] border border-[#24242e] p-2 text-zinc-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-[9px] text-zinc-400">2</span>
            <span>Contact</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#16161c] border border-[#24242e] p-2 text-zinc-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-[9px] text-zinc-400">3</span>
            <span>Banque</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#16161c] border border-[#24242e] p-2 text-zinc-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-[9px] text-zinc-400">4</span>
            <span>Produits</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#16161c] border border-[#24242e] p-2 text-zinc-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-[9px] text-zinc-400">5</span>
            <span>Documents</span>
          </div>
        </div>

        {/* Step 1 Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Form Fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Nom du fournisseur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Denso France"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Nom commercial
                </label>
                <input
                  type="text"
                  defaultValue="Denso Automotive"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Catégorie principale <span className="text-red-500">*</span>
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Électronique</option>
                  <option>Pièces mécaniques</option>
                  <option>Pneumatiques</option>
                  <option>Freinage</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Sous-catégorie
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Systèmes d&apos;injection</option>
                  <option>Alternateurs & Démarreurs</option>
                  <option>Capteurs</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Pays <span className="text-red-500">*</span>
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>France</option>
                  <option>Maroc</option>
                  <option>Allemagne</option>
                  <option>Italie</option>
                  <option>Japon</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Statut <span className="text-red-500">*</span>
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Actif</option>
                  <option>Inactif</option>
                  <option>En attente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Numéro SIRET / ICE <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="451 789 987 00029"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Code fournisseur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="F-2025-129"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Site web
              </label>
              <input
                type="url"
                defaultValue="https://www.denso.com/fr"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Notes
              </label>
              <textarea
                rows={2}
                defaultValue="Fournisseur spécialisé en systèmes d'injection et gestion moteur."
                className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Right 1 Col: Logo Box */}
          <div className="space-y-3">
            <label className="block text-[11px] font-semibold text-zinc-300">
              Logo du fournisseur
            </label>

            <div className="flex flex-col items-center justify-center rounded-xl border border-[#282834] bg-[#16161c] p-6 text-center space-y-3">
              <div className="flex h-20 w-36 items-center justify-center rounded-lg bg-white p-3 shadow-inner">
                <span className="font-black text-red-600 tracking-wider text-xl">DENSO</span>
              </div>
              <p className="text-[10px] text-zinc-400">Crafting the Core</p>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#1a1a24] px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                <ImageIcon className="h-3 w-3" />
                <span>Changer le logo</span>
              </button>
              <span className="text-[9px] text-zinc-500">PNG, JPG ou SVG, Max 2MB.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/suppliers"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            Suivant →
          </button>
        </div>
      </div>
    </div>
  )
}
