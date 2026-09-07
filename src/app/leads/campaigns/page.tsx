import React from 'react'
import Link from 'next/link'
import {
  Megaphone,
  DollarSign,
  Users,
  Target,
  Plus,
  Search,
  ArrowLeft,
  ArrowUpRight,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

export const dynamic = 'force-dynamic'

const CAMPAIGNS_DATA = [
  { name: 'Promo Printemps 2025', channel: 'Google Ads', status: 'Active', statusClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', budget: '2 000 DH', spent: '1 450 DH', leads: 68, cpl: '21,32 DH', roi: '▲ 412%' },
  { name: 'SUV Weekend', channel: 'Facebook Ads', status: 'Active', statusClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', budget: '1 500 DH', spent: '1 210 DH', leads: 54, cpl: '22,41 DH', roi: '▲ 365%' },
  { name: 'Remarketing Mai', channel: 'Google Ads', status: 'Active', statusClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', budget: '1 000 DH', spent: '820 DH', leads: 38, cpl: '21,58 DH', roi: '▲ 392%' },
  { name: 'Instagram Stories', channel: 'Instagram', status: 'Active', statusClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', budget: '800 DH', spent: '645 DH', leads: 27, cpl: '23,89 DH', roi: '▲ 301%' },
  { name: 'Offre Pro Spéciale', channel: 'Email', status: 'Active', statusClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', budget: '500 DH', spent: '310 DH', leads: 19, cpl: '16,32 DH', roi: '▲ 512%' },
  { name: 'Salon Auto 2025', channel: 'Événement', status: 'Terminée', statusClass: 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30', budget: '3 000 DH', spent: '2 950 DH', leads: 112, cpl: '26,34 DH', roi: '▲ 278%' },
  { name: 'Essai Gratuit Mai', channel: 'Google Ads', status: 'En pause', statusClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30', budget: '1 000 DH', spent: '210 DH', leads: 9, cpl: '23,33 DH', roi: '—' },
  { name: 'Parrainage Clients', channel: 'Parrainage', status: 'Active', statusClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', budget: '650 DH', spent: '320 DH', leads: 34, cpl: '9,41 DH', roi: '▲ 642%' },
]

export default function MarketingCampaignsPage() {
  return (
    <div className="space-y-5 text-xs text-white">
      <PageHeader
        title="Campagnes Marketing"
        subtitle="Pilotage des budgets publicitaires, acquisition omnicanale, coût par lead et rentabilité ROI"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Leads', href: '/leads' },
          { label: 'Campagnes Marketing' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/leads"
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Vue Leads</span>
            </Link>

            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-all">
              <Plus className="h-3.5 w-3.5" />
              <span>+ Nouvelle campagne</span>
            </button>
          </div>
        }
      />

      {/* 5 KPIs matching Reference Screen 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="font-medium">Campagnes actives</span>
            <Megaphone className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">8</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="font-medium">Budget dépensé</span>
            <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-xl font-black text-white font-mono">12 450 DH</div>
          <div className="text-[10px] font-semibold text-emerald-400">↑ 14,3% vs période précédente</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="font-medium">Leads générés</span>
            <Users className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">487</div>
          <div className="text-[10px] font-semibold text-emerald-400">↑ 18,8% vs période précédente</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="font-medium">Coût par lead</span>
            <Target className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-xl font-black text-white font-mono">25,54 DH</div>
          <div className="text-[10px] font-semibold text-emerald-400">↓ 7,8% vs période précédente</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="font-medium">ROI moyen</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">381%</div>
          <div className="text-[10px] font-semibold text-emerald-400">↑ 22,1% vs période précédente</div>
        </div>
      </div>

      {/* Campaigns Table matching Reference Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <h2 className="text-xs font-bold text-white">Liste des campagnes</h2>
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher une campagne..."
              className="h-8 w-60 rounded border border-[#282834] bg-[#18181f] pl-8 pr-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400">
                <th className="pb-2.5">Campagne</th>
                <th className="pb-2.5">Canal</th>
                <th className="pb-2.5 text-center">Statut</th>
                <th className="pb-2.5 text-right">Budget</th>
                <th className="pb-2.5 text-right">Dépensé</th>
                <th className="pb-2.5 text-center">Leads</th>
                <th className="pb-2.5 text-right">CPL</th>
                <th className="pb-2.5 text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {CAMPAIGNS_DATA.map((c) => (
                <tr key={c.name} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 font-semibold text-white">{c.name}</td>
                  <td className="py-3 text-zinc-300">{c.channel}</td>
                  <td className="py-3 text-center">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${c.statusClass}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-zinc-300">{c.budget}</td>
                  <td className="py-3 text-right font-mono font-bold text-white">{c.spent}</td>
                  <td className="py-3 text-center font-mono text-zinc-200">{c.leads}</td>
                  <td className="py-3 text-right font-mono text-zinc-300">{c.cpl}</td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-400">{c.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
