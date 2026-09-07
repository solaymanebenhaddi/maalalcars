'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Printer,
  Sliders,
} from 'lucide-react'

export default function InvoicePreviewPage() {
  const [docType, setDocType] = useState('Facture')
  const [currency, setCurrency] = useState('MAD (DH)')

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

      {/* Main Container matching Reference #30 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Aperçu du modèle de facture
          </h1>
          <p className="text-xs text-zinc-400">
            Paramètres &gt; Factures &gt; Aperçu • Visualisez le rendu final et testez l&apos;impression
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Options d'aperçu */}
          <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>Options d&apos;aperçu</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Type de document
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option>Facture</option>
                    <option>Devis</option>
                    <option>Avoir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Langue
                  </label>
                  <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                    <option>Français</option>
                    <option>Arabe</option>
                    <option>Anglais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Devise
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option>MAD (DH)</option>
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                  </select>
                </div>

                {/* Exemple info */}
                <div className="pt-2 border-t border-[#202028] space-y-2 text-[11px]">
                  <span className="font-bold text-zinc-400 uppercase text-[10px]">Informations exemple</span>
                  <div className="flex justify-between"><span className="text-zinc-500">Client :</span> <span className="font-bold text-white">STE AUTO PRESTIGE</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Date :</span> <span className="font-mono text-zinc-300">21/05/2025</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Échéance :</span> <span className="font-mono text-zinc-300">20/06/2025</span></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-[#202028]">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#282834] bg-[#121216] py-2 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                <Download className="h-3.5 w-3.5 text-zinc-400" />
                <span>Télécharger l&apos;aperçu PDF</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimer un test</span>
              </button>
            </div>
          </div>

          {/* Right 2 Columns: High-Fidelity Paper Invoice Preview */}
          <div className="lg:col-span-2 rounded-xl border border-[#282834] bg-[#0a0a0d] p-6 shadow-2xl text-zinc-300 space-y-5">
            {/* Invoice Paper Header */}
            <div className="flex items-start justify-between border-b border-[#222228] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest block">MAALAL CARS</span>
                <div className="text-sm font-bold text-white mt-1">MAALAL CARS SARL</div>
                <div className="text-[10px] text-zinc-400 mt-0.5 space-y-0.5">
                  <div>ICE : 001234567890123 • RC : 123456</div>
                  <div>Lot 123, Zone Industrielle Sidi Maarouf, Casablanca</div>
                  <div>Tél : +212 5 22 12 34 56 • contact@maalalcars.ma</div>
                  <div>www.maalalcars.ma</div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-mono font-black text-white text-base uppercase tracking-tight">
                  FACTURE
                </div>
                <div className="font-mono text-zinc-400 text-[10px]">
                  N° : <span className="font-bold text-white">FAC-2025-00046</span>
                </div>
                <div className="font-mono text-zinc-400 text-[10px]">
                  Date : 21/05/2025
                </div>
                <div className="font-mono text-zinc-400 text-[10px]">
                  Échéance : 20/06/2025
                </div>
              </div>
            </div>

            {/* Client Box */}
            <div className="p-3 rounded-lg bg-[#141418] border border-[#202028] max-w-sm ml-auto space-y-1 text-[11px]">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Client</span>
              <div className="font-bold text-white">STE AUTO PRESTIGE</div>
              <div className="text-zinc-400 text-[10px]">ICE : 0012345678901234</div>
              <div className="text-zinc-400 text-[10px]">Adresse : 45, Bd Mohamed V, Casablanca - Maroc</div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#141418] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2 px-3 font-mono">#</th>
                    <th className="py-2 px-3">Désignation</th>
                    <th className="py-2 px-3 text-center font-mono">Qté</th>
                    <th className="py-2 px-3 text-right font-mono">PU HT</th>
                    <th className="py-2 px-3 text-right font-mono">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-mono text-zinc-500">1</td>
                    <td className="py-2 px-3 font-medium text-white">Huile moteur 5W30</td>
                    <td className="py-2 px-3 text-center font-mono text-zinc-300">4</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-300">120.00 DH</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-white">480.00 DH</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-zinc-500">2</td>
                    <td className="py-2 px-3 font-medium text-white">Filtre à huile</td>
                    <td className="py-2 px-3 text-center font-mono text-zinc-300">1</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-300">85.00 DH</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-white">85.00 DH</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-zinc-500">3</td>
                    <td className="py-2 px-3 font-medium text-white">Plaquettes de frein avant</td>
                    <td className="py-2 px-3 text-center font-mono text-zinc-300">1</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-300">450.00 DH</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-white">450.00 DH</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-zinc-500">4</td>
                    <td className="py-2 px-3 font-medium text-white">Main d&apos;œuvre</td>
                    <td className="py-2 px-3 text-center font-mono text-zinc-300">2</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-300">150.00 DH</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-white">300.00 DH</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Box */}
            <div className="max-w-xs ml-auto space-y-1.5 text-[11px] pt-1">
              <div className="flex justify-between py-1 border-b border-[#1e1e24]">
                <span className="text-zinc-400">Sous-total HT</span>
                <span className="font-mono font-bold text-white">1 315.00 DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1e1e24]">
                <span className="text-zinc-400">TVA (20%)</span>
                <span className="font-mono font-bold text-white">263.00 DH</span>
              </div>
              <div className="flex justify-between py-1.5 bg-[#141418] px-2 rounded-lg border border-[#24242e]">
                <span className="font-bold text-white">Total TTC</span>
                <span className="font-mono font-black text-emerald-400 text-sm">1 578.00 DH</span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#222228] pt-3 text-[9px] text-zinc-500 text-center space-y-0.5">
              <div>Merci pour votre confiance. Toute réclamation doit être faite dans un délai de 7 jours.</div>
              <div>Les marchandises restent notre propriété jusqu&apos;au paiement intégral.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
