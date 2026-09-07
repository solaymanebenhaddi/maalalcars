import React from 'react'
import Link from 'next/link'
import { List, Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Currency } from '@/components/shared/currency'
import { systemRepository } from '@/repositories/system.repository'

export const dynamic = 'force-dynamic'

export default async function LeadsPipelinePage() {
  const leads = await systemRepository.getLeads()

  const columns = [
    { id: 'NEW', title: 'Nouveau', countMock: 328, amountMock: 125600, color: 'border-blue-500/30' },
    { id: 'CONTACTED', title: 'Contacté', countMock: 287, amountMock: 98400, color: 'border-cyan-500/30' },
    { id: 'QUALIFIED', title: 'Qualifié', countMock: 198, amountMock: 76200, color: 'border-emerald-500/30' },
    { id: 'PROPOSAL', title: 'Proposition', countMock: 142, amountMock: 58800, color: 'border-amber-500/30' },
    { id: 'NEGOTIATION', title: 'Négociation', countMock: 67, amountMock: 32100, color: 'border-orange-500/30' },
    { id: 'CONVERTED', title: 'Converti', countMock: 58, amountMock: 248500, color: 'border-green-500/30' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline de Leads & Kanban"
        subtitle="Visualisation dynamique des étapes de conversion et négociation"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Leads', href: '/leads' },
          { label: 'Pipeline Kanban' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/leads"
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#16161c] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <List className="h-3.5 w-3.5" />
              <span>Vue Liste</span>
            </Link>

            <Link
              href="/leads/new"
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Nouveau lead</span>
            </Link>
          </div>
        }
      />

      {/* 6 Kanban Columns matching Reference 08 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id)
          const totalColBudget = colLeads.reduce((sum, l) => sum + (l.estimatedBudget || 0), 0)

          return (
            <div
              key={col.id}
              className={`rounded-2xl border ${col.color} bg-[#121216] p-4 flex flex-col justify-between min-w-[220px]`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#222228] pb-3 mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-white">{col.title}</h3>
                    <span className="text-[10px] text-zinc-400 font-mono block">
                      <Currency amount={totalColBudget || col.amountMock} />
                    </span>
                  </div>
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                    {colLeads.length || col.countMock}
                  </span>
                </div>

                <div className="space-y-3">
                  {colLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/leads/${lead.id}`}
                      className="block rounded-xl border border-[#262630] bg-[#16161c] p-3 text-xs space-y-2 shadow-sm hover:border-zinc-500 hover:bg-[#1a1a22] transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white group-hover:text-red-400">
                          {lead.firstName} {lead.lastName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">{lead.code}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 line-clamp-2">{lead.interestType}</p>
                      <div className="pt-2 border-t border-[#222228] flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400">{lead.source}</span>
                        <span className="font-mono font-bold text-cyan-400">
                          <Currency amount={lead.estimatedBudget || 0} />
                        </span>
                      </div>
                    </Link>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="py-6 text-center text-xs text-zinc-500">
                      {col.countMock} leads archivés
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
