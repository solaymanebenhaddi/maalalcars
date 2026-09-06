'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Wallet,
  Clock,
  Calendar,
  CheckCircle2,
  Lock,
  Search,
  Download,
  Filter,
  Eye,
  Pencil,
  Mail,
  MoreVertical,
  Plus,
  Zap,
  ArrowUpRight,
  RotateCcw,
  X,
  Send,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export interface RegularizationRow {
  id: string
  code: string
  clientName: string
  invoiceCode: string
  invoiceDate: string
  dueDate: string
  agingDays: number
  amountDue: number
  amountPaid: number
  balanceDue: number
  paymentStatus: 'En retard' | 'À venir' | 'Réglé' | 'Partiel'
  reminderLevel: 'R0' | 'R1' | 'R2' | 'R3'
  vehicleName?: string
  contactPhone?: string
  contactEmail?: string
}

const DEFAULT_ROWS: RegularizationRow[] = [
  {
    id: '1',
    code: 'REG-2025-0031',
    clientName: 'Imane Zahiri',
    invoiceCode: 'FAC-2025-038',
    invoiceDate: '27/05/2025',
    dueDate: '26/06/2025',
    agingDays: 31,
    amountDue: 24900,
    amountPaid: 0,
    balanceDue: 24900,
    paymentStatus: 'En retard',
    reminderLevel: 'R2',
    vehicleName: 'Mercedes-Benz C220d AMG',
    contactPhone: '06 12 34 56 78',
    contactEmail: 'imane.zahiri@email.com',
  },
  {
    id: '2',
    code: 'REG-2025-0030',
    clientName: 'Omar Bennis',
    invoiceCode: 'FAC-2025-036',
    invoiceDate: '26/05/2025',
    dueDate: '25/06/2025',
    agingDays: 30,
    amountDue: 31500,
    amountPaid: 5000,
    balanceDue: 26500,
    paymentStatus: 'En retard',
    reminderLevel: 'R1',
    vehicleName: 'BMW X5 xDrive30d',
    contactPhone: '06 98 76 54 32',
    contactEmail: 'omar.bennis@gmail.com',
  },
  {
    id: '3',
    code: 'REG-2025-0029',
    clientName: "Ayoub M'rabet",
    invoiceCode: 'FAC-2025-032',
    invoiceDate: '22/05/2025',
    dueDate: '21/06/2025',
    agingDays: 10,
    amountDue: 29900,
    amountPaid: 0,
    balanceDue: 29900,
    paymentStatus: 'À venir',
    reminderLevel: 'R0',
    vehicleName: 'Toyota Land Cruiser 2023',
    contactPhone: '06 44 33 22 11',
    contactEmail: 'ayoub.mrabet@outlook.com',
  },
  {
    id: '4',
    code: 'REG-2025-0028',
    clientName: 'Nadia K.',
    invoiceCode: 'FAC-2025-030',
    invoiceDate: '20/05/2025',
    dueDate: '19/06/2025',
    agingDays: 8,
    amountDue: 18400,
    amountPaid: 0,
    balanceDue: 18400,
    paymentStatus: 'À venir',
    reminderLevel: 'R0',
    vehicleName: 'Audi Q7 45 TDI',
    contactPhone: '06 55 66 77 88',
    contactEmail: 'nadia.k@gmail.com',
  },
  {
    id: '5',
    code: 'REG-2025-0027',
    clientName: 'Youssef El Idrissi',
    invoiceCode: 'FAC-2025-028',
    invoiceDate: '19/05/2025',
    dueDate: '18/06/2025',
    agingDays: 7,
    amountDue: 12000,
    amountPaid: 2000,
    balanceDue: 10000,
    paymentStatus: 'À venir',
    reminderLevel: 'R0',
    vehicleName: 'Mercedes-Benz GLC 300',
    contactPhone: '06 11 22 33 44',
    contactEmail: 'youssef.idrissi@menara.ma',
  },
  {
    id: '6',
    code: 'REG-2025-0026',
    clientName: 'Mehdi Alaoui',
    invoiceCode: 'FAC-2025-027',
    invoiceDate: '15/05/2025',
    dueDate: '14/06/2025',
    agingDays: 3,
    amountDue: 15000,
    amountPaid: 5000,
    balanceDue: 10000,
    paymentStatus: 'À venir',
    reminderLevel: 'R0',
    vehicleName: 'BMW Série 3 Berline',
    contactPhone: '06 77 88 99 00',
    contactEmail: 'mehdi.alaoui@gmail.com',
  },
  {
    id: '7',
    code: 'REG-2025-0025',
    clientName: 'Karim Tabit',
    invoiceCode: 'FAC-2025-025',
    invoiceDate: '12/05/2025',
    dueDate: '11/06/2025',
    agingDays: 0,
    amountDue: 22500,
    amountPaid: 22500,
    balanceDue: 0,
    paymentStatus: 'Réglé',
    reminderLevel: 'R0',
    vehicleName: 'Audi A6 40 TDI',
    contactPhone: '06 33 22 11 00',
    contactEmail: 'karim.tabit@gmail.com',
  },
  {
    id: '8',
    code: 'REG-2025-0024',
    clientName: 'Sarah Benali',
    invoiceCode: 'FAC-2025-023',
    invoiceDate: '08/05/2025',
    dueDate: '07/06/2025',
    agingDays: 23,
    amountDue: 14300,
    amountPaid: 0,
    balanceDue: 14300,
    paymentStatus: 'En retard',
    reminderLevel: 'R2',
    vehicleName: 'Range Rover Evoque',
    contactPhone: '06 61 22 33 44',
    contactEmail: 'sarah.benali@outlook.com',
  },
]

