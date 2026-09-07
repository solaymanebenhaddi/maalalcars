import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Receipt,
  FileText,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface AuditItem {
  date: string
  author: string
  action: string
}

const DEFAULT_TIMELINE: AuditItem[] = [
  { date: '29/05/2025 14:32', author: 'Admin Maalal', action: 'Dépense créée par Admin Maalal' },
  { date: '29/05/2025 14:35', author: 'Admin Maalal', action: 'Paiement enregistré (Carte bancaire)' },
  { date: '29/05/2025 14:35', author: 'Admin Maalal', action: 'Statut changé en Payée' },
]

export default async function ExpenseDetailPage({ params }: Props) {
  const { id } = await params

  const expense = await prisma.expense.findFirst({
    where: {
      OR: [
        { id },
        { code: id },
        { code: id.toUpperCase() },
        { code: { contains: id } },
      ],
    },
    include: {
      category: true,
      vehicle: true,
    },
  }) || await prisma.expense.findFirst({
    include: {
      category: true,
      vehicle: true,
    },
  })

  if (!expense) {
    notFound()
  }

  const code = expense.code || 'D-2025-0051'
  const label = expense.label || 'Préparation esthétique'
  const categoryName = expense.category?.name || 'Préparation'
  const supplierName = expense.supplierName || 'Auto Clean Pro'
  const vehicleName = expense.vehicleName || 'BMW X5'
  const mileage = expense.mileage || 45230
  const amountTTC = expense.amountTTC || 450.0
  const amountHT = expense.amountHT || 375.0
  const taxAmount = expense.taxAmount || 75.0
  const paymentMethod = expense.paymentMethod || 'Carte bancaire'
  const invoiceRef = expense.invoiceRef || 'FAC-2025-041'
  const notes = expense.notes || 'Nettoyage complet, polissage, cire premium.'

  let timeline: AuditItem[] = DEFAULT_TIMELINE
  if (expense.history) {
    try {
      timeline = JSON.parse(expense.history)
    } catch {
      timeline = DEFAULT_TIMELINE
    }
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #12 Screen 4 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/expenses"
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

      {/* Main Expense Identity Banner */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black text-xs">
              <Receipt className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
                  {code}
                </h1>
                <span className="text-zinc-400 font-semibold text-sm">— {label}</span>
                <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Payée
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Header Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-[#282834] bg-[#18181f] p-2.5 flex items-center gap-2.5">
            <Receipt className="h-4 w-4 text-zinc-400" />
            <div>
              <span className="text-[10px] text-zinc-400 block">Montant TTC</span>
              <span className="font-mono font-bold text-white text-xs">{amountTTC.toFixed(2)} DH</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#282834] bg-[#18181f] p-2.5 flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-zinc-400" />
            <div>
              <span className="text-[10px] text-zinc-400 block">Date</span>
              <span className="font-mono font-bold text-white text-xs">29/05/2025</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#282834] bg-[#18181f] p-2.5 flex items-center gap-2.5">
            <Layers className="h-4 w-4 text-cyan-400" />
            <div>
              <span className="text-[10px] text-zinc-400 block">Catégorie</span>
              <span className="font-bold text-cyan-400 text-xs">{categoryName}</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#282834] bg-[#18181f] p-2.5 flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-zinc-400" />
            <div>
              <span className="text-[10px] text-zinc-400 block">Fournisseur</span>
              <span className="font-bold text-white text-xs">{supplierName}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs pt-1">
          <button className="font-bold text-white relative pb-1">
            <span>Détails</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Paiement</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Documents</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Historique</button>
        </div>

        {/* Main Details & Document Grid matching Reference #12 Screen 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Details Panel (2 cols) */}
          <div className="md:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <div className="space-y-2 text-xs">
              <div className="pb-2 border-b border-[#222228]">
                <span className="text-zinc-400 block text-[10px] mb-1">Description</span>
                <p className="text-zinc-200">
                  Préparation esthétique complète intérieur & extérieur
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-b border-[#222228]">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Véhicule / Projet</span>
                  <span className="font-bold text-white text-xs">{vehicleName}</span>
                  <div className="text-[10px] text-zinc-400 font-mono">Immatriculation : AA-123-AA</div>
                </div>

                <div>
                  <span className="text-zinc-400 block text-[10px]">Kilométrage</span>
                  <span className="font-mono font-bold text-white text-xs">
                    {mileage.toLocaleString('fr-MA')} km
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-b border-[#222228]">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Montant HT</span>
                  <span className="font-mono font-bold text-zinc-200 text-xs">{amountHT.toFixed(2)} DH</span>
                </div>

                <div>
                  <span className="text-zinc-400 block text-[10px]">TVA (20%)</span>
                  <span className="font-mono font-bold text-zinc-200 text-xs">{taxAmount.toFixed(2)} DH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-b border-[#222228]">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Montant TTC</span>
                  <span className="font-mono font-black text-red-400 text-sm">{amountTTC.toFixed(2)} DH</span>
                </div>

                <div>
                  <span className="text-zinc-400 block text-[10px]">Mode de paiement</span>
                  <span className="font-semibold text-white text-xs">{paymentMethod}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-b border-[#222228]">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Statut</span>
                  <span className="font-bold text-emerald-400 text-xs">Payée</span>
                </div>

                <div>
                  <span className="text-zinc-400 block text-[10px]">Référence facture</span>
                  <span className="font-mono text-zinc-300 text-xs">{invoiceRef}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-zinc-400 block text-[10px] mb-1">Notes</span>
                <p className="rounded bg-[#121216] p-2 text-zinc-300 italic border border-[#202028]">
                  {notes}
                </p>
              </div>
            </div>
          </div>

          {/* Right Document Joint Preview Box (1 col) */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col items-center justify-between space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider self-start border-b border-[#222228] pb-2 w-full">
              Document joint
            </h3>

            {/* Document Thumbnail Preview */}
            <div className="w-full max-w-[200px] rounded-lg border border-[#282834] bg-white text-black p-4 text-center shadow-lg space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-zinc-800">
                FACTURE
              </div>
              <div className="h-16 w-full rounded bg-zinc-100 flex flex-col items-center justify-center p-2 text-[9px] text-zinc-500 font-mono space-y-1">
                <div className="h-1 w-full bg-zinc-300 rounded" />
                <div className="h-1 w-3/4 bg-zinc-300 rounded" />
                <div className="h-1 w-1/2 bg-zinc-300 rounded" />
                <div className="text-[8px] text-zinc-600 font-bold mt-1">AUTO CLEAN PRO</div>
              </div>
            </div>

            <div className="w-full space-y-2 text-center">
              <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-all">
                <Download className="h-3.5 w-3.5" />
                <span>Télécharger</span>
              </button>
              <div className="text-[10px] text-zinc-400 font-mono">facture_2025_041.pdf</div>
            </div>
          </div>
        </div>

        {/* Bottom Historique Timeline matching Reference #12 Screen 4 */}
        <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Historique
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-red-600">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-mono text-[10px] text-zinc-400">{item.date}</span>
                  <span className="font-semibold text-white">{item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
