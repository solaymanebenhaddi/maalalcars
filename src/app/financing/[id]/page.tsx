import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Printer,
  Download,
  MoreHorizontal,
  FileText,
  Plus,
  Send,
  RefreshCw,
  XCircle,
  Phone,
  Mail,
} from 'lucide-react'
import { Currency } from '@/components/shared/currency'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

const STEPPER_STAGES = [
  { id: 'SUBMITTED', name: 'Soumis', date: '28/05/2025 10:31', desc: 'Dossier transmis par le conseiller' },
  { id: 'IN_ANALYSIS', name: 'En analyse', date: '31/05/2025 11:42', desc: 'Dossier en cours d’analyse par le partenaire.' },
  { id: 'VERIFICATION', name: 'Vérification', date: '', desc: 'Vérification des pièces justificatives' },
  { id: 'APPROVED', name: 'Approbation', date: '', desc: 'Validation du comité de crédit' },
  { id: 'CONTRACT', name: 'Contrat', date: '', desc: 'Édition et signature du contrat' },
  { id: 'DISBURSED', name: 'Décaissé', date: '', desc: 'Fonds décaissés au concessionnaire' },
]

const STATUS_PILLS: Record<string, { label: string; class: string }> = {
  SUBMITTED: { label: 'Soumis', class: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  IN_ANALYSIS: { label: 'En analyse', class: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  VERIFICATION: { label: 'Vérification', class: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  APPROVED: { label: 'Approbation', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  CONTRACT: { label: 'Contrat', class: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  DISBURSED: { label: 'Décaissé', class: 'bg-lime-500/15 text-lime-400 border-lime-500/30' },
  REJECTED: { label: 'Refusé', class: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

export default async function FinancingDossierDetailPage({ params }: Props) {
  const { id } = await params

  const dossier = await prisma.financingApplication.findFirst({
    where: {
      OR: [
        { id },
        { code: id },
        { code: id.toUpperCase() },
        { code: { contains: id } },
      ],
    },
    include: {
      client: true,
      vehicle: true,
    },
  }) || await prisma.financingApplication.findFirst({
    include: {
      client: true,
      vehicle: true,
    },
  })

  if (!dossier) {
    notFound()
  }

  const clientName = dossier.client ? `${dossier.client.firstName} ${dossier.client.lastName}` : 'Yassine Benali'
  const vehicleName = dossier.vehicleModelName || (dossier.vehicle ? `${dossier.vehicle.brand} ${dossier.vehicle.model}` : 'BMW X3 xDrive20d 2022')
  const statusMeta = STATUS_PILLS[dossier.status] || STATUS_PILLS.IN_ANALYSIS
  const activeStepIdx = STEPPER_STAGES.findIndex((s) => s.id === dossier.status)
  const currentStepIndex = activeStepIdx >= 0 ? activeStepIdx : 1

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header Banner matching Reference #09 Screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/financing"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#282834] bg-[#141418] text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-black font-mono tracking-tight text-white">
              {dossier.code}
            </h1>
            <span className={`rounded px-2.5 py-0.5 text-xs font-bold border ${statusMeta.class}`}>
              {statusMeta.label}
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Printer className="h-3.5 w-3.5 text-zinc-400" />
            <span>Imprimer</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Télécharger</span>
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#282834] bg-[#141418] text-zinc-400 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Layout matching Reference #09 Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Col 1: Informations dossier (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2.5">
            Informations dossier
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-zinc-400 block">Client</span>
              <span className="font-bold text-white text-xs">{clientName}</span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-400 block">Téléphone</span>
              <a
                href={`tel:${dossier.client?.phone || '+212 6 61 23 45 67'}`}
                className="font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Phone className="h-3 w-3" />
                <span>{dossier.client?.phone || '+212 6 61 23 45 67'}</span>
              </a>
            </div>

            <div>
              <span className="text-[11px] text-zinc-400 block">Email</span>
              <a
                href={`mailto:${dossier.client?.email || 'yassine.benali@gmail.com'}`}
                className="text-zinc-300 hover:underline flex items-center gap-1"
              >
                <Mail className="h-3 w-3 text-zinc-500" />
                <span>{dossier.client?.email || 'yassine.benali@gmail.com'}</span>
              </a>
            </div>

            <div className="pt-2 border-t border-[#1e1e26]">
              <span className="text-[11px] text-zinc-400 block">Véhicule</span>
              <span className="font-bold text-white text-xs">{vehicleName}</span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-400 block">Immatriculation</span>
              <span className="font-mono font-bold text-zinc-200">
                {dossier.registrationNumber || '12345 | 72'}
              </span>
            </div>

            <div className="pt-2 border-t border-[#1e1e26]">
              <span className="text-[11px] text-zinc-400 block">Montant demandé</span>
              <span className="font-mono font-black text-white text-sm block">
                <Currency amount={dossier.requestedAmount} />
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-400 block">Apport</span>
              <span className="font-mono text-zinc-300">
                <Currency amount={dossier.downPayment} /> (20%)
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-400 block">Durée</span>
              <span className="font-mono text-zinc-200">{dossier.durationMonths} mois</span>
            </div>

            <div className="pt-2 border-t border-[#1e1e26]">
              <span className="text-[11px] text-zinc-400 block">Partenaire</span>
              <span className="font-bold text-cyan-400">{dossier.partnerName}</span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-400 block">Conseiller</span>
              <span className="text-zinc-200">{dossier.advisorName || 'Adel Maalal'}</span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-400 block">Date de création</span>
              <span className="font-mono text-zinc-400 text-[11px]">
                {new Date(dossier.createdAt).toLocaleDateString('fr-MA')} à 10:31
              </span>
            </div>
          </div>
        </div>

        {/* Col 2: Avancement Timeline Stepper (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2.5">
            Avancement
          </h2>

          <div className="relative pl-6 space-y-5">
            {/* Vertical Line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#262632]" />

            {STEPPER_STAGES.map((stg, idx) => {
              const isCompleted = idx < currentStepIndex
              const isCurrent = idx === currentStepIndex

              return (
                <div key={stg.id} className="relative space-y-1">
                  {/* Node Circle */}
                  <div
                    className={`absolute -left-[20px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#121216] shadow ${
                      isCurrent
                        ? 'bg-amber-400 ring-4 ring-amber-500/20'
                        : isCompleted
                        ? 'bg-blue-500'
                        : 'bg-[#282834]'
                    }`}
                  />

                  <div className="flex justify-between items-start">
                    <span
                      className={`font-bold ${
                        isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-zinc-500'
                      }`}
                    >
                      {stg.name}
                    </span>
                    {stg.date && (
                      <span className="text-[10px] text-zinc-400 font-mono">{stg.date}</span>
                    )}
                  </div>

                  <p className={`text-[11px] ${isCurrent ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {stg.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Col 3: Documents & Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Documents Card */}
          <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2.5">
              Documents
            </h2>

            <div className="space-y-2">
              {[
                { name: 'Carte d’identité', type: 'PDF' },
                { name: 'Bulletins de salaire (3 mois)', type: 'PDF' },
                { name: 'Relevé bancaire', type: 'PDF' },
                { name: 'Facture proforma', type: 'PDF' },
                { name: 'Assurance', type: 'PDF' },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-lg border border-[#24242e] bg-[#16161c] p-2.5 hover:border-zinc-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <span className="text-zinc-200 font-medium text-[11px]">{doc.name}</span>
                  </div>
                  <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-400">
                    {doc.type}
                  </span>
                </div>
              ))}

              <button className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-dashed border-[#333340] py-2 text-zinc-400 hover:text-white hover:border-zinc-400 transition-colors">
                <Plus className="h-3.5 w-3.5" />
                <span>Ajouter un document</span>
              </button>
            </div>
          </div>

          {/* Actions Card matching Reference #09 Screen 3 */}
          <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2.5">
              Actions
            </h2>

            <div className="space-y-2">
              <button className="flex items-center gap-2 w-full rounded-lg border border-[#282834] bg-[#16161c] p-2.5 font-semibold text-zinc-300 hover:text-white hover:border-zinc-500">
                <Send className="h-3.5 w-3.5 text-cyan-400" />
                <span>Envoyer un message</span>
              </button>

              <button className="flex items-center gap-2 w-full rounded-lg border border-[#282834] bg-[#16161c] p-2.5 font-semibold text-zinc-300 hover:text-white hover:border-zinc-500">
                <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
                <span>Relancer le partenaire</span>
              </button>

              <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-600 p-2.5 font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-all">
                <XCircle className="h-3.5 w-3.5" />
                <span>Clôturer le dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
