'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldAlert,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Eye,
  Trash2,
  ArrowUpRight,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

interface InsurancePolicy {
  id: string
  code: string
  vehicleName: string
  vehicleVin: string
  clientName: string
  clientPhone: string
  insurerName: string
  policyType: string
  annualPremium: number
  expiryDate: string
  daysRemaining: number
  status: 'Active' | 'En attente' | 'Résiliée'
}

const DEFAULT_POLICIES: InsurancePolicy[] = [
  {
    id: '1',
    code: 'ASS-2025-0048',
    vehicleName: 'Toyota Land Cruiser 2023',
    vehicleVin: 'VIN: JTMHV02J804567890',
    clientName: 'Yassine Benali',
    clientPhone: '06 12 34 56 78',
    insurerName: 'AXA Assurance',
    policyType: 'Tous risques',
    annualPremium: 1250,
    expiryDate: '30/05/2025',
    daysRemaining: 9,
    status: 'Active',
  },
  {
    id: '2',
    code: 'ASS-2025-0032',
    vehicleName: 'BMW X5 2022',
    vehicleVin: 'VIN: WBAJS10F00XXXXX',
    clientName: 'Sarah El Amrani',
    clientPhone: '06 98 76 54 32',
    insurerName: 'Allianz',
    policyType: 'Tiers étendu',
    annualPremium: 980,
    expiryDate: '05/06/2025',
    daysRemaining: 15,
    status: 'Active',
  },
  {
    id: '3',
    code: 'ASS-2025-0027',
    vehicleName: 'Audi Q7 2021',
    vehicleVin: 'VIN: WAUZZZ4M0MDXXXX',
    clientName: 'Imane Kabbaj',
    clientPhone: '06 77 88 99 00',
    insurerName: 'MAAF',
    policyType: 'Tous risques',
    annualPremium: 1150,
    expiryDate: '12/06/2025',
    daysRemaining: 22,
    status: 'Active',
  },
  {
    id: '4',
    code: 'ASS-2025-0035',
    vehicleName: 'Mercedes-Benz GLC 2022',
    vehicleVin: 'VIN: W1V0G8EB3NWXXXX',
    clientName: 'Omar Tazi',
    clientPhone: '06 55 66 77 88',
    insurerName: 'Groupama',
    policyType: 'Tiers étendu',
    annualPremium: 890,
    expiryDate: '18/06/2025',
    daysRemaining: 28,
    status: 'Active',
  },
  {
    id: '5',
    code: 'ASS-2025-0015',
    vehicleName: 'Toyota Hilux 2020',
    vehicleVin: 'VIN: AHTRB3CD80XXXXX',
    clientName: 'Salma Zahtouni',
    clientPhone: '06 33 44 55 66',
    insurerName: 'AXA Assurance',
    policyType: 'Tiers simple',
    annualPremium: 650,
    expiryDate: '25/06/2025',
    daysRemaining: 35,
    status: 'Active',
  },
]

const UPCOMING_EXPIRIES = [
  { vehicle: 'Toyota Land Cruiser 2023', code: 'Police ASS-2025-0048', date: '30/05/2025', badge: 'À venir' },
  { vehicle: 'BMW X5 2022', code: 'Police ASS-2025-0032', date: '05/06/2025', badge: 'À venir' },
  { vehicle: 'Audi Q7 2021', code: 'Police ASS-2025-0027', date: '12/06/2025', badge: 'À venir' },
  { vehicle: 'Mercedes-Benz GLC 2022', code: 'Police ASS-2025-0035', date: '18/06/2025', badge: 'À venir' },
]

const PREMIUMS_DATA = [
  { name: 'Tous risques', value: 38250, percent: '56,7%', color: '#ef4444' },
  { name: 'Tiers étendu', value: 16800, percent: '24,9%', color: '#f97316' },
  { name: 'Tiers simple', value: 8400, percent: '12,5%', color: '#3b82f6' },
  { name: 'Autres garanties', value: 4000, percent: '5,9%', color: '#a855f7' },
]

const ONGOING_CLAIMS = [
  {
    vehicle: 'Toyota Land Cruiser 2023',
    claimRef: 'SIN-2025-0012',
    date: 'Déclaré le 13/05/2025',
    damage: 'Dégâts carrosserie',
    status: 'En cours',
    statusColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  },
  {
    vehicle: 'BMW X5 2022',
    claimRef: 'SIN-2025-0010',
    date: 'Déclaré le 10/05/2025',
    damage: 'Bris de glace',
    status: 'Expertise',
    statusColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
  },
  {
    vehicle: 'Audi Q7 2021',
    claimRef: 'SIN-2025-0008',
    date: 'Déclaré le 05/05/2025',
    damage: 'Vol accessoires',
    status: 'Instruction',
    statusColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  },
]

