import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Download,
  ChevronDown,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface PaymentRecord {
  id: number
  reference: string
  date: string
  method: string
  amount: string
  invoiceRef: string
  collector: string
  status: string
}

const PAYMENTS: PaymentRecord[] = [
  { id: 1, reference: 'PAY-2025-0091', date: '29/05/2025', method: 'Virement bancaire', amount: '25 000 DH', invoiceRef: 'FAC-2025-0487', collector: 'Admin Maalal', status: 'Payé' },
  { id: 2, reference: 'PAY-2025-0082', date: '24/05/2025', method: 'Espèces', amount: '20 000 DH', invoiceRef: 'FAC-2025-0452', collector: 'Nadia K.', status: 'Payé' },
  { id: 3, reference: 'PAY-2025-0075', date: '18/05/2025', method: 'Chèque', amount: '15 000 DH', invoiceRef: 'FAC-2025-0421', collector: 'Admin Maalal', status: 'Payé' },
  { id: 4, reference: 'PAY-2025-0062', date: '12/05/2025', method: 'Virement bancaire', amount: '30 000 DH', invoiceRef: 'FAC-2025-0387', collector: 'Admin Maalal', status: 'Payé' },
  { id: 5, reference: 'PAY-2025-0051', date: '05/05/2025', method: 'Espèces', amount: '10 000 DH', invoiceRef: 'FAC-2025-0356', collector: 'Nadia K.', status: 'Payé' },
  { id: 6, reference: 'PAY-2025-0043', date: '28/04/2025', method: 'Virement bancaire', amount: '25 000 DH', invoiceRef: 'FAC-2025-0321', collector: 'Admin Maalal', status: 'Payé' },
  { id: 7, reference: 'PAY-2025-0032', date: '20/04/2025', method: 'Virement bancaire', amount: '30 000 DH', invoiceRef: 'FAC-2025-0289', collector: 'Admin Maalal', status: 'Payé' },
]

export default async function BuyerPaymentsPage({ params }: Props) {
  const { id } = await params
  const code = id || 'CLT-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/buyers/${code}`}
            className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
        </div>

        <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
          <span>Action rapide</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </button>
      </div>

      {/* Main Container matching Reference #14 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1e1e28] border border-[#2a2a38] text-base font-black text-white font-mono">
              IZ
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                Imane Zahiri
              </h1>
              <span className="text-zinc-400 text-xs">Paiements de l&apos;acheteur</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-1.5 text-center">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Montant payé</div>
              <div className="font-mono font-black text-white text-xs">1 223 600 DH</div>
            </div>
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-1.5 text-center">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Reste à payer</div>
              <div className="font-mono font-black text-red-400 text-xs">24 900 DH</div>
            </div>
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-1.5 text-center">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Paiements</div>
              <div className="font-mono font-black text-white text-xs">12</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <Link
            href={`/buyers/${code}`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Aperçu
          </Link>
          <Link
            href={`/buyers/${code}/transactions`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Transactions
          </Link>
          <button className="font-bold text-white relative pb-1">
            <span>Paiements</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <Link
            href={`/buyers/${code}/history`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Historique
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <select className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
              <option>Tous les modes ⌄</option>
              <option>Virement bancaire</option>
              <option>Espèces</option>
              <option>Chèque</option>
            </select>

            <select className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
              <option>Toutes les dates ⌄</option>
              <option>30 derniers jours</option>
              <option>Mai 2025</option>
            </select>

            <div className="relative flex items-center min-w-[220px]">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Rechercher un paiement..."
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button className="flex h-8 items-center gap-1.5 rounded border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>

        {/* Payments Table matching Reference #14 Screen 5 */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3">Mode de paiement</th>
                <th className="py-2.5 px-3 text-right">Montant (DH)</th>
                <th className="py-2.5 px-3">Facture liée</th>
                <th className="py-2.5 px-3">Collecteur</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {PAYMENTS.map((p) => (
                <tr key={p.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{p.id}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{p.reference}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{p.date}</td>
                  <td className="py-3 px-3 text-zinc-300">{p.method}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {p.amount}
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-400">{p.invoiceRef}</td>
                  <td className="py-3 px-3 text-zinc-300 font-medium">{p.collector}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400">
          <span>12 paiements</span>
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
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
