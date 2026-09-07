'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  FileText,
  Download,
  Send,
  Truck,
  Image as ImageIcon,
  Printer,
  ChevronDown,
} from 'lucide-react'

interface SaleDocument {
  id: number
  type: string
  reference: string
  date: string
  status: string
  statusColor: string
}

const SALE_DOCS: SaleDocument[] = [
  { id: 1, type: 'Bon de commande', reference: 'BC-2025-0062', date: '31/05/2025', status: 'Généré', statusColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  { id: 2, type: 'Facture', reference: 'FAC-2025-0062', date: '05/06/2025', status: 'Payée', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 3, type: 'Bon de livraison', reference: 'BL-2025-0062', date: '05/06/2025', status: 'Livré', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 4, type: 'Certificat de conformité', reference: 'CC-2025-0062', date: '05/06/2025', status: 'Généré', statusColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  { id: 5, type: 'Contrat de vente', reference: 'CON-2025-0062', date: '31/05/2025', status: 'Signé', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
]

export default function SaleDocumentsPage() {
  const params = useParams()
  const code = (params?.id as string) || 'VTE-2025-0062'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/sales/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour {code}</span>
        </Link>
      </div>

      {/* Main Container matching Reference #22 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Sale Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white font-mono">
                {code}
              </h1>
              <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Confirmée
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Créée le 31/05/2025 à 10:15
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Printer className="h-3.5 w-3.5 text-zinc-400" />
              <span>Imprimer</span>
            </button>
            <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <span>Plus</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
          <Link href={`/sales/${code}`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Résumé
          </Link>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Paiement</button>
          <button className="font-bold text-white relative pb-1 shrink-0">
            <span>Documents (5)</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <Link href={`/sales/${code}/workflow`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Workflow &amp; Statut
          </Link>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Historique</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Notes</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Activité</button>
        </div>

        {/* Documents Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white">Documents de la vente</h3>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Référence</th>
                  <th className="py-2.5 px-3 font-mono">Date</th>
                  <th className="py-2.5 px-3 text-center">Statut</th>
                  <th className="py-2.5 px-3 text-center">Télécharger</th>
                  <th className="py-2.5 px-3 text-center">Envoyer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {SALE_DOCS.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span>{doc.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-300">{doc.reference}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{doc.date}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${doc.statusColor}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Télécharger">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Envoyer">
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Livraison Section matching Reference #22 Screen 5 */}
        <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Livraison</h3>
            </div>
            <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Livré
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[11px]">
            <div>
              <span className="text-zinc-400 block text-[10px]">Adresse de livraison</span>
              <span className="font-semibold text-white">12 Rue des Lilas</span>
              <span className="text-zinc-300 block text-[10px]">75001 Paris, France</span>
            </div>

            <div>
              <span className="text-zinc-400 block text-[10px]">Transporteur</span>
              <span className="font-semibold text-white">MAALAL CARS</span>
            </div>

            <div>
              <span className="text-zinc-400 block text-[10px]">Date de livraison</span>
              <span className="font-mono font-bold text-white">05/06/2025 09:30</span>
            </div>

            <div>
              <span className="text-zinc-400 block text-[10px]">Preuve de livraison</span>
              <div className="flex items-center gap-1 mt-0.5 text-cyan-400 hover:text-cyan-300 cursor-pointer">
                <ImageIcon className="h-3.5 w-3.5" />
                <span className="font-mono text-[10px]">photo_livraison.jpg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
