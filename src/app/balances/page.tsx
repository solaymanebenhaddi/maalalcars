import React from 'react'
import Link from 'next/link'
import {
  Scale,
  AlertTriangle,
  User,
  Phone,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Currency } from '@/components/shared/currency'
import { StatusBadge } from '@/components/shared/status-badge'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function BalancesPage() {
  const invoicesWithBalance = await prisma.invoice.findMany({
    where: { balanceDue: { gt: 0 } },
    include: {
      contact: true,
      sale: { include: { vehicle: true } },
    },
    orderBy: { dueDate: 'asc' },
  })

  const totalOutstanding = invoicesWithBalance.reduce((sum, inv) => sum + inv.balanceDue, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Soldes & Créances Clients"
        subtitle="Suivi des impayés, des relances commerciales et des encours acheteurs"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Paiements', href: '/payments' },
          { label: 'Soldes & Créances' },
        ]}
      />

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Créances à Recouvrer"
          value={<Currency amount={totalOutstanding} />}
          trend={{ value: `${invoicesWithBalance.length} factures`, direction: 'down', label: 'non soldées' }}
          icon={Scale}
          iconColor="amber"
        />

        <StatCard
          title="Factures en Retard"
          value={invoicesWithBalance.filter((i) => new Date(i.dueDate) < new Date()).length}
          trend={{ value: 'Échéance dépassée', direction: 'down', label: 'à relancer en priorité' }}
          icon={AlertTriangle}
          iconColor="red"
        />

        <StatCard
          title="Clients avec Encours"
          value={new Set(invoicesWithBalance.map((i) => i.contactId)).size}
          trend={{ value: 'Comptes débiteurs', direction: 'neutral', label: 'suivis' }}
          icon={User}
          iconColor="cyan"
        />
      </div>

      {/* Outstanding Receivables Table */}
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4">
          Factures en Attente de Règlement
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] text-[11px] font-semibold text-zinc-400">
                <th className="pb-3">N° Facture</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Téléphone</th>
                <th className="pb-3">Date d’Échéance</th>
                <th className="pb-3 text-right">Total Facturé</th>
                <th className="pb-3 text-right">Payé</th>
                <th className="pb-3 text-right">Solde Dû</th>
                <th className="pb-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {invoicesWithBalance.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3.5 font-mono font-bold text-white">
                    <Link href={`/invoices/${inv.id}/preview`} className="hover:text-red-400">
                      {inv.code}
                    </Link>
                  </td>
                  <td className="py-3.5 text-zinc-200 font-medium">
                    {inv.contact?.firstName} {inv.contact?.lastName} {inv.contact?.companyName}
                  </td>
                  <td className="py-3.5 text-zinc-400 font-mono">
                    <a href={`tel:${inv.contact?.phone}`} className="hover:text-cyan-400 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{inv.contact?.phone}</span>
                    </a>
                  </td>
                  <td className="py-3.5 text-zinc-300 font-medium">
                    {new Date(inv.dueDate).toLocaleDateString('fr-MA')}
                  </td>
                  <td className="py-3.5 text-right font-mono text-zinc-400">
                    <Currency amount={inv.totalTTC} />
                  </td>
                  <td className="py-3.5 text-right font-mono text-emerald-400">
                    <Currency amount={inv.paidAmount} />
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-amber-400">
                    <Currency amount={inv.balanceDue} />
                  </td>
                  <td className="py-3.5 text-center">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
              {invoicesWithBalance.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-xs text-zinc-400">
                    Toutes les créances sont soldées. Aucun impayé !
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
