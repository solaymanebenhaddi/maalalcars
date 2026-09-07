'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

const PARTS = [
  { ref: 'HU 816 z', name: 'Filtre à huile', qty: 1, puHT: 12.50, discount: 0, totalHT: 12.50 },
  { ref: 'LX 1987', name: 'Filtre à air', qty: 1, puHT: 18.90, discount: 0, totalHT: 18.90 },
  { ref: '5W30 LL', name: 'Huile moteur 5W30 (5L)', qty: 5, puHT: 14.80, discount: 5, totalHT: 70.30 },
  { ref: 'CUK 2939', name: 'Filtre habitacle', qty: 1, puHT: 16.50, discount: 0, totalHT: 16.50 },
]

const LABOR = [
  { name: 'Yassine Benali', rate: 50.00, hours: '1h45', totalHT: 87.50 },
  { name: 'Mehdi Kacem', rate: 50.00, hours: '0h45', totalHT: 37.50 },
]

export default function WorkshopPartsPage() {
  return (
    <div className="space-y-5 max-w-6xl mx-auto text-xs text-white">
      <PageHeader
        title="Pièces & coûts"
        subtitle="Détail des pièces utilisées et des coûts de l’intervention."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Atelier', href: '/workshop' },
          { label: 'Pièces & coûts' },
        ]}
        actions={
          <Link
            href="/workshop"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour atelier</span>
          </Link>
        }
      />

      {/* Tabs matching Reference #10 Screen 4 */}
      <div className="flex items-center gap-6 border-b border-[#222228] pb-3 text-xs overflow-x-auto">
        <button className="text-zinc-400 hover:text-white">Aperçu</button>
        <button className="font-bold text-white relative pb-1">
          <span>Pièces (4)</span>
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
        </button>
        <button className="text-zinc-400 hover:text-white">Main d’œuvre</button>
        <button className="text-zinc-400 hover:text-white">Coûts</button>
        <button className="text-zinc-400 hover:text-white">Marge</button>
      </div>

      {/* 2-Column Content Layout matching Reference #10 Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Tables Pièces utilisées & Main d'œuvre (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card: Pièces utilisées */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
            <h2 className="text-xs font-bold text-white border-b border-[#222228] pb-2">
              Pièces utilisées
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400">
                    <th className="pb-2">Référence</th>
                    <th className="pb-2">Désignation</th>
                    <th className="pb-2 text-center">Qté</th>
                    <th className="pb-2 text-right">PU HT</th>
                    <th className="pb-2 text-center">Remise</th>
                    <th className="pb-2 text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24]">
                  {PARTS.map((p) => (
                    <tr key={p.ref} className="hover:bg-[#18181f]">
                      <td className="py-2.5 font-mono font-bold text-cyan-400 text-[11px]">{p.ref}</td>
                      <td className="py-2.5 text-zinc-200">{p.name}</td>
                      <td className="py-2.5 text-center font-mono text-zinc-300">{p.qty}</td>
                      <td className="py-2.5 text-right font-mono text-zinc-300">{p.puHT.toFixed(2)} DH</td>
                      <td className="py-2.5 text-center font-mono text-zinc-400">{p.discount}%</td>
                      <td className="py-2.5 text-right font-mono font-bold text-white">{p.totalHT.toFixed(2)} DH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2">
              <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-red-500 transition-all">
                <Plus className="h-3.5 w-3.5" />
                <span>+ Ajouter une pièce</span>
              </button>
            </div>
          </div>

          {/* Card: Main d'œuvre */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
            <h2 className="text-xs font-bold text-white border-b border-[#222228] pb-2">
              Main d’œuvre
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400">
                    <th className="pb-2">Technicien</th>
                    <th className="pb-2 text-center">Taux horaire</th>
                    <th className="pb-2 text-center">Heures</th>
                    <th className="pb-2 text-right">Montant HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24]">
                  {LABOR.map((l) => (
                    <tr key={l.name} className="hover:bg-[#18181f]">
                      <td className="py-2.5 font-medium text-white flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold">
                          {l.name[0]}
                        </div>
                        <span>{l.name}</span>
                      </td>
                      <td className="py-2.5 text-center font-mono text-zinc-300">{l.rate.toFixed(2)} DH</td>
                      <td className="py-2.5 text-center font-mono text-zinc-300">{l.hours}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-white">{l.totalHT.toFixed(2)} DH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#222228]">
              <span className="text-zinc-400 font-medium">Total main d’œuvre HT</span>
              <span className="font-mono font-black text-white text-sm">125,00 DH</span>
            </div>
          </div>
        </div>

        {/* Right Column: Résumé des coûts (4 cols) matching Reference #10 Screen 4 */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <h2 className="text-xs font-bold text-white border-b border-[#222228] pb-2.5">
              Résumé des coûts
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1e1e26]">
                <span className="text-zinc-400">Total pièces HT</span>
                <span className="font-mono text-white font-bold">118,20 DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1e1e26]">
                <span className="text-zinc-400">Main d’œuvre (2h30)</span>
                <span className="font-mono text-white font-bold">121,00 DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1e1e26]">
                <span className="text-zinc-400">Sous-total HT</span>
                <span className="font-mono text-white font-bold">243,20 DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1e1e26]">
                <span className="text-zinc-400">TVA (20%)</span>
                <span className="font-mono text-zinc-300">48,64 DH</span>
              </div>
              <div className="flex justify-between py-2 border-t border-[#282834]">
                <span className="font-bold text-white text-sm">Total TTC</span>
                <span className="font-mono font-black text-cyan-400 text-lg">291,84 DH</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400 text-[11px]">Marge estimée :</span>
              <span className="font-mono font-bold text-emerald-400">58,80 DH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400 text-[11px]">Taux de marge :</span>
              <span className="font-mono font-bold text-emerald-400">20,1 %</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