export default function InsurancesDashboardPage() {
  const mounted = useMounted()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [insurerFilter, setInsurerFilter] = useState('Tous')
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [periodFilter, setPeriodFilter] = useState('Ce mois')
  const [policies, setPolicies] = useState<InsurancePolicy[]>(DEFAULT_POLICIES)

  const filtered = policies.filter((p) => {
    if (statusFilter !== 'Tous' && p.status !== statusFilter) return false
    if (insurerFilter !== 'Tous' && p.insurerName !== insurerFilter) return false
    if (typeFilter !== 'Tous' && p.policyType !== typeFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        p.code.toLowerCase().includes(q) ||
        p.vehicleName.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.insurerName.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette police d’assurance ?')) {
      setPolicies(policies.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Header matching Reference #34 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
            Assurances – Tableau de bord / Polices
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vue d&apos;ensemble de vos contrats d&apos;assurance et de leur suivi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="h-8 rounded-lg border border-[#282834] bg-[#141418] px-3 text-xs text-zinc-300 font-semibold focus:outline-none"
          >
            <option value="Ce mois">Ce mois</option>
            <option value="Ce trimestre">Ce trimestre</option>
            <option value="Cette année">Cette année</option>
          </select>

          <Link
            href="/insurances/claims/new"
            className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            <span>+ Déclarer un sinistre</span>
          </Link>

          <Link
            href="/insurances/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouvelle police</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Cards matching Reference #34 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Polices actives</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">48</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 8,3% ce mois</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Échéances à venir</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Calendar className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-amber-400 mt-1">7</div>
          <div className="text-[10px] text-zinc-400 mt-1">Dans les 30 jours</div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Primes totales</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <DollarSign className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">67 450 DH</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 12,6% ce mois</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Sinistres ouverts</span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <ShieldAlert className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-red-400 mt-1">3</div>
          <div className="text-[10px] text-zinc-400 mt-1">En cours de traitement</div>
        </div>

        {/* KPI 5 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Sinistres clôturés</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">12</div>
          <div className="text-[10px] text-zinc-400 mt-1">Ce mois</div>
        </div>
      </div>

      {/* 3 Monitoring Cards matching Reference #34 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 1: Échéances prochaines (span-4) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Échéances prochaines
            </h2>

            <div className="divide-y divide-[#1e1e24] pt-1">
              {UPCOMING_EXPIRIES.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white text-xs">{item.vehicle}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {item.code} · Échéance : {item.date}
                    </div>
                  </div>
                  <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => alert('Affichage des 7 échéances du mois')}
            className="w-full py-1.5 rounded-lg border border-[#282834] bg-[#18181f] text-center text-xs font-semibold text-zinc-300 hover:text-white"
          >
            Voir toutes les échéances
          </button>
        </div>

        {/* Card 2: Répartition des primes (span-4) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2 shadow-md">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Répartition des primes
          </h2>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="relative h-28 w-28 flex-shrink-0">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PREMIUMS_DATA}
                      innerRadius={30}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#121216"
                      strokeWidth={2}
                    >
                      {PREMIUMS_DATA.map((entry, index) => (
                        <Cell key={`cell-prem-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#141418',
                        borderColor: '#282834',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                      formatter={(val: unknown) => {
                        const num = typeof val === 'number' ? val : Number(val) || 0
                        return [`${num.toLocaleString('fr-FR')} DH`, 'Montant']
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono font-bold text-[11px] text-white">67 450 DH</span>
                <span className="text-[8px] text-zinc-400">Total primes</span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 text-[10px]">
              {PREMIUMS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400">
                    {item.value.toLocaleString('fr-FR')} DH ({item.percent})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Sinistres en cours (span-4) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Sinistres en cours
            </h2>

            <div className="space-y-2 pt-1">
              {ONGOING_CLAIMS.map((claim, idx) => (
                <div key={idx} className="p-2 rounded-lg border border-[#202028] bg-[#16161c] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white text-xs">{claim.vehicle}</div>
                    <div className="text-[10px] text-zinc-400">
                      {claim.claimRef} · {claim.damage}
                    </div>
                  </div>
                  <span className={`rounded border px-2 py-0.5 text-[9px] font-bold ${claim.statusColor}`}>
                    {claim.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => alert('Affichage des dossiers de sinistres')}
            className="w-full py-1.5 rounded-lg border border-[#282834] bg-[#18181f] text-center text-xs font-semibold text-zinc-300 hover:text-white"
          >
            Voir tous les sinistres
          </button>
        </div>
      </div>

      {/* Policies Table Section matching Reference #34 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Polices d&apos;assurance
          </h2>

          <div className="flex items-center gap-2">
            <Link
              href="/insurances/new"
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Nouvelle police</span>
            </Link>
          </div>
        </div>

        {/* Table Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une police, véhicule, client..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Statut : Tous</option>
              <option value="Active">Active</option>
              <option value="En attente">En attente</option>
              <option value="Résiliée">Résiliée</option>
            </select>
          </div>

          <div>
            <select
              value={insurerFilter}
              onChange={(e) => setInsurerFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Assureur : Tous</option>
              <option value="AXA Assurance">AXA Assurance</option>
              <option value="Allianz">Allianz</option>
              <option value="MAAF">MAAF</option>
              <option value="Groupama">Groupama</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Type : Tous</option>
              <option value="Tous risques">Tous risques</option>
              <option value="Tiers étendu">Tiers étendu</option>
              <option value="Tiers simple">Tiers simple</option>
            </select>
          </div>
        </div>

        {/* Polices Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Véhicule</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Assureur</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 font-mono text-right">Prime annuelle</th>
                <th className="py-2.5 px-3">Échéance</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    <Link href={`/insurances/${p.code}`} className="hover:text-red-400 hover:underline">
                      {p.code}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white">{p.vehicleName}</div>
                    <div className="font-mono text-zinc-500 text-[9px]">{p.vehicleVin}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-zinc-200 font-medium">{p.clientName}</div>
                    <div className="text-zinc-500 text-[10px]">{p.clientPhone}</div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">{p.insurerName}</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-medium">{p.policyType}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                    {p.annualPremium.toLocaleString('fr-FR')} DH
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-mono text-zinc-300">{p.expiryDate}</div>
                    <div className="text-[10px] text-amber-400 font-semibold">{p.daysRemaining} jours</div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/insurances/${p.code}`}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage de 1 à {filtered.length} sur 48 polices</span>
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
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              10
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
