'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit2,
  Download,
  Filter,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PurchaseOrder {
  id: number
  reference: string
  date: string
  status: 'Confirmée' | 'En cours' | 'Livrée' | 'Annulée' | 'Payée'
  amountHT: string
  tva: string
  amountTTC: string
  expectedDelivery: string
}

const ORDERS: PurchaseOrder[] = [
  { id: 1, reference: 'CMD-2025-0056', date: '29/05/2025', status: 'Confirmée', amountHT: '8 250,00 €', tva: '1 650,00 €', amountTTC: '9 900,00 €', expectedDelivery: '04/06/2025' },
  { id: 2, reference: 'CMD-2025-0052', date: '20/05/2025', status: 'Payée', amountHT: '12 450,00 €', tva: '2 490,00 €', amountTTC: '14 940,00 €', expectedDelivery: '25/05/2025' },
  { id: 3, reference: 'CMD-2025-0048', date: '12/05/2025', status: 'En cours', amountHT: '5 780,00 €', tva: '1 156,00 €', amountTTC: '6 936,00 €', expectedDelivery: '16/05/2025' },
  { id: 4, reference: 'CMD-2025-0041', date: '05/05/2025', status: 'Payée', amountHT: '16 200,00 €', tva: '3 240,00 €', amountTTC: '19 440,00 €', expectedDelivery: '07/05/2025' },
  { id: 5, reference: 'CMD-2025-0037', date: '28/04/2025', status: 'Annulée', amountHT: '3 150,00 €', tva: '630,00 €', amountTTC: '3 780,00 €', expectedDelivery: '-' },
  { id: 6, reference: 'CMD-2025-0031', date: '18/04/2025', status: 'Livrée', amountHT: '9 850,00 €', tva: '1 970,00 €', amountTTC: '11 820,00 €', expectedDelivery: '21/04/2025' },
  { id: 7, reference: 'CMD-2025-0025', date: '18/04/2025', status: 'Payée', amountHT: '7 320,00 €', tva: '1 464,00 €', amountTTC: '8 784,00 €', expectedDelivery: '21/04/2025' },
  { id: 8, reference: 'CMD-2025-0020', date: '10/04/2025', status: 'Livrée', amountHT: '11 450,00 €', tva: '2 290,00 €', amountTTC: '13 740,00 €', expectedDelivery: '01/04/2025' },
  { id: 9, reference: 'CMD-2025-0015', date: '25/04/2025', status: 'Confirmée', amountHT: '4 120,00 €', tva: '824,00 €', amountTTC: '4 944,00 €', expectedDelivery: '27/03/2025' },
  { id: 10, reference: 'CMD-2025-0009', date: '15/03/2025', status: 'Payée', amountHT: '6 880,00 €', tva: '1 376,00 €', amountTTC: '8 256,00 €', expectedDelivery: '17/03/2025' },
]

export default function SupplierPurchasesPage() {
  const params = useParams()
  const code = (params?.id as string) || 'SUP-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/suppliers/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour Bosch Automotive</span>
        </Link>
      </div>

      {/* Main Container matching Reference #19 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Achats du fournisseur / Historique
          </h1>
          <p className="text-xs text-zinc-400">
            Commandes, livraisons et factures pour Bosch Automotive
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Commandes (24)</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Réceptions</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Factures</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Retours</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Paiements</button>
        </div>

        {/* 5 KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>Commandes</span>
              <ShoppingBag className="h-3 w-3 text-cyan-400" />
            </div>
            <div className="font-mono font-black text-white text-base">24</div>
            <div className="text-[9px] text-zinc-500">Ce mois : 3</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>Total commandes</span>
              <CreditCard className="h-3 w-3 text-cyan-400" />
            </div>
            <div className="font-mono font-black text-white text-sm sm:text-base">198 450 €</div>
            <div className="text-[9px] text-zinc-500">Ce mois : 28 450 €</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>Réceptions</span>
              <Truck className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="font-mono font-black text-white text-base">22</div>
            <div className="text-[9px] text-zinc-500">Ce mois : 2</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>Factures payées</span>
              <CheckCircle className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="font-mono font-black text-cyan-400 text-sm sm:text-base">186 000 €</div>
            <div className="text-[9px] text-zinc-500">Ce mois : 24 700 €</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>Montants dus</span>
              <AlertCircle className="h-3 w-3 text-red-400" />
            </div>
            <div className="font-mono font-black text-red-400 text-sm sm:text-base">12 450 €</div>
            <div className="text-[9px] text-zinc-500">Ce mois : 3 750 €</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Période: 01/01/2025 - 31/05/2025</option>
              <option>Ce mois</option>
              <option>Cette année</option>
            </select>

            <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Statut: Tous</option>
              <option>Confirmée</option>
              <option>Payée</option>
              <option>En cours</option>
              <option>Livrée</option>
              <option>Annulée</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <span>Filtrer</span>
            </button>
            <button className="flex items-center gap-1 h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* 10-row Orders Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3 font-mono">Date commande</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant HT</th>
                <th className="py-2.5 px-3 text-right font-mono">TVA</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant TTC</th>
                <th className="py-2.5 px-3 font-mono">Réception prévue</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white">{o.reference}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{o.date}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        o.status === 'Payée' || o.status === 'Confirmée'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : o.status === 'En cours'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : o.status === 'Livrée'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-300">{o.amountHT}</td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-400">{o.tva}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">{o.amountTTC}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{o.expectedDelivery}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Voir">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Modifier">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 10 sur 24 commandes</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ‹
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
              1
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              2
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              3
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
