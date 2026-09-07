import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Share2,
  Download,
  Printer,
  ChevronDown,
} from 'lucide-react'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface EventItem {
  date: string
  author: string
  action: string
}

const DEFAULT_EVENTS: EventItem[] = [
  { date: '30/05/2025, 14:30', author: 'Admin Maalal', action: 'Facture envoyée par email (À : imane.zahiri@email.com)' },
  { date: '30/05/2025, 14:42', author: 'Système', action: 'Email ouvert par le client' },
  { date: '30/05/2025, 14:45', author: 'Imane Zahiri', action: 'Facture téléchargée' },
  { date: '05/06/2025, 09:00', author: 'Système', action: 'Rappel automatique envoyé' },
  { date: '08/06/2025, 11:20', author: 'Admin Maalal', action: 'Paiement reçu (87 036,00 DH par virement bancaire)' },
  { date: '08/06/2025, 11:22', author: 'Système', action: 'Confirmation envoyée' },
]

export default async function InvoiceHistoryPage({ params }: Props) {
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
  }) || await prisma.invoice.findFirst()

  if (!invoice) {
    notFound()
  }

  const code = invoice.code || 'FAC-2025-0048'

  let events: EventItem[] = DEFAULT_EVENTS
  if (invoice.history) {
    try {
      events = JSON.parse(invoice.history)
    } catch {
      events = DEFAULT_EVENTS
    }
  }

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

      {/* Main Container */}
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

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <Link
            href={`/invoices/${code}/preview`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Aperçu
          </Link>
          <Link
            href={`/invoices/${code}`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Détails
          </Link>
          <button className="text-zinc-400 hover:text-white font-semibold">Paiements</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Documents</button>
          <button className="font-bold text-white relative pb-1">
            <span>Historique</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
        </div>

        {/* Top 4 Action Cards matching Reference #13 Screen 5 */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            Envoyer la facture
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 text-center hover:border-cyan-500/40 transition-colors space-y-2">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Mail className="h-4 w-4" />
              </div>
              <div className="font-bold text-white text-xs">Envoyer par email</div>
            </button>

            <button className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 text-center hover:border-zinc-500/40 transition-colors space-y-2">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                <Share2 className="h-4 w-4" />
              </div>
              <div className="font-bold text-white text-xs">Partager le lien</div>
            </button>

            <Link
              href={`/invoices/${code}/preview`}
              className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 text-center hover:border-zinc-500/40 transition-colors space-y-2 block"
            >
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                <Download className="h-4 w-4" />
              </div>
              <div className="font-bold text-white text-xs">Télécharger PDF</div>
            </Link>

            <Link
              href={`/invoices/${code}/preview`}
              className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 text-center hover:border-zinc-500/40 transition-colors space-y-2 block"
            >
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                <Printer className="h-4 w-4" />
              </div>
              <div className="font-bold text-white text-xs">Imprimer</div>
            </Link>
          </div>
        </div>

        {/* Bottom Historique des envois matching Reference #13 Screen 5 */}
        <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3 pt-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Historique des envois & événements
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-700">
            {events.map((ev, idx) => (
              <div key={idx} className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-white">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white">{ev.action}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 font-mono text-[10px]">
                    <span>{ev.date}</span>
                    <span className="text-zinc-300 font-semibold">{ev.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