const AGING_DATA = [
  { name: 'Non échus', value: 12650, percent: '7,1%', color: '#22c55e' },
  { name: '0 - 30 jours', value: 42350, percent: '23,7%', color: '#eab308' },
  { name: '31 - 60 jours', value: 28600, percent: '16,0%', color: '#f97316' },
  { name: '61 - 90 jours', value: 25500, percent: '14,3%', color: '#ef4444' },
  { name: '+ 90 jours', value: 69350, percent: '38,8%', color: '#b91c1c' },
]

export function RegularizationsDashboardClient() {
  const mounted = useMounted()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [paymentFilter, setPaymentFilter] = useState('Tous')
  const [dueDateFilter, setDueDateFilter] = useState('Tous')
  const [amountFilter, setAmountFilter] = useState('Tous')
  const [rows, setRows] = useState<RegularizationRow[]>(DEFAULT_ROWS)

  // Modals
  const [reminderModalOpen, setReminderModalOpen] = useState(false)
  const [sendSuccessToast, setSendSuccessToast] = useState(false)
  const [selectedRowForAction, setSelectedRowForAction] = useState<RegularizationRow | null>(null)

  const filtered = rows.filter((r) => {
    if (statusFilter !== 'Tous' && r.paymentStatus !== statusFilter) return false
    if (paymentFilter !== 'Tous') {
      if (paymentFilter === 'Non réglé' && r.amountPaid > 0) return false
      if (paymentFilter === 'Partiellement réglé' && (r.amountPaid === 0 || r.balanceDue === 0)) return false
      if (paymentFilter === 'Réglé' && r.balanceDue > 0) return false
    }
    if (amountFilter !== 'Tous') {
      if (amountFilter === '< 15 000 DH' && r.amountDue >= 15000) return false
      if (amountFilter === '15 000 - 25 000 DH' && (r.amountDue < 15000 || r.amountDue > 25000)) return false
      if (amountFilter === '> 25 000 DH' && r.amountDue <= 25000) return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      const match =
        r.code.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q) ||
        r.invoiceCode.toLowerCase().includes(q) ||
        (r.vehicleName && r.vehicleName.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })

  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('Tous')
    setPaymentFilter('Tous')
    setDueDateFilter('Tous')
    setAmountFilter('Tous')
  }

  const handleSendReminder = () => {
    setSendSuccessToast(true)
    setTimeout(() => setSendSuccessToast(false), 3000)
    setReminderModalOpen(false)
  }

  return (
    <div className="space-y-4 text-xs text-white max-w-7xl mx-auto">
      {/* Top Header matching Reference #31 Screen 0 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
            RÉGULARISATIONS – TABLEAU DE BORD / LISTE
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Suivez les soldes clients, les échéances et les encaissements en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>

          <Link
            href="/regularizations/reminders"
            className="flex items-center gap-1.5 rounded-lg border border-[#3e3e4a] bg-[#1a1a22] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white hover:border-red-500/50 transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Relances auto</span>
            <ArrowUpRight className="h-3 w-3 text-zinc-400" />
          </Link>

          <Link
            href="/regularizations/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouvelle régularisation</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Cards matching Reference #31 Screen 0 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* KPI 1: SOLDE TOTAL DÛ */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">Solde Total Dû</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
              <Wallet className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black font-mono text-white">178 450 DH</div>
            <div className="flex items-center gap-1 text-[10px] text-red-400 font-semibold mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>↑ 18,7% vs mois précédent</span>
            </div>
          </div>
        </div>

        {/* KPI 2: EN RETARD */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">En Retard</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black font-mono text-white">96 450 DH</div>
            <div className="text-[10px] text-orange-400 font-semibold mt-1">
              54,0% du total dû
            </div>
          </div>
        </div>

        {/* KPI 3: ÉCHÉANCES <= 30 JOURS */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold tracking-wider uppercase leading-tight">Échéances &le; 30 Jours</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black font-mono text-white">42 350 DH</div>
            <div className="text-[10px] text-amber-400 font-semibold mt-1">
              ↑ 23,7% du total dû
            </div>
          </div>
        </div>

        {/* KPI 4: RÉGULARISÉ CE MOIS */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">Régularisé Ce Mois</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black font-mono text-white">27 850 DH</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>↑ 12,9% vs mois précédent</span>
            </div>
          </div>
        </div>

        {/* KPI 5: ENCAISSÉ CE MOIS */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">Encaissé Ce Mois</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <Lock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black font-mono text-white">81 250 DH</div>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>↑ 15,4% vs mois précédent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar matching Reference #31 Screen 0 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-2.5 items-center">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un client, facture, véhicule..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Statut filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Statut (Tous)</option>
              <option value="En retard">En retard</option>
              <option value="À venir">À venir</option>
              <option value="Réglé">Réglé</option>
            </select>
          </div>

          {/* Statut règlement */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Statut règlement</option>
              <option value="Non réglé">Non réglé</option>
              <option value="Partiellement réglé">Partiel</option>
              <option value="Réglé">Soldé</option>
            </select>
          </div>

          {/* Échéance */}
          <div>
            <select
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Échéance</option>
              <option value="30j">&le; 30 jours</option>
              <option value="60j">&le; 60 jours</option>
              <option value="plus">&gt; 90 jours</option>
            </select>
          </div>

          {/* Date range display */}
          <div>
            <div className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 flex items-center justify-center text-[11px] font-mono text-zinc-300">
              01/05/2025 &rarr; 31/05/2025
            </div>
          </div>

          {/* Montant */}
          <div>
            <select
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Montant</option>
              <option value="< 15 000 DH">&lt; 15 000 DH</option>
              <option value="15 000 - 25 000 DH">15 000 - 25 000 DH</option>
              <option value="> 25 000 DH">&gt; 25 000 DH</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => alert('Filtres avancés supplémentaires activés')}
              className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1"
            >
              <Filter className="h-3 w-3 text-zinc-400" />
              <span>Plus</span>
            </button>
            <button
              onClick={handleResetFilters}
              title="Réinitialiser les filtres"
              className="h-8 w-8 rounded-lg border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white flex items-center justify-center"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Section RÉPARTITION DES SOLDES PAR ANCIENNETÉ matching Reference #31 Screen 0 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
        <h2 className="text-xs font-bold text-white tracking-wider uppercase">
          RÉPARTITION DES SOLDES PAR ANCIENNETÉ
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* 5 Buckets (col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {AGING_DATA.map((item) => (
              <div
                key={item.name}
                className="rounded-lg border border-[#202028] bg-[#16161c] p-3 flex flex-col justify-between h-[82px]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[10px] text-zinc-400 font-medium truncate">
                    {item.name}
                  </span>
                </div>
                <div>
                  <div className="font-mono font-bold text-white text-sm">
                    {item.value.toLocaleString('fr-FR')} DH
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    {item.percent}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Donut Chart and Legend (col-span-5) */}
          <div className="lg:col-span-5 flex items-center justify-between gap-2 p-2 rounded-lg border border-[#202028] bg-[#16161c]">
            <div className="relative h-28 w-28 flex-shrink-0">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={AGING_DATA}
                      innerRadius={30}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#16161c"
                      strokeWidth={2}
                    >
                      {AGING_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: unknown) => {
                        const num = typeof val === 'number' ? val : Number(val) || 0
                        return [`${num.toLocaleString('fr-FR')} DH`, 'Solde']
                      }}
                      contentStyle={{
                        backgroundColor: '#141418',
                        borderColor: '#282834',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Donut center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="font-mono font-bold text-[10px] text-white leading-tight">
                  178 450 DH
                </span>
                <span className="text-[8px] text-zinc-400">Total dû</span>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex-1 space-y-1 text-[10px] pr-2">
              {AGING_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-zinc-400">
                    {item.percent}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section LISTE DES RÉGULARISATIONS matching Reference #31 Screen 0 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#222228] pb-3">
          <h2 className="text-xs font-bold text-white tracking-wider uppercase">
            LISTE DES RÉGULARISATIONS
          </h2>
          <span className="text-[11px] text-zinc-400">
            {filtered.length} dossiers affichés
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Facture(s)</th>
                <th className="py-2.5 px-3 font-mono">Date facture</th>
                <th className="py-2.5 px-3 font-mono">Échéance</th>
                <th className="py-2.5 px-3 font-mono">Ancienneté</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant dû</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant encaissé</th>
                <th className="py-2.5 px-3 text-right font-mono">Solde dû</th>
                <th className="py-2.5 px-3 text-center">Statut règlement</th>
                <th className="py-2.5 px-3 text-center">Relance</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    <Link
                      href={`/regularizations/${r.code}`}
                      className="hover:text-red-400 hover:underline"
                    >
                      {r.code}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-white">{r.clientName}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-300">
                    <Link href={`/invoices/${r.invoiceCode}`} className="hover:text-cyan-400">
                      {r.invoiceCode}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{r.invoiceDate}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{r.dueDate}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-orange-400">
                    {r.agingDays > 0 ? `${r.agingDays} jours` : 'À jour'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-zinc-200">
                    {r.amountDue.toLocaleString('fr-FR')} DH
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400">
                    {r.amountPaid.toLocaleString('fr-FR')} DH
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                    {r.balanceDue.toLocaleString('fr-FR')} DH
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        r.paymentStatus === 'En retard'
                          ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                          : r.paymentStatus === 'À venir'
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                          : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono text-[10px] font-bold text-zinc-400">
                      {r.reminderLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/regularizations/${r.code}`}
                        title="Voir détail"
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => setSelectedRowForAction(r)}
                        title="Modifier / Ajuster"
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRowForAction(r)
                          setReminderModalOpen(true)
                        }}
                        title="Envoyer une relance"
                        className="rounded p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                      <button
                        title="Options"
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination matching Reference #31 Screen 0 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Afficher 1 à {filtered.length} sur 48 régularisations</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                &lt;
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
                1
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                2
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                3
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                4
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                5
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                &gt;
              </button>
            </div>
            <span className="text-zinc-500">10 par page</span>
          </div>
        </div>
      </div>

      {/* Direct Reminder Modal */}
      {reminderModalOpen && selectedRowForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Mail className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Envoyer une relance client
                </h3>
              </div>
              <button
                onClick={() => setReminderModalOpen(false)}
                className="rounded p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="rounded-lg border border-[#222228] bg-[#18181f] p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Client :</span>
                  <span className="font-bold text-white">{selectedRowForAction.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Facture :</span>
                  <span className="font-mono text-zinc-200">{selectedRowForAction.invoiceCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Solde dû :</span>
                  <span className="font-mono font-bold text-red-400">
                    {selectedRowForAction.balanceDue.toLocaleString('fr-FR')} DH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Niveau de relance :</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {selectedRowForAction.reminderLevel === 'R0'
                      ? '1ère Relance (R1)'
                      : `Relance supérieure (${selectedRowForAction.reminderLevel})`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Canal d&apos;envoi
                </label>
                <select className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
                  <option>Email & SMS</option>
                  <option>Email uniquement</option>
                  <option>SMS uniquement</option>
                  <option>WhatsApp Business</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Modèle de message
                </label>
                <select className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
                  <option>Relance standard - Échéance échue</option>
                  <option>Relance courtoise avant échéance</option>
                  <option>Mise en demeure formelle (J+30)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222228]">
              <button
                type="button"
                onClick={() => setReminderModalOpen(false)}
                className="rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSendReminder}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Envoyer la relance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit row modal */}
      {selectedRowForAction && !reminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-bold text-white">
                Modifier régularisation {selectedRowForAction.code}
              </h3>
              <button
                onClick={() => setSelectedRowForAction(null)}
                className="rounded p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Montant encaissé (DH)
                </label>
                <input
                  type="number"
                  defaultValue={selectedRowForAction.amountPaid}
                  id="edit-amount-paid"
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Statut de paiement
                </label>
                <select
                  defaultValue={selectedRowForAction.paymentStatus}
                  id="edit-payment-status"
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="En retard">En retard</option>
                  <option value="À venir">À venir</option>
                  <option value="Réglé">Réglé</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222228]">
              <button
                type="button"
                onClick={() => setSelectedRowForAction(null)}
                className="rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  const paidInput = document.getElementById('edit-amount-paid') as HTMLInputElement
                  const statusInput = document.getElementById('edit-payment-status') as HTMLSelectElement
                  if (paidInput && statusInput) {
                    const newPaid = Number(paidInput.value) || 0
                    setRows(
                      rows.map((item) =>
                        item.id === selectedRowForAction.id
                          ? {
                              ...item,
                              amountPaid: newPaid,
                              balanceDue: Math.max(0, item.amountDue - newPaid),
                              paymentStatus: statusInput.value as RegularizationRow['paymentStatus'],
                            }
                          : item
                      )
                    )
                  }
                  setSelectedRowForAction(null)
                }}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {sendSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Relance envoyée avec succès par Email et SMS !</span>
        </div>
      )}
    </div>
  )
}
