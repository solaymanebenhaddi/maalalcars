import React from 'react'
import Link from 'next/link'
import {
  Users,
  Target,
  Percent,
  DollarSign,
  Download,
  ArrowLeft,
  Globe,
  Search as GoogleIcon,
  TrendingUp,
  Award,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon } from '@/components/shared/brand-icons'
import { PageHeader } from '@/components/shared/page-header'
import { LeadsSourceChart } from '@/features/leads/leads-source-chart'
import { LeadsEvolutionChart } from '@/features/leads/leads-evolution-chart'
import { CampaignsRoiChart } from '@/features/leads/campaigns-roi-chart'

export const dynamic = 'force-dynamic'

const SOURCE_ROWS = [
  { source: 'Site web', icon: Globe, leads: 474, qualified: 146, convRate: '30,8%', cpl: '15,19 DH', cost: '7 200 DH' },
  { source: 'Facebook Ads', icon: FacebookIcon, leads: 299, qualified: 81, convRate: '27,1%', cpl: '21,47 DH', cost: '6 410 DH' },
  { source: 'Google Ads', icon: GoogleIcon, leads: 249, qualified: 72, convRate: '28,9%', cpl: '18,28 DH', cost: '4 550 DH' },
  { source: 'Instagram', icon: InstagramIcon, leads: 125, qualified: 21, convRate: '16,8%', cpl: '10,22 DH', cost: '1 290 DH' },
  { source: 'Parrainage', icon: Users, leads: 61, qualified: 7, convRate: '11,5%', cpl: '6,56 DH', cost: '400 DH' },
  { source: 'Autres', icon: Globe, leads: 40, qualified: 0, convRate: '0%', cpl: '—', cost: '0 DH' },
]

const DONUT_SOURCES = [
  { name: 'Site web', value: 474, percentage: 37.9, color: '#00b4d8' },
  { name: 'Facebook Ads', value: 299, percentage: 24.0, color: '#22c55e' },
  { name: 'Google Ads', value: 249, percentage: 19.9, color: '#f97316' },
  { name: 'Instagram', value: 125, percentage: 10.0, color: '#ef4444' },
  { name: 'Parrainage', value: 61, percentage: 4.9, color: '#a855f7' },
  { name: 'Autres', value: 40, percentage: 3.2, color: '#6366f1' },
]

export default function SourcesAnalyticsPage() {
  return (
    <div className="space-y-5 text-xs text-white">
      <PageHeader
        title="Sources & Performance"
        subtitle="Analyse d’attribution, conversion par canal d’acquisition, coût d’acquisition et ROI"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Leads', href: '/leads' },
          { label: 'Sources & Performance' },
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

            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#202028] transition-all">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        }
      />

      {/* Top 4 Summary Cards matching Reference Screen 5 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="font-medium">Leads totaux</span>
            <Users className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">1 248</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="font-medium">Leads qualifiés</span>
            <Target className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">327</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="font-medium">Taux de conversion</span>
            <Percent className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">26,2%</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="font-medium">Coût total</span>
            <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-xl font-black text-white font-mono">12 450 DH</div>
        </div>
      </div>

      {/* Top Row: Performance par source Table (Left) & Répartition des leads Donut (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Top-Left: Performance par source Table */}
        <div className="lg:col-span-6 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2.5">
            <h2 className="text-xs font-bold text-white">Performance par source</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400">
                  <th className="pb-2.5">Source</th>
                  <th className="pb-2.5 text-center">Leads</th>
                  <th className="pb-2.5 text-center">Qualifiés</th>
                  <th className="pb-2.5 text-center">Taux conv.</th>
                  <th className="pb-2.5 text-right">CPL</th>
                  <th className="pb-2.5 text-right">Coût</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {SOURCE_ROWS.map((row) => {
                  const Icon = row.icon
                  return (
                    <tr key={row.source} className="hover:bg-[#18181f]">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          <Icon className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{row.source}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center font-mono text-zinc-300">{row.leads}</td>
                      <td className="py-2.5 text-center font-mono font-bold text-zinc-200">{row.qualified}</td>
                      <td className="py-2.5 text-center font-mono font-bold text-zinc-200">{row.convRate}</td>
                      <td className="py-2.5 text-right font-mono text-zinc-300">{row.cpl}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-white">{row.cost}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top-Right: Répartition des leads Donut */}
        <div className="lg:col-span-6 rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2.5 mb-2">
            <h2 className="text-xs font-bold text-white">Répartition des leads</h2>
          </div>
          <LeadsSourceChart data={DONUT_SOURCES} totalLeads={1248} compact={true} />
        </div>
      </div>

      {/* Bottom Row: Évolution des leads (Left) & Top campagnes par ROI (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bottom-Left: Évolution des leads Line Chart */}
        <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2.5">
            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-red-500" />
              <span>Évolution des leads</span>
            </h2>
          </div>
          <LeadsEvolutionChart />
        </div>

        {/* Bottom-Right: Top campagnes par ROI Horizontal Bars */}
        <div className="lg:col-span-5 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2.5">
            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-emerald-400" />
              <span>Top campagnes par ROI</span>
            </h2>
          </div>
          <CampaignsRoiChart />
        </div>
      </div>
    </div>
  )
}
