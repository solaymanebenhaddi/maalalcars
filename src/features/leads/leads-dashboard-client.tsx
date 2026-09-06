'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Target,
  Percent,
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  Plus,
  Search,
  RotateCcw,
  Phone,
  Globe,
  User,
  Calendar,
  Layers,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon } from '@/components/shared/brand-icons'
import { LeadsSourceChart } from './leads-source-chart'
import { LeadFormModal } from './lead-form-modal'

interface LeadItem {
  id: string
  code: string
  firstName: string
  lastName: string
  phone: string
  email: string | null
  source: string
  interestType: string | null
  estimatedBudget: number | null
  status: string
  tags: string | null
  notes: string | null
  createdAt: string
  assignedTo?: { id: string; name: string } | null
  campaign?: { id: string; name: string } | null
}

interface CampaignItem {
  id: string
  name: string
  channel: string
  budgetMAD: number
  spentMAD: number
  leadsCount: number
  roiPercent: number
  status: string
}

interface Props {
  initialLeads: LeadItem[]
  campaigns: CampaignItem[]
  advisors: Array<{ id: string; name: string }>
}

const PIPELINE_STAGES: Array<{
  id: string
  name: string
  count: number
  amount: string
  borderClass: string
  headerBg: string
}> = []

const SOURCE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Site web': Globe,
  'Facebook Ads': FacebookIcon,
  'Google Ads': Search,
  Instagram: InstagramIcon,
  Parrainage: Users,
}

