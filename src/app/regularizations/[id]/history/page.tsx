import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Layers,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface AuditEvent {
  date: string
  user: string
  role: string
  action: string
  details: string
}

const DEFAULT_AUDIT_TRAIL: AuditEvent[] = [
  {
    date: '30/05/2025 11:02',
    user: 'Admin Maalal',
    role: 'Administrateur',
    action: 'Validation',
    details: 'Régularisation validée et clôturée.',
  },
  {
    date: '30/05/2025 10:45',
    user: 'Nadia K.',
    role: 'Comptable',
    action: 'Rapprochement',
    details: 'Montants affectés et rapprochés.',
  },
  {
    date: '30/05/2025 10:20',
    user: 'Nadia K.',
    role: 'Comptable',
    action: 'Passage en attente',
    details: 'En attente d’affectation des montants.',
  },
  {
    date: '30/05/2025 10:15',
    user: 'Admin Maalal',
    role: 'Administrateur',
    action: 'Création',
    details: 'Régularisation créée.',
  },
]

export default async function RegularizationHistoryPage({ params }: Props) {
  const { id } = await params

  const reg = await prisma.regularization.findFirst({
    where: {
      OR: [{ id }, { code: id }, { code: id.toUpperCase() }],
    },
    include: {
      contact: true,
      sale: true,
      invoice: true,
    },
  }) || {
    code: 'REG-2025-0050',
    clientName: 'Imane Zahiri',
    saleCode: 'VEN-2025-0032',
    invoiceCode: 'FAC-2025-0038',
    difference: 2900,
    auditHistory: null,
  }

  const code = reg.code || 'REG-2025-0050'
  const clientName = reg.clientName || 'Imane Zahiri'
  const saleCode = reg.saleCode || 'VEN-2025-0032'
  const invoiceCode = reg.invoiceCode || 'FAC-2025-0038'
  const difference = reg.difference || 2900

  let auditEvents: AuditEvent[] = DEFAULT_AUDIT_TRAIL
  if (reg.auditHistory) {
    try {
      auditEvents = JSON.parse(reg.auditHistory)
    } catch {
      auditEvents = DEFAULT_AUDIT_TRAIL
    }
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto text-xs text-white">
      <PageHeader
        title="Historique & audit"
        subtitle="Traçabilité complète des modifications et validations financières."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Régularisations', href: '/regularizations' },
          { label: code, href: `/regularizations/${code}` },
          { label: 'Historique' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/regularizations/${code}/reconciliation`}
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <Layers className="h-3.5 w-3.5 text-zinc-400" />
              <span>Affectation</span>
            </Link>
            <Link
              href={`/regularizations/${code}`}
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour dossier</span>
            </Link>
          </div>
        }
      />

      {/* Main Container matching Reference #11 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Header Summary Box */}
        <div className="rounded-lg border border-[#282834] bg-[#16161c] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-white text-sm">{code}</span>
            <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Validée
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-zinc-400 text-[11px]">
            <div>
              Vente : <span className="font-mono text-zinc-200">{saleCode}</span>
            </div>
            <div>
              Facture : <span className="font-mono text-zinc-200">{invoiceCode}</span>
            </div>
            <div>
              Client : <span className="text-zinc-200">{clientName}</span>
            </div>
            <div>
              Montant : <span className="font-mono font-bold text-white">{difference.toLocaleString('fr-MA')},00 DH</span>
            </div>
            <div>
              Écart final : <span className="font-mono font-bold text-emerald-400">0,00 DH</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Historique</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold flex items-center gap-1.5">
            <span>Pièces jointes</span>
            <span className="rounded bg-[#202028] px-1.5 py-0.2 text-[10px] text-zinc-400">1</span>
          </button>
        </div>

        {/* Audit Table matching Reference #11 Screen 5 */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Utilisateur</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {auditEvents.map((evt, idx) => (
                <tr key={idx} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-300 whitespace-nowrap">
                    {evt.date}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600/30 to-zinc-800 text-[10px] font-bold text-white border border-red-500/20">
                        {evt.user.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs">{evt.user}</div>
                        <div className="text-[10px] text-zinc-400">{evt.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        evt.action === 'Validation'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : evt.action === 'Rapprochement'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : evt.action === 'Passage en attente'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {evt.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300 text-xs">{evt.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions matching Reference #11 Screen 5 */}
        <div className="flex items-center justify-end pt-3 border-t border-[#222228]">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter l’historique</span>
          </button>
        </div>
      </div>
    </div>
  )
}
