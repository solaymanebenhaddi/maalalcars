'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Building,
} from 'lucide-react'

interface ReceptionItem {
  id: number
  name: string
  reference: string
  ordered: number
  received: number
  conforming: number
  isConforming: boolean
}

const INITIAL_RECEPTION_ITEMS: ReceptionItem[] = [
  { id: 1, name: 'Alternateur 120A', reference: 'DAN1120A', ordered: 4, received: 4, conforming: 4, isConforming: true },
  { id: 2, name: 'Bougies Iridium', reference: 'DKBX46EIX', ordered: 20, received: 10, conforming: 10, isConforming: true },
  { id: 3, name: 'Filtre à huile', reference: 'DOF045', ordered: 10, received: 10, conforming: 10, isConforming: true },
  { id: 4, name: 'Plaquettes de frein AV', reference: 'DPF1144', ordered: 8, received: 8, conforming: 8, isConforming: true },
]

export default function PurchaseReceptionPage() {
  const params = useParams()
  const code = (params?.id as string) || 'BC-2505-041'
  const [items, setItems] = useState<ReceptionItem[]>(INITIAL_RECEPTION_ITEMS)

  const toggleConformity = (id: number) => {
    setItems(
      items.map((it) => (it.id === id ? { ...it, isConforming: !it.isConforming } : it))
    )
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/purchases/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour {code}</span>
        </Link>
      </div>

      {/* Main Container matching Reference #23 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3 space-y-1">
          <h1 className="text-base sm:text-lg font-black text-white">
            Réceptionner la commande {code}
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <Building className="h-3 w-3" />
            <span>Denso France</span>
          </div>
        </div>

        {/* 4 Info Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Commande</div>
            <div className="font-mono font-bold text-white text-xs mt-1">{code}</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Date commande</div>
            <div className="font-mono font-bold text-zinc-200 text-xs mt-1">26/05/2025</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Livraison prévue</div>
            <div className="font-mono font-bold text-zinc-200 text-xs mt-1">02/06/2025</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Statut commande</div>
            <div className="font-bold text-emerald-400 text-xs mt-1">Confirmé</div>
          </div>
        </div>

        {/* Reception Table */}
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Produit</th>
                  <th className="py-2.5 px-3">Référence</th>
                  <th className="py-2.5 px-3 text-center font-mono">Commandé</th>
                  <th className="py-2.5 px-3 text-center font-mono">Reçu</th>
                  <th className="py-2.5 px-3 text-center font-mono">Conforme</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{it.name}</td>
                    <td className="py-3 px-3 font-mono text-zinc-400">{it.reference}</td>
                    <td className="py-3 px-3 text-center font-mono text-zinc-300">{it.ordered}</td>
                    <td className="py-3 px-3 text-center font-mono text-white font-bold">{it.received}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">{it.conforming}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleConformity(it.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          it.isConforming ? 'bg-emerald-600' : 'bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            it.isConforming ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
            Commentaires
          </label>
          <textarea
            rows={2}
            defaultValue="Livraison partielle. Le reste prévu le 03/06/2025."
            className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#202028]">
          <Link
            href={`/purchases/${code}`}
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Valider la réception</span>
          </button>
        </div>
      </div>
    </div>
  )
}