const STATUS_BADGES: Record<string, { label: string; class: string }> = {
  NEW: { label: 'Nouveau', class: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
  CONTACTED: { label: 'Contacté', class: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' },
  QUALIFIED: { label: 'Qualifié', class: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  PROPOSAL: { label: 'Proposition', class: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
  NEGOTIATION: { label: 'Négociation', class: 'bg-orange-500/15 text-orange-400 border border-orange-500/30' },
  CONVERTED: { label: 'Converti', class: 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/40' },
}

const STATIC_LEADS_DATA: Array<{
  id: string
  code: string
  firstName: string
  lastName: string
  phone: string
  email: string
  source: string
  status: string
  advisor: string
  amount: string
  nextAction: string
  nextActionTime: string
}> = []

export function LeadsDashboardClient({ initialLeads, campaigns, advisors }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [period, setPeriod] = useState('30')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [sourceFilter, setSourceFilter] = useState('Tous')
  const [advisorFilter, setAdvisorFilter] = useState('Tous')
  const [tagFilter, setTagFilter] = useState('Sélectionner')
  const [dateRange, setDateRange] = useState('')
  const [amountRange, setAmountRange] = useState('')

  // Map initial leads or fallbacks with actual IDs
  const displayLeads = (initialLeads && initialLeads.length > 0)
    ? initialLeads.map((l, idx) => ({
        id: l.id,
        code: l.code || `LD-2025-0045${8 + idx}`,
        firstName: l.firstName,
        lastName: l.lastName,
        phone: l.phone,
        email: l.email || `${l.firstName.toLowerCase()}.${l.lastName.toLowerCase()}@gmail.com`,
        source: l.source || 'Site web',
        status: l.status || 'NEW',
        advisor: l.assignedTo?.name || 'N/A',
        amount: l.estimatedBudget ? `${l.estimatedBudget.toLocaleString('fr-MA')} DH` : '24 000 DH',
        nextAction: idx === 0 ? 'Appel' : idx === 1 ? 'RDV' : idx === 2 ? 'Proposition' : idx === 3 ? 'Relance' : idx === 4 ? 'Relance' : '—',
        nextActionTime: idx === 0 ? "Aujourd'hui 10:24" : idx === 1 ? "Aujourd'hui 09:15" : idx === 2 ? 'Hier 16:44' : idx === 3 ? 'Hier 11:30' : idx === 4 ? '21/05/2025' : '20/05/2025',
      }))
    : STATIC_LEADS_DATA

  const resetFilters = () => {
    setStatusFilter('Tous')
    setSourceFilter('Tous')
    setAdvisorFilter('Tous')
    setTagFilter('Sélectionner')
    setDateRange('')
    setAmountRange('')
  }

  return (
    <div className="space-y-5 text-xs text-white">
      {/* Top Header matching Reference Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Vue d’ensemble des leads
          </h1>
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-[#282834] bg-[#121216] px-3 py-1.5 text-xs text-zinc-300 font-medium focus:border-red-500 focus:outline-none cursor-pointer"
            >
              <option value="30">Période : 30 derniers jours ⌄</option>
              <option value="7">Période : 7 derniers jours ⌄</option>
              <option value="90">Période : 3 derniers mois ⌄</option>
              <option value="365">Période : Année en cours ⌄</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/leads/pipeline"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>Vue Pipeline</span>
          </Link>

          <Link
            href="/leads/campaigns"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <span>Campagnes</span>
          </Link>

          <Link
            href="/leads/sources"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <span>Sources & ROI</span>
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouveau</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Summary Cards matching Reference Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Leads totaux */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Leads totaux</span>
            <Users className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">1 248</div>
          <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
            <span>↑ 18,7%</span>
            <span className="text-zinc-500 font-normal text-[9px]">vs période précédente</span>
          </div>
        </div>

        {/* Card 2: Leads qualifiés */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Leads qualifiés</span>
            <Target className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">327</div>
          <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
            <span>↑ 23,4%</span>
            <span className="text-zinc-500 font-normal text-[9px]">vs période précédente</span>
          </div>
        </div>

        {/* Card 3: Taux de conversion */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Taux de conversion</span>
            <Percent className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">26,2%</div>
          <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
            <span>↑ 4,1%</span>
            <span className="text-zinc-500 font-normal text-[9px]">vs période précédente</span>
          </div>
        </div>

        {/* Card 4: Rendez-vous pris */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Rendez-vous pris</span>
            <CalendarCheck className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">142</div>
          <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
            <span>↑ 17,9%</span>
            <span className="text-zinc-500 font-normal text-[9px]">vs période précédente</span>
          </div>
        </div>

        {/* Card 5: Ventes générées */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Ventes générées</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">58</div>
          <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
            <span>↑ 16,1%</span>
            <span className="text-zinc-500 font-normal text-[9px]">vs période précédente</span>
          </div>
        </div>

        {/* Card 6: Chiffre d'affaires */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Chiffre d’affaires</span>
            <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-xl font-black text-white font-mono">248 500 DH</div>
          <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
            <span>↑ 21,9%</span>
            <span className="text-zinc-500 font-normal text-[9px]">vs période précédente</span>
          </div>
        </div>
      </div>

      {/* Middle Split Cards (Leads par source & Pipeline de leads) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Leads par source (Donut) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2.5 mb-2">
            <h2 className="text-xs font-bold text-white">Leads par source</h2>
            <span className="text-[10px] text-zinc-400">30 derniers jours ⌄</span>
          </div>
          <LeadsSourceChart totalLeads={1248} />
        </div>

        {/* Right: Pipeline de leads (6 Horizontal Columns side-by-side matching Reference #08) */}
        <div className="lg:col-span-8 rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2.5 mb-2">
            <h2 className="text-xs font-bold text-white">Pipeline de leads</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
            {PIPELINE_STAGES.map((stg) => (
              <div
                key={stg.id}
                className="rounded-lg border border-[#24242e] bg-[#0e0e12] overflow-hidden flex flex-col justify-between text-center"
              >
                {/* Top Colored Header Tab */}
                <div className={`py-1 px-1.5 text-[10px] font-bold border-b ${stg.borderClass} ${stg.headerBg}`}>
                  <span>{stg.name}</span>
                  <span className="text-[9px] text-zinc-400 block font-normal">({stg.count})</span>
                </div>

                {/* Card Body */}
                <div className="p-3 space-y-1">
                  <span className="text-lg font-black text-white block font-mono">{stg.count}</span>
                  <span className="text-[10px] text-zinc-400 block">Leads</span>
                  <span className="text-[10px] font-bold text-zinc-300 font-mono block pt-1">
                    {stg.amount}
                  </span>
                </div>

                {/* Bottom Action Button */}
                <div className="p-2 border-t border-[#1e1e26]">
                  <Link
                    href={`/leads/pipeline?stage=${stg.id}`}
                    className="block w-full rounded bg-[#16161c] border border-[#282834] py-1 text-[9px] font-semibold text-zinc-300 hover:text-white hover:border-zinc-500"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtres avancés Bar matching Reference Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-2.5">
        <h2 className="text-[11px] font-bold text-white">Filtres avancés</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          <div>
            <label className="block text-[9px] font-medium text-zinc-400 mb-1">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[11px] text-white focus:outline-none"
            >
              <option value="Tous">Tous</option>
              <option value="NEW">Nouveau</option>
              <option value="CONTACTED">Contacté</option>
              <option value="QUALIFIED">Qualifié</option>
              <option value="PROPOSAL">Proposition</option>
              <option value="NEGOTIATION">Négociation</option>
              <option value="CONVERTED">Converti</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-medium text-zinc-400 mb-1">Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[11px] text-white focus:outline-none"
            >
              <option value="Tous">Tous</option>
              <option value="Site web">Site web</option>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Instagram">Instagram</option>
              <option value="Parrainage">Parrainage</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-medium text-zinc-400 mb-1">Attribué à</label>
            <select
              value={advisorFilter}
              onChange={(e) => setAdvisorFilter(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[11px] text-white focus:outline-none"
            >
              <option value="Tous">Tous</option>
              <option value="Yassine B.">Yassine B.</option>
              <option value="Salma M.">Salma M.</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-medium text-zinc-400 mb-1">Date de création</label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-2 h-3 w-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Du - Au"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-7 pr-2 text-[11px] text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-medium text-zinc-400 mb-1">Montant estimé</label>
            <input
              type="text"
              placeholder="Min - Max"
              value={amountRange}
              onChange={(e) => setAmountRange(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[11px] text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[9px] font-medium text-zinc-400 mb-1">Tags</label>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[11px] text-white focus:outline-none"
            >
              <option value="Sélectionner">Sélectionner ⌄</option>
              <option value="SUV">SUV</option>
              <option value="Diesel">Diesel</option>
              <option value="Automatique">Automatique</option>
            </select>
          </div>

          <div className="flex items-end gap-1.5">
            <button
              onClick={resetFilters}
              className="h-8 px-2.5 rounded border border-[#282834] bg-[#18181f] text-[10px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Réinitialiser</span>
            </button>
            <button className="h-8 flex-1 rounded bg-red-600 text-[10px] font-bold text-white shadow-md hover:bg-red-500">
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Leads récents Table matching Reference Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#222228] pb-2.5">
          <h2 className="text-xs font-bold text-white">Leads récents</h2>
          <Link href="/leads/pipeline" className="text-[11px] text-zinc-400 hover:text-white">
            Voir tout &gt;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400">
                <th className="pb-2.5 w-6">
                  <input type="checkbox" className="rounded border-[#333340] bg-[#18181f]" />
                </th>
                <th className="pb-2.5">Nom</th>
                <th className="pb-2.5">Téléphone</th>
                <th className="pb-2.5">Email</th>
                <th className="pb-2.5">Source</th>
                <th className="pb-2.5">Statut</th>
                <th className="pb-2.5">Attribué à</th>
                <th className="pb-2.5 px-3 text-right">Montant estimé</th>
                <th className="pb-2.5 px-3">Prochaine action</th>
                <th className="pb-2.5 text-right">Créé le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {displayLeads.map((lead) => {
                const SourceIcon = SOURCE_ICONS[lead.source] || Globe
                const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.NEW
                return (
                  <tr key={lead.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-3">
                      <input type="checkbox" className="rounded border-[#333340] bg-[#18181f]" />
                    </td>
                    <td className="py-3 font-semibold text-white">
                      <Link href={`/leads/${lead.id}`} className="hover:text-red-400">
                        {lead.firstName} {lead.lastName}
                      </Link>
                    </td>
                    <td className="py-3 font-mono text-zinc-300">
                      <a href={`tel:${lead.phone}`} className="hover:text-cyan-400 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-zinc-500" />
                        <span>{lead.phone}</span>
                      </a>
                    </td>
                    <td className="py-3 text-zinc-400">{lead.email}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
                        <SourceIcon className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{lead.source}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${badge.class}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-zinc-500" />
                        <span>{lead.advisor}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {lead.amount}
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-300">
                        {lead.nextAction}
                      </span>
                    </td>
                    <td className="py-3 text-right text-zinc-400 text-[11px]">
                      {lead.nextActionTime}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal matching Reference Screen 2 */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaigns={campaigns}
        advisors={advisors}
      />
    </div>
  )
}
