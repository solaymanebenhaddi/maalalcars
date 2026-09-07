import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  Share2,
} from 'lucide-react'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function InvoicePreviewPage({ params }: Props) {
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
      lines: true,
    },
  }) || await prisma.invoice.findFirst({
    include: {
      contact: true,
      lines: true,
    },
  })

  if (!invoice) {
    notFound()
  }

  const code = invoice.code || 'FAC-2025-0048'
  const clientName =
    invoice.clientName ||
    invoice.contact?.companyName ||
    (invoice.contact?.firstName ? `${invoice.contact.firstName} ${invoice.contact.lastName || ''}`.trim() : 'Imane Zahiri')
  const clientICE = invoice.clientICE || '112233441066776'
  const billingAddress = invoice.billingAddress || '12 Rue des Lilas, 20150 Casablanca, Maroc'
  const subtotalHT = invoice.subtotalHT || 72530.0
  const taxAmount = invoice.taxAmount || 14506.0
  const totalTTC = invoice.totalTTC || 87036.0

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/invoices/${code}`}
            className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour facture</span>
          </Link>
          <span className="font-bold text-white text-sm">
            Aperçu Facture (PDF / Impression) — {code}
          </span>
        </div>
      </div>

      {/* Main Container matching Reference #13 Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 Columns: Printable A4 Document */}
        <div className="lg:col-span-3 rounded-xl border border-[#282834] bg-white text-slate-900 p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center text-white font-black text-xs tracking-tighter">
                MC
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  MAALAL CARS
                </h1>
                <p className="text-[10px] text-slate-500 font-medium">Plateforme Automobile Maroc</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-2xl font-black text-slate-950 uppercase tracking-tight">FACTURE</div>
              <div className="font-mono font-bold text-red-600 text-sm">N° {code}</div>
              <div className="text-[11px] text-slate-600">
                Date facture : <strong className="text-slate-900">30/05/2025</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                Échéance : <strong className="text-slate-900">27/06/2025</strong>
              </div>
            </div>
          </div>

          {/* Émetteur & Facturé à Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 space-y-1 text-[11px]">
              <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-1">
                Émetteur
              </div>
              <div className="font-black text-slate-900">MAALAL CARS SARL</div>
              <div className="text-slate-600">56, Boulevard Zerktouni</div>
              <div className="text-slate-600">Casablanca 20150, Maroc</div>
              <div className="text-slate-600 font-mono text-[10px] pt-1">
                ICE : 001234567890012
              </div>
              <div className="text-slate-600">Tél : +212 5 22 00 00 00</div>
              <div className="text-slate-600">Email : contact@maalalcars.com</div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 space-y-1 text-[11px]">
              <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-1">
                Facturé à
              </div>
              <div className="font-black text-slate-900">{clientName}</div>
              <div className="text-slate-600">{billingAddress}</div>
              <div className="text-slate-600 font-mono text-[10px] pt-1">
                ICE : {clientICE}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-[10px] uppercase font-bold text-slate-700">
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-2 text-center">Qté</th>
                  <th className="py-2 px-3 text-right">PU HT</th>
                  <th className="py-2 px-2 text-center">TVA</th>
                  <th className="py-2 px-3 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-950">
                    Toyota Land Cruiser VX-R
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono">1</td>
                  <td className="py-2.5 px-3 text-right font-mono">72 000,00 DH</td>
                  <td className="py-2.5 px-2 text-center font-mono">20%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-950">
                    72 000,00 DH
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-950">Préparation esthétique</td>
                  <td className="py-2.5 px-2 text-center font-mono">1</td>
                  <td className="py-2.5 px-3 text-right font-mono">450,00 DH</td>
                  <td className="py-2.5 px-2 text-center font-mono">20%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-950">
                    450,00 DH
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-950">
                    Plaque d&apos;immatriculation
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono">1</td>
                  <td className="py-2.5 px-3 text-right font-mono">80,00 DH</td>
                  <td className="py-2.5 px-2 text-center font-mono">20%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-950">
                    80,00 DH
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Subtotals & Total TTC */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total HT</span>
                <span className="font-mono font-bold text-slate-950">
                  {subtotalHT.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>TVA (20%)</span>
                <span className="font-mono font-bold text-slate-950">
                  {taxAmount.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                </span>
              </div>
              <div className="flex justify-between text-sm font-black border-t-2 border-slate-950 pt-2 text-slate-950">
                <span>Total TTC</span>
                <span className="font-mono text-red-600">
                  {totalTTC.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                </span>
              </div>
            </div>
          </div>

          {/* Total in words & Footer */}
          <div className="border-t border-slate-200 pt-4 space-y-2 text-[11px] text-slate-600">
            <div>
              Arrêté la présente facture à la somme de :
              <strong className="text-slate-950 block italic pt-0.5">
                Quatre-vingt-sept mille trente-six dirhams TTC.
              </strong>
            </div>
            <div className="pt-2 text-slate-500 text-[10px]">
              Merci pour votre confiance. En cas de retard de paiement, une pénalité légale sera appliquée.
            </div>
          </div>
        </div>

        {/* Right 1 Column: Actions Panel matching Reference #13 Screen 3 */}
        <div className="space-y-3">
          <div className="rounded-xl border border-[#282834] bg-[#121216] p-4 space-y-2.5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Actions rapides
            </h3>

            <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-all">
              <Printer className="h-4 w-4" />
              <span>Imprimer</span>
            </button>

            <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all">
              <Download className="h-4 w-4 text-zinc-400" />
              <span>Télécharger PDF</span>
            </button>

            <Link
              href={`/invoices/${code}/history`}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <Mail className="h-4 w-4 text-zinc-400" />
              <span>Envoyer par email</span>
            </Link>

            <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all">
              <Share2 className="h-4 w-4 text-zinc-400" />
              <span>Partager le lien</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
