import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Mail,
  FileText,
  CalendarPlus,
  Send,
  Plus,
  Download,
  Check,
} from 'lucide-react'
import { Currency } from '@/components/shared/currency'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params

  const lead = await prisma.lead.findFirst({
    where: {
      OR: [
        { id },
        { code: id },
        { code: id.toUpperCase() },
        { code: { contains: id } },
      ],
    },
    include: {
      campaign: true,
      assignedTo: true,
      convertedContact: true,
    },
  }) || await prisma.lead.findFirst({
    include: {
      campaign: true,
      assignedTo: true,
      convertedContact: true,
    },
  })

  if (!lead) {
    notFound()
  }

  const tagsArray = lead.tags ? JSON.parse(lead.tags) : ['SUV', 'Noir', 'Diesel']

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/leads"
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux leads</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/leads/new"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nouveau lead</span>
          </Link>
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500">
            <span>Modifier</span>
          </button>
        </div>
      </div>

      {/* Main Header Banner matching Screen 3 */}
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600/30 to-[#1e1e26] border border-red-500/40 text-lg font-black text-white shadow-lg">
            {lead.firstName[0]}
            {lead.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black text-white tracking-tight">
                {lead.firstName} {lead.lastName}
              </h1>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                {lead.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Lead depuis le {new Date(lead.createdAt).toLocaleDateString('fr-MA')} • <span className="font-mono text-zinc-300">{lead.code}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Appeler</span>
          </a>
          <a
            href={`mailto:${lead.email || ''}`}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Email</span>
          </a>
        </div>
      </div>

      {/* Tabs matching Screen 3 */}
      <div className="border-b border-[#222228] flex gap-6 text-xs font-semibold">
        <button className="border-b-2 border-red-500 pb-3 text-white">Résumé</button>
        <button className="pb-3 text-zinc-400 hover:text-zinc-200">Activités</button>
        <button className="pb-3 text-zinc-400 hover:text-zinc-200">Communications</button>
        <button className="pb-3 text-zinc-400 hover:text-zinc-200">Documents</button>
        <button className="pb-3 text-zinc-400 hover:text-zinc-200">Historique</button>
      </div>

      {/* 3-Column Layout matching Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
        {/* Col 1: Informations (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-[#222228] pb-2">
            Informations
          </h3>

          <div className="space-y-3.5">
            <div>
              <span className="text-zinc-400 text-[11px] block">Téléphone</span>
              <a href={`tel:${lead.phone}`} className="font-mono font-bold text-white hover:text-cyan-400">
                {lead.phone}
              </a>
            </div>

            <div>
              <span className="text-zinc-400 text-[11px] block">Email</span>
              <span className="font-medium text-white">{lead.email || '—'}</span>
            </div>

            <div>
              <span className="text-zinc-400 text-[11px] block">Source</span>
              <span className="font-medium text-zinc-200">{lead.source}</span>
            </div>

            <div>
              <span className="text-zinc-400 text-[11px] block">Campagne</span>
              <span className="font-medium text-zinc-200">{lead.campaign?.name || '—'}</span>
            </div>

            <div>
              <span className="text-zinc-400 text-[11px] block">Intérêt</span>
              <span className="font-semibold text-white">{lead.interestType || 'Achat véhicule'}</span>
            </div>

            <div>
              <span className="text-zinc-400 text-[11px] block">Budget estimé</span>
              <span className="font-mono font-black text-cyan-400 text-sm block mt-0.5">
                <Currency amount={lead.estimatedBudget || 0} />
              </span>
            </div>

            <div>
              <span className="text-zinc-400 text-[11px] block">Assigné à</span>
              <span className="font-medium text-zinc-200">{lead.assignedTo?.name || 'Yassine Benali'}</span>
            </div>

            <div>
              <span className="text-zinc-400 text-[11px] block mb-1">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {tagsArray.map((t: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Statut & Pipeline + Activité récente (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Statut & Pipeline Box */}
          <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-[#222228] pb-2">
              Statut & Pipeline
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-xs">Étape actuelle :</span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                  {lead.status}
                </span>
              </div>

              <div className="rounded-xl border border-[#262630] bg-[#16161c] p-3 space-y-1">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Prochaine action
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Appel de qualification</span>
                  <span className="text-[11px] text-cyan-400 font-mono">19/01/2025 à 10:50</span>
                </div>
              </div>

              <button className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-red-600 transition-all flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                <span>Marquer comme terminé</span>
              </button>
            </div>
          </div>

          {/* Activité Récente (Timeline) */}
          <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-[#222228] pb-2">
              Activité récente
            </h3>

            <div className="space-y-4 border-l-2 border-[#262632] ml-2 pl-4">
              {/* Event 1 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[23px] top-0.5 h-3 w-3 rounded-full bg-cyan-500 ring-4 ring-[#121216]" />
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white">Appel effectué</span>
                  <span className="text-[10px] text-zinc-500 font-mono">17/01/2025 14:32</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Contact téléphonique établi, prospect intéressé par un SUV Diesel. Yassine Benali
                </p>
              </div>

              {/* Event 2 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[23px] top-0.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-[#121216]" />
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white">Email envoyé</span>
                  <span className="text-[10px] text-zinc-500 font-mono">16/01/2025 11:15</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Brochure détaillée et fiche technique transmises par email. Yassine Benali
                </p>
              </div>

              {/* Event 3 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[23px] top-0.5 h-3 w-3 rounded-full bg-red-500 ring-4 ring-[#121216]" />
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white">Lead créé</span>
                  <span className="text-[10px] text-zinc-500 font-mono">15/01/2025 18:04</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Formulaire entrant depuis le site web officiel. Système
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Notes & Actions rapides (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Notes */}
          <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-[#222228] pb-2">
              Notes
            </h3>
            <p className="text-zinc-300 text-xs leading-relaxed bg-[#16161c] p-3 rounded-xl border border-[#262630]">
              {lead.notes || 'Client très réactif, souhaite programmer un essai ce samedi.'}
            </p>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-[#222228] pb-2">
              Documents
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-[#262630] bg-[#16161c] p-2.5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  <div>
                    <span className="font-bold text-white block text-[11px]">Brochure_SUV.pdf</span>
                    <span className="text-[10px] text-zinc-500">PDF • 2.4 MB</span>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-white">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#262630] bg-[#16161c] p-2.5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <div>
                    <span className="font-bold text-white block text-[11px]">Tarifs_MAJ_2025.pdf</span>
                    <span className="text-[10px] text-zinc-500">PDF • 1.1 MB</span>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-white">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-[#222228] pb-2">
              Actions rapides
            </h3>
            <div className="space-y-2">
              <Link
                href="/appointments"
                className="flex items-center gap-2 w-full rounded-lg border border-[#282834] bg-[#16161c] p-2.5 font-semibold text-zinc-300 hover:text-white hover:border-zinc-500"
              >
                <CalendarPlus className="h-4 w-4 text-cyan-400" />
                <span>Planifier un RDV</span>
              </Link>

              <button className="flex items-center gap-2 w-full rounded-lg border border-[#282834] bg-[#16161c] p-2.5 font-semibold text-zinc-300 hover:text-white hover:border-zinc-500">
                <Send className="h-4 w-4 text-amber-400" />
                <span>Envoyer un email</span>
              </button>

              <Link
                href="/sales/new"
                className="flex items-center gap-2 w-full rounded-lg border border-[#282834] bg-[#16161c] p-2.5 font-semibold text-zinc-300 hover:text-white hover:border-zinc-500"
              >
                <FileText className="h-4 w-4 text-green-400" />
                <span>Créer une proposition</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
