import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  DollarSign,
  Layers,
  FileCheck,
  ExternalLink,
} from 'lucide-react'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params

  const invoice = await prisma.invoice.findFirst({
    where: {
      OR: [
        { id },
        { code: id },
        { code: id.toUpperCase() },
        { code: { contains: id } },
      ],
    },
    include: {
      contact: true,
      sale: {
        include: {
          vehicle: true,
        },
      },
      lines: true,
      payments: true,
    },
  }) || await prisma.invoice.findFirst({
    include: {
      contact: true,
      sale: {
        include: {
          vehicle: true,
        },
      },
      lines: true,
      payments: true,
    },
  })

  if (!invoice) {
    notFound()
  }

  const code = invoice.code || 'N/A'
  const clientName =
    invoice.clientName ||
    invoice.contact?.companyName ||
    (invoice.contact?.firstName ? `${invoice.contact.firstName} ${invoice.contact.lastName || ''}`.trim() : 'Client non renseigné')
  const vehicleName =
    invoice.vehicleName ||
    (invoice.sale?.vehicle ? `${invoice.sale.vehicle.brand} ${invoice.sale.vehicle.model}` : 'Véhicule non renseigné')
  const saleCode = invoice.saleCode || (invoice.sale?.code ? invoice.sale.code : 'N/A')
  const subtotalHT = invoice.subtotalHT || 0
  const taxAmount = invoice.taxAmount || 0
  const totalTTC = invoice.totalTTC || 0
  const paidAmount = invoice.paidAmount || 0
  const balanceDue = totalTTC - paidAmount
  const paymentMethod = invoice.paymentMethod || 'Non renseigné'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
        </div>

        <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
          <span>Actions</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </button>
      </div>

      {/* Main Invoice Card */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Banner */}
        <div className="flex items-center justify-between border-b border-[#222228] pb-3">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
              Facture {code}
            </h1>
            <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              Payée
            </span>
          </div>
        </div>

        {/* Tabs matching Reference #13 Screen 4 */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <Link
            href={`/invoices/${code}/preview`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Aperçu
          </Link>
          <button className="font-bold text-white relative pb-1">
            <span>Détails</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Paiements</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Documents</button>
          <Link
            href={`/invoices/${code}/history`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Historique
          </Link>
        </div>

        {/* Top 2 Panels: Informations facture & Montants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Panel 1: Informations facture */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>Informations facture</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Client</span>
                <span className="font-bold text-white">{clientName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Vente</span>
                <span className="font-mono text-zinc-200">{saleCode}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Véhicule</span>
                <span className="font-semibold text-zinc-200">{vehicleName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Date facture</span>
                <span className="font-mono text-zinc-200">30/05/2025</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Échéance</span>
                <span className="font-mono text-zinc-200">27/06/2025</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Mode de paiement</span>
                <span className="text-zinc-200">{paymentMethod}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Statut</span>
                <span className="font-bold text-emerald-400">Payée</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Montants */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
              <span>Montants</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Sous-total HT</span>
                <span className="font-mono font-bold text-white">
                  {subtotalHT.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">TVA (20%)</span>
                <span className="font-mono font-bold text-white">
                  {taxAmount.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#202028] text-sm">
                <span className="font-bold text-white">Total TTC</span>
                <span className="font-mono font-black text-white">
                  {totalTTC.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Montant payé</span>
                <span className="font-mono font-bold text-emerald-400">
                  {paidAmount.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                </span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="font-bold text-red-400">Reste à payer</span>
                <span className="font-mono font-bold text-emerald-400">
                  {balanceDue.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 2 Panels: Articles & Documents liés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Panel 3: Articles (2 cols) */}
          <div className="md:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-zinc-400" />
              <span>Articles</span>
            </h3>

            <div className="overflow-x-auto rounded border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#222228] bg-[#121216] text-[10px] text-zinc-400">
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-2 text-center">Qté</th>
                    <th className="py-2 px-3 text-right">PU HT</th>
                    <th className="py-2 px-2 text-center">TVA</th>
                    <th className="py-2 px-3 text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {invoice.lines && invoice.lines.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    invoice.lines.map((line: any, idx: number) => (
                      <tr key={idx} className="border-b border-[#1e1e24]">
                        <td className="py-2.5 px-3 font-semibold text-white">{line.description}</td>
                        <td className="py-2.5 px-2 text-center font-mono">{line.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{line.unitPriceHT?.toLocaleString('fr-MA')} DH</td>
                        <td className="py-2.5 px-2 text-center font-mono text-zinc-400">{line.taxRate}%</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                          {((line.quantity || 1) * (line.unitPriceHT || 0) * (1 + (line.taxRate || 20) / 100)).toLocaleString('fr-MA')} DH
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="py-6 text-center text-xs text-zinc-500">Aucun article sur cette facture.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-right text-xs font-mono font-black text-white pt-1">
              {subtotalHT.toLocaleString('fr-MA')} DH HT
            </div>
          </div>

          {/* Panel 4: Documents liés (1 col) */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5 text-zinc-400" />
              <span>Documents liés</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-[#202028] bg-[#121216] p-2.5 hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-zinc-400" />
                  <div>
                    <div className="font-semibold text-white">Bon de commande</div>
                    <div className="text-[10px] text-zinc-500 font-mono">BDC-2025-0024</div>
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#202028] bg-[#121216] p-2.5 hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-zinc-400" />
                  <div>
                    <div className="font-semibold text-white">Contrat de vente</div>
                    <div className="text-[10px] text-zinc-500 font-mono">CTR-2025-0024</div>
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#202028] bg-[#121216] p-2.5 hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-zinc-400" />
                  <div>
                    <div className="font-semibold text-white">Certificat d&apos;immatriculation</div>
                    <div className="text-[10px] text-zinc-500 font-mono">CI-2025-0024</div>
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
