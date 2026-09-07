import React from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Currency } from '@/components/shared/currency'
import { EmptyState } from '@/components/shared/empty-state'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      contact: true,
      sale: { include: { vehicle: true } },
    },
    orderBy: { paymentDate: 'desc' },
  })

  const totalInflows = payments
    .filter((p) => p.type === 'INFLOW')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalOutflows = payments
    .filter((p) => p.type === 'OUTFLOW' || p.type === 'COMMISSION')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paiements & Encaissements"
        subtitle="Suivi des flux de trésorerie entrants et sortants en Dirhams marocains (MAD / DH)"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Paiements' }]}
        actions={
          <Link
            href="/balances"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#16161c] px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:text-white"
          >
            <span>Voir Soldes & Créances Clients</span>
          </Link>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Encaissements (Cash In)"
          value={<Currency amount={totalInflows} />}
          trend={{ value: 'Entrées en compte', direction: 'up', label: 'ventes & acomptes' }}
          icon={ArrowDownLeft}
          iconColor="green"
        />

        <StatCard
          title="Total Décaissements (Cash Out)"
          value={<Currency amount={totalOutflows} />}
          trend={{ value: 'Sorties de trésorerie', direction: 'down', label: 'achats & frais' }}
          icon={ArrowUpRight}
          iconColor="purple"
        />

        <StatCard
          title="Solde Net de Trésorerie"
          value={<Currency amount={totalInflows - totalOutflows} />}
          trend={{ value: 'Trésorerie nette', direction: 'up', label: 'disponible' }}
          icon={DollarSign}
          iconColor="cyan"
        />
      </div>

      {/* Transactions Table */}
      {payments.length > 0 ? (
        <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222228] text-[11px] font-semibold text-zinc-400">
                  <th className="pb-3">Réf.</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Tiers / Contact</th>
                  <th className="pb-3">Mode & Référence</th>
                  <th className="pb-3 text-right">Montant</th>
                  <th className="pb-3 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {payments.map((p) => {
                  const isInflow = p.type === 'INFLOW'
                  return (
                    <tr key={p.id} className="hover:bg-[#18181f] transition-colors">
                      <td className="py-3.5 font-mono font-semibold text-white">{p.code}</td>
                      <td className="py-3.5 text-zinc-400">{new Date(p.paymentDate).toLocaleDateString('fr-MA')}</td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                            isInflow
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : 'border-red-500/30 bg-red-500/10 text-red-400'
                          }`}
                        >
                          {isInflow ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                          <span>{isInflow ? 'Encaissement' : 'Décaissement'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-zinc-200 font-medium">
                        {p.contact?.firstName} {p.contact?.lastName} {p.contact?.companyName}
                      </td>
                      <td className="py-3.5 text-zinc-400 font-mono">
                        {p.paymentMethod} {p.referenceNumber ? `(${p.referenceNumber})` : ''}
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold">
                        <Currency
                          amount={p.amount}
                          className={isInflow ? 'text-emerald-400' : 'text-red-400'}
                          prefix={isInflow ? '+' : '-'}
                        />
                      </td>
                      <td className="py-3.5 text-center">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          type="generic"
          title="Aucun paiement enregistré"
          description="Les encaissements et décaissements enregistrés apparaîtront ici."
        />
      )}
    </div>
  )
}
