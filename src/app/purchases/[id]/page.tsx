'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Printer,
  Copy,
  Building,
} from 'lucide-react'

interface OrderedProduct {
  id: number
  name: string
  reference: string
  quantity: number
  unitPriceHT: string
  discount: string
  totalHT: string
}

const PRODUCTS: OrderedProduct[] = [
  { id: 1, name: 'Alternateur 120A', reference: 'DAN1120A', quantity: 4, unitPriceHT: '180,00 €', discount: '5%', totalHT: '684,00 €' },
  { id: 2, name: 'Bougies Iridium', reference: 'DKBX46EIX', quantity: 20, unitPriceHT: '9,50 €', discount: '0%', totalHT: '190,00 €' },
  { id: 3, name: 'Filtre à huile', reference: 'DOF045', quantity: 10, unitPriceHT: '4,20 €', discount: '0%', totalHT: '42,00 €' },
  { id: 4, name: 'Plaquettes de frein AV', reference: 'DPF1144', quantity: 8, unitPriceHT: '22,00 €', discount: '0%', totalHT: '176,00 €' },
]

export default function PurchaseDetailPage() {
  const params = useParams()
  const code = (params?.id as string) || 'BC-2505-041'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/purchases"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux achats</span>
        </Link>
      </div>

      {/* Main Container matching Reference #23 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Header & Supplier Info */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white font-mono">
                {code}
              </h1>
              <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Confirmé
              </span>
            </div>

            <div className="text-[11px] text-zinc-300 space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Building className="h-3.5 w-3.5 text-zinc-400" />
                <span>Denso France</span>
              </div>
              <div className="text-zinc-400">8 Rue des Vanotiers, 95500 Gonesse - France</div>
              <div className="text-zinc-400">Contact: Jean Dupont • +33 1 39 87 65 43</div>
            </div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-[11px] space-y-1 min-w-[220px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Date commande</span>
              <span className="font-mono text-white">26/05/2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Livraison prévue</span>
              <span className="font-mono text-zinc-200">02/06/2025</span>
            </div>
            <div className="flex justify-between border-t border-[#202028] pt-1">
              <span className="text-zinc-400">Créé par</span>
              <span className="text-white font-medium">Yassine Benali</span>
            </div>
          </div>
        </div>

        {/* 4 Top Metric Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Montant (HT)</div>
            <div className="font-mono font-black text-white text-sm sm:text-base mt-1">12 320,00 €</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">TVA (20%)</div>
            <div className="font-mono font-black text-zinc-300 text-sm sm:text-base mt-1">2 464,00 €</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Montant (TTC)</div>
            <div className="font-mono font-black text-red-500 text-sm sm:text-base mt-1">14 784,00 €</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Statut</div>
            <div className="font-bold text-emerald-400 text-sm sm:text-base mt-1">Confirmé</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
          <button className="font-bold text-white relative pb-1 shrink-0">
            <span>Détails</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Produits</button>
          <Link href={`/purchases/${code}/reception`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Réceptions
          </Link>
          <Link href={`/purchases/${code}/invoices`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Factures
          </Link>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Documents</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Historique</button>
        </div>

        {/* Ordered Products Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white">Produits commandés</h3>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Produit</th>
                  <th className="py-2.5 px-3">Référence</th>
                  <th className="py-2.5 px-3 text-center font-mono">Qté</th>
                  <th className="py-2.5 px-3 text-right font-mono">Prix unitaire (HT)</th>
                  <th className="py-2.5 px-3 text-center font-mono">Remise</th>
                  <th className="py-2.5 px-3 text-right font-mono">Total (HT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {PRODUCTS.map((p) => (
                  <tr key={p.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{p.name}</td>
                    <td className="py-3 px-3 font-mono text-zinc-400">{p.reference}</td>
                    <td className="py-3 px-3 text-center font-mono text-white">{p.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-300">{p.unitPriceHT}</td>
                    <td className="py-3 px-3 text-center font-mono text-zinc-400">{p.discount}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">{p.totalHT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <div className="text-right text-[11px]">
              <span className="text-zinc-400 mr-3">Total produits (HT) :</span>
              <span className="font-mono font-bold text-white">12 320,00 €</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#202028]">
          <Link
            href="/purchases"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Retour
          </Link>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white">
              <Printer className="h-3.5 w-3.5 text-zinc-400" />
              <span>Imprimer le BC</span>
            </button>

            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
              <Copy className="h-3.5 w-3.5" />
              <span>Dupliquer la commande</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
