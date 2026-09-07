'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewPurchaseOrderPage() {
  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/purchases"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white">
              Nouveau bon de commande
            </h1>
            <p className="text-[10px] text-zinc-400">
              Achats &gt; Bons de commande &gt; Nouveau
            </p>
          </div>
        </div>
      </div>

      {/* Main Container matching Reference #23 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Informations</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Produits</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Informations générales */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations générales
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Fournisseur <span className="text-red-500">*</span>
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Sélectionner un fournisseur</option>
                  <option>Bosch Automotive</option>
                  <option>Denso France</option>
                  <option>Valeo Service</option>
                  <option>TotalEnergies Lubrifiants</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  defaultValue="2025-05-27"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Référence fournisseur
                </label>
                <input
                  type="text"
                  placeholder="Réf. fournisseur"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Contact
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Sélectionner un contact</option>
                  <option>Jean Dupont</option>
                  <option>Pierre Martin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Devise
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>EUR - Euro</option>
                  <option>MAD - Dirham marocain</option>
                  <option>USD - Dollar US</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Date de livraison souhaitée
                </label>
                <input
                  type="date"
                  defaultValue="2025-06-02"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Entrepôt / Réception
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>Entrepôt principal</option>
                  <option>Atelier Casablanca</option>
                  <option>Showroom Rabat</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Conditions de paiement
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                  <option>30 jours fin de mois</option>
                  <option>Comptant à la livraison</option>
                  <option>Acompte 30% à la commande</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Commentaires
              </label>
              <textarea
                rows={3}
                placeholder="Instructions ou commentaires pour le fournisseur..."
                className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Right 1 Col: Adresses de facturation & livraison */}
          <div className="space-y-4">
            {/* Adresse de facturation */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-2">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Adresse de facturation
              </h3>

              <div className="text-[11px] space-y-1 text-zinc-300">
                <div className="font-bold text-white">MAALAL CARS</div>
                <div>123, Route de Blagnac</div>
                <div>31700 Blagnac - France</div>
                <div className="text-[10px] text-zinc-400 pt-1">SIRET : 830 123 456 00017</div>
                <div className="text-[10px] text-zinc-400">TVA : FR83 012345678</div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-2">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Adresse de livraison
              </h3>

              <div className="text-[11px] space-y-1 text-zinc-300">
                <div className="font-bold text-white">Entrepôt principal</div>
                <div>123, Route de Blagnac</div>
                <div>31700 Blagnac - France</div>
                <div className="text-[10px] text-zinc-400 pt-1">Téléphone : +33 7 81 37 61 64</div>
                <div className="text-[10px] text-zinc-400">Email : contact@maalalcars.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/purchases"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            Enregistrer le brouillon
          </button>
        </div>
      </div>
    </div>
  )
}
