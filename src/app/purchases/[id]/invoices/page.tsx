'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Printer,
  Building,
  CheckCircle2,
  FileText,
} from 'lucide-react'

interface InvoiceLine {
  id: number
  product: string
  reference: string
  quantity: number
  unitPriceHT: string
  tva: string
  totalHT: string
}

const INVOICE_LINES: InvoiceLine[] = [
  { id: 1, product: 'Filtre à air', reference: 'BOSCH-1457429190', quantity: 10, unitPriceHT: '12,00 €', tva: '20%', totalHT: '120,00 €' },
  { id: 2, product: 'Balai d\'essuie-glace', reference: 'BOSCH-3397004531', quantity: 15, unitPriceHT: '8,50 €', tva: '20%', totalHT: '127,50 €' },
  { id: 3, product: 'Capteur ABS', reference: 'BOSCH-0265007722', quantity: 5, unitPriceHT: '25,00 €', tva: '20%', totalHT: '125,00 €' },
]

export default function SupplierInvoicePage() {
  const params = useParams()
  const code = (params?.id as string) || 'BC-2505-041'

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

      {/* Main Container matching Reference #23 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Header & Supplier Info */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white font-mono">
                INV-2505-031
              </h1>
              <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Payée
              </span>
            </div>

            <div className="text-[11px] text-zinc-300 space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Building className="h-3.5 w-3.5 text-zinc-400" />
                <span>Bosch Automotive</span>
              </div>
              <div className="text-zinc-400">11 Avenue du Canada, 91940 Les Ulis - France</div>
              <div className="text-zinc-400">Contact: Pierre Martin • +33 1 69 29 73 00</div>
            </div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-[11px] space-y-1 min-w-[220px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Date facture</span>
              <span className="font-mono text-white">23/05/2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Échéance</span>
              <span className="font-mono text-zinc-200">22/06/2025</span>
            </div>
            <div className="flex justify-between border-t border-[#202028] pt-1">
              <span className="text-zinc-400">Mode paiement</span>
              <span className="text-white font-medium">Virement bancaire</span>
            </div>
          </div>
        </div>

        {/* 4 Financial Metric Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Montant (HT)</div>
            <div className="font-mono font-black text-white text-sm sm:text-base mt-1">2 450,00 €</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">TVA (20%)</div>
            <div className="font-mono font-black text-zinc-300 text-sm sm:text-base mt-1">490,00 €</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Montant (TTC)</div>
            <div className="font-mono font-black text-emerald-400 text-sm sm:text-base mt-1">2 940,00 €</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Statut</div>
            <div className="font-bold text-emerald-400 text-sm sm:text-base mt-1">Payée</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
          <button className="font-bold text-white relative pb-1 shrink-0">
            <span>Détails</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Rattachements</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Paiements</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Documents</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Historique</button>
        </div>

        {/* 2 Panels: Lignes de facture + Historique */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Lignes de facture */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-white">Lignes de facture</h3>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Produit</th>
                    <th className="py-2.5 px-3">Référence</th>
                    <th className="py-2.5 px-3 text-center font-mono">Qté</th>
                    <th className="py-2.5 px-3 text-right font-mono">Prix unitaire (HT)</th>
                    <th className="py-2.5 px-3 text-center font-mono">TVA</th>
                    <th className="py-2.5 px-3 text-right font-mono">Total (HT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24]">
                  {INVOICE_LINES.map((l) => (
                    <tr key={l.id} className="hover:bg-[#18181f] transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{l.product}</td>
                      <td className="py-3 px-3 font-mono text-zinc-400">{l.reference}</td>
                      <td className="py-3 px-3 text-center font-mono text-white">{l.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono text-zinc-300">{l.unitPriceHT}</td>
                      <td className="py-3 px-3 text-center font-mono text-zinc-400">{l.tva}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">{l.totalHT}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2 text-[11px] border-t border-[#202028]">
              <span className="text-zinc-400">Total</span>
              <span className="font-mono font-black text-white text-sm">2 450,00 €</span>
            </div>
          </div>

          {/* Right 1 Col: Historique timeline */}
          <div className="space-y-4">
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Historique
              </h3>

              <div className="space-y-3 text-[11px]">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-zinc-500">25/05/2025</div>
                    <div className="font-bold text-white">Paiement enregistré</div>
                    <div className="text-[10px] text-zinc-400">Virement bancaire - 2 940,00 €</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-zinc-500">23/05/2025</div>
                    <div className="font-bold text-white">Facture validée</div>
                    <div className="text-[10px] text-zinc-400">Par Adrien Maalal</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/10 text-cyan-400 shrink-0">
                    <FileText className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-zinc-500">22/05/2025</div>
                    <div className="font-bold text-white">Facture reçue</div>
                    <div className="text-[10px] text-zinc-400">Par Yassine Benali</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/10 text-blue-400 shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-zinc-500">22/05/2025</div>
                    <div className="font-bold text-white">Réception complète</div>
                    <div className="text-[10px] text-zinc-400">BC-2505-037</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-zinc-400 shrink-0">
                    <FileText className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-zinc-500">20/05/2025</div>
                    <div className="font-bold text-white">Commande créée</div>
                    <div className="text-[10px] text-zinc-400">BC-2505-037</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#202028]">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Télécharger la facture</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <Printer className="h-3.5 w-3.5" />
            <span>Imprimer la facture</span>
          </button>
        </div>
      </div>
    </div>
  )
}
