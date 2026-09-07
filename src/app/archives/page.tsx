'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Archive,
  Car,
  Users,
  ShoppingBag,
  AlertTriangle,
  RotateCcw,
  Search,
  Download,
  Eye,
  Trash2,
  HelpCircle,
  HardDrive,
  Info,
  ArrowUpRight,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

const ACTIVITY_DATA = [
  { month: 'Janv.', vehicules: 40, contacts: 55, ventes: 20, transactions: 12, restaurations: 8 },
  { month: 'Févr.', vehicules: 55, contacts: 70, ventes: 28, transactions: 15, restaurations: 11 },
  { month: 'Mars', vehicules: 45, contacts: 62, ventes: 24, transactions: 18, restaurations: 9 },
  { month: 'Avr.', vehicules: 70, contacts: 85, ventes: 35, transactions: 22, restaurations: 16 },
  { month: 'Mai', vehicules: 85, contacts: 110, ventes: 42, transactions: 28, restaurations: 20 },
  { month: 'Juin', vehicules: 60, contacts: 95, ventes: 38, transactions: 20, restaurations: 14 },
]

function ArchivesContent() {
  const searchParams = useSearchParams()
  const tabQuery = searchParams?.get('tab')
  const defaultTab =
    tabQuery === 'vehicles'
      ? 'vehicles'
      : tabQuery === 'contacts'
      ? 'contacts'
      : tabQuery === 'sales'
      ? 'sales'
      : tabQuery === 'restorations'
      ? 'restorations'
      : 'overview'

  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'contacts' | 'sales' | 'restorations'>(defaultTab)
  const [search, setSearch] = useState('')
  const [reasonFilter, setReasonFilter] = useState('Toutes')
  const isMounted = useMounted()

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #38 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Archive className="h-4 w-4 text-red-500" />
            <span>Centre d&apos;archives</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Consultez, gérez et restaurez vos enregistrements archivés en toute sécurité.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Guide d’utilisation du centre d’archives')}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
            <span>Guide d&apos;utilisation</span>
          </button>

          <Link
            href="/archives/restore"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>+ Action rapide (Restaurer)</span>
          </Link>
        </div>
      </div>

      {/* Tabs matching Reference #38 Screen 1 & 2 & 3 & 4 */}
      <div className="flex border-b border-[#222228] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Vue d&apos;ensemble
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'vehicles'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Véhicules archivés
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'contacts'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Contacts archivés
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'sales'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Ventes archivées / Annulées
        </button>
        <button
          onClick={() => setActiveTab('restorations')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'restorations'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Restaurations récentes
        </button>
      </div>

      {/* 5 KPI Cards matching Reference #38 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Véhicules archivés</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Car className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">128</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 12 ce mois</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Contacts archivés</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Users className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">243</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 18 ce mois</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Ventes archivées</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShoppingBag className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">86</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 9 ce mois</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Transactions annulées</span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-red-400 mt-1">47</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 5 ce mois</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Restaurations ce mois</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <RotateCcw className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-purple-400 mt-1">23</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 7 ce mois</span>
          </div>
        </div>
      </div>

      {/* Tab 1: Vue d'ensemble matching Reference #38 Screen 1 */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Activité des archives (6 derniers mois) - Recharts LineChart (span-7) */}
            <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Activité des archives (6 derniers mois)
              </h2>
              <div className="h-64 w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222228" />
                      <XAxis dataKey="month" stroke="#71717a" fontSize={10} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#141418',
                          borderColor: '#282834',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: '#fff',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                      <Line type="monotone" dataKey="vehicules" name="Véhicules" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="contacts" name="Contacts" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="ventes" name="Ventes" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="transactions" name="Annulations" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="restaurations" name="Restaurations" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Right: Raisons d'archivage & Espace d'archives (span-5) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Raisons d'archivage */}
              <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                  Raisons d&apos;archivage
                </h2>
                <div className="space-y-2 text-xs">
                  {[
                    { reason: 'Vente annulée', count: 86, pct: '32%' },
                    { reason: 'Doublon', count: 72, pct: '27%' },
                    { reason: 'Client inactif', count: 58, pct: '22%' },
                    { reason: 'Erreur de saisie', count: 36, pct: '13%' },
                    { reason: 'Autre', count: 16, pct: '6%' },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-300">{row.reason}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-white">{row.count}</span>
                        <span className="font-mono text-zinc-400 w-8 text-right">{row.pct}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#202028] flex items-center justify-between font-bold text-xs">
                    <span className="text-white">Total</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyan-400">268</span>
                      <span className="font-mono text-cyan-400 w-8 text-right">100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Espace d'archives */}
              <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Espace d&apos;archives</span>
                  </h2>
                  <span className="font-mono text-[10px] text-zinc-400">2.48 GB / 10 GB</span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#202028] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[24.8%]" />
                </div>
                <div className="text-[10px] text-zinc-400 text-right">24.8% utilisés</div>

                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-300 leading-relaxed">
                    <strong>Conservation des données :</strong> Les données archivées sont conservées pendant 5 ans conformément à la réglementation marocaine.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Restaurations récentes matching Reference #38 Screen 1 */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#222228] pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Restaurations récentes
              </h2>
              <button
                onClick={() => setActiveTab('restorations')}
                className="text-[11px] text-red-400 hover:underline"
              >
                Voir tout
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] text-[10px] font-semibold text-zinc-400 uppercase">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Enregistrement</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Restauré par</th>
                    <th className="pb-2 font-mono">Date</th>
                    <th className="pb-2 text-center">Statut</th>
                    <th className="pb-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {[
                    { id: '1', name: 'Toyota Land Cruiser 2021', type: 'Véhicule', by: 'Admin Maalal', date: '30/05/2025 18:45', st: 'Réussi' },
                    { id: '2', name: 'Sarah Benali', type: 'Contact', by: 'Admin Maalal', date: '29/05/2025 16:30', st: 'Réussi' },
                    { id: '3', name: 'Vente #V-2025-0045', type: 'Vente', by: 'Admin Maalal', date: '28/05/2025 09:15', st: 'Réussi' },
                  ].map((r) => (
                    <tr key={r.id} className="hover:bg-[#18181f]">
                      <td className="py-2.5 text-zinc-400 font-mono">{r.id}</td>
                      <td className="py-2.5 font-bold text-white">{r.name}</td>
                      <td className="py-2.5">
                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 border border-zinc-700">
                          {r.type}
                        </span>
                      </td>
                      <td className="py-2.5 text-zinc-300 font-semibold">{r.by}</td>
                      <td className="py-2.5 font-mono text-zinc-400 text-[10px]">{r.date}</td>
                      <td className="py-2.5 text-center">
                        <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                          {r.st}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <button className="p-1 rounded text-zinc-400 hover:text-white">
                          <Eye className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Véhicules archivés matching Reference #38 Screen 2 */}
      {activeTab === 'vehicles' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
            <div className="flex items-center gap-2">
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
              >
                <option value="Toutes">Raison d&apos;archivage : Toutes</option>
                <option value="Vente annulée">Vente annulée</option>
                <option value="Doublon">Doublon</option>
                <option value="Client inactif">Client inactif</option>
                <option value="Erreur de saisie">Erreur de saisie</option>
              </select>

              <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
                <option>Marque : Toutes</option>
                <option>Toyota</option>
                <option>BMW</option>
                <option>Mercedes-Benz</option>
                <option>Audi</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un véhicule..."
                  className="h-8 rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
                <Download className="h-3 w-3 text-zinc-400" />
                <span>Exporter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Véhicule</th>
                  <th className="py-2.5 px-3 font-mono">Plaque</th>
                  <th className="py-2.5 px-3 font-mono">Année</th>
                  <th className="py-2.5 px-3 font-mono">Kilométrage</th>
                  <th className="py-2.5 px-3">Raison</th>
                  <th className="py-2.5 px-3 font-mono">Date d&apos;archivage</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {[
                  { id: 1, car: 'Toyota Land Cruiser 2021', pl: '12345 | T | 2021', yr: '2021', km: '85 400 km', rsn: 'Vente annulée', dt: '30/05/2025 18:30' },
                  { id: 2, car: 'BMW X5 xDrive30d', pl: '67890 | B | 1', yr: '2021', km: '48 230 km', rsn: 'Doublon', dt: '29/05/2025 14:20' },
                  { id: 3, car: 'Mercedes-Benz GLC 200 4MATIC', pl: '54321 | A', yr: '2022', km: '28 900 km', rsn: 'Client inactif', dt: '28/05/2025 11:15' },
                  { id: 4, car: 'Audi Q7 45 TDI', pl: '98765 | T', yr: '2021', km: '61 200 km', rsn: 'Vente annulée', dt: '27/05/2025 09:45' },
                  { id: 5, car: 'Hyundai Tucson 2.0 CRDi', pl: '19283 | 1', yr: '2019', km: '72 120 km', rsn: 'Erreur de saisie', dt: '25/05/2025 16:05' },
                  { id: 6, car: 'Volkswagen Tiguan 2.0 TDI', pl: '45667 | 1', yr: '2020', km: '39 800 km', rsn: 'Doublon', dt: '24/05/2025 10:20' },
                  { id: 7, car: 'Kia Sportage 1.6 CRDi', pl: '66778 | 1', yr: '2018', km: '88 600 km', rsn: 'Client inactif', dt: '23/05/2025 13:10' },
                  { id: 8, car: 'Ford Ranger Wildtrak', pl: '33445 | 1', yr: '2021', km: '55 700 km', rsn: 'Vente annulée', dt: '22/05/2025 09:00' },
                  { id: 9, car: 'Peugeot 3008 1.5 BlueHDi', pl: '77881 | 1', yr: '2021', km: '41 900 km', rsn: 'Doublon', dt: '21/05/2025 15:40' },
                  { id: 10, car: 'Renault Clio 1.5 dCi', pl: '11223 | 1', yr: '2017', km: '120 000 km', rsn: 'Autre', dt: '20/05/2025 11:30' },
                ].map((v) => (
                  <tr key={v.id} className="hover:bg-[#18181f]">
                    <td className="py-2.5 px-3 text-zinc-400 font-mono">{v.id}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{v.car}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300 text-[10px]">{v.pl}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300">{v.yr}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300">{v.km}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[9px] font-bold text-zinc-300 border border-zinc-700">
                        {v.rsn}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{v.dt}</td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/archives/restore?entity=vehicle&id=${v.id}`}
                          className="rounded p-1 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800"
                          title="Restaurer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Link>
                        <button className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800" title="Supprimer">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Contacts archivés matching Reference #38 Screen 3 */}
      {activeTab === 'contacts' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Contacts et fiches clients archivées
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Rechercher un contact..."
                  className="h-8 rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
                <Download className="h-3 w-3 text-zinc-400" />
                <span>Exporter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3 font-mono">Téléphone</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Raison</th>
                  <th className="py-2.5 px-3 font-mono">Date d&apos;archivage</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {[
                  { id: 1, name: 'Sarah Benali', tel: '06 12 34 56 78', mail: 'sarah.benali@email.com', rsn: 'Client inactif', dt: '29/05/2025 16:30' },
                  { id: 2, name: 'Youssef El Idrissi', tel: '06 98 76 54 32', mail: 'youssef.idrissi@email.com', rsn: 'Doublon', dt: '28/05/2025 14:15' },
                  { id: 3, name: 'Omar Bennis', tel: '06 55 44 33 22', mail: 'omar.bennis@email.com', rsn: 'Erreur de saisie', dt: '27/05/2025 11:05' },
                  { id: 4, name: 'Imane Zahiri', tel: '06 22 33 44 55', mail: 'imane.zahiri@email.com', rsn: 'Client inactif', dt: '26/05/2025 10:45' },
                  { id: 5, name: 'Leila El Fassi', tel: '06 77 88 99 00', mail: 'leila.elfassi@email.com', rsn: 'Doublon', dt: '25/05/2025 09:20' },
                  { id: 6, name: 'Nabil El Hariri', tel: '06 44 55 16 11', mail: 'nabil.hariri@email.com', rsn: 'Client inactif', dt: '24/05/2025 14:50' },
                  { id: 7, name: 'Mehdi Raoui', tel: '06 00 11 22 33', mail: 'mehdi.raoui@email.com', rsn: 'Erreur de saisie', dt: '23/05/2025 13:30' },
                  { id: 8, name: 'Karim Talbi', tel: '06 44 58 66 77', mail: 'karim.talbi@email.com', rsn: 'Doublon', dt: '22/05/2025 12:10' },
                  { id: 9, name: 'Nada K.', tel: '06 99 77 66 55', mail: 'nada.k@email.com', rsn: 'Client inactif', dt: '21/05/2025 10:40' },
                  { id: 10, name: 'Yassine Cheribi', tel: '06 33 23 11 00', mail: 'yassine.cheribi@email.com', rsn: 'Client inactif', dt: '20/05/2025 09:40' },
                ].map((c) => (
                  <tr key={c.id} className="hover:bg-[#18181f]">
                    <td className="py-2.5 px-3 text-zinc-400 font-mono">{c.id}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{c.name}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300 text-[10px]">{c.tel}</td>
                    <td className="py-2.5 px-3 text-zinc-300">{c.mail}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[9px] font-bold text-zinc-300 border border-zinc-700">
                        {c.rsn}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{c.dt}</td>
                    <td className="py-2.5 px-3 text-center">
                      <Link
                        href={`/archives/restore?entity=contact&id=${c.id}`}
                        className="rounded p-1 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 inline-block"
                        title="Restaurer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Ventes archivées matching Reference #38 Screen 4 */}
      {activeTab === 'sales' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Ventes archivées et transactions annulées
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Rechercher une vente..."
                className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
                <Download className="h-3 w-3 text-zinc-400" />
                <span>Exporter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Référence</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 font-mono text-right">Montant</th>
                  <th className="py-2.5 px-3">Raison d&apos;annulation</th>
                  <th className="py-2.5 px-3 font-mono">Date</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {[
                  { id: 1, ref: 'V-2025-0056', cli: 'Sarah Benali', tp: 'Vente', amt: 86500, rsn: 'Désistement client', dt: '30/05/2025' },
                  { id: 2, r: 'V-2025-0055', cli: 'Youssef El Idrissi', tp: 'Vente', amt: 62900, rsn: 'Financement refusé', dt: '29/05/2025' },
                  { id: 3, ref: 'V-2025-0051', cli: 'Omar Bennis', tp: 'Vente', amt: 21500, rsn: 'Changement d’avis', dt: '28/05/2025' },
                  { id: 4, ref: 'V-2025-0048', cli: 'Imane Zahiri', tp: 'Vente', amt: 49400, rsn: 'Véhicule non dispo', dt: '27/05/2025' },
                  { id: 5, ref: 'V-2025-0046', cli: 'Karim Talbi', tp: 'Vente', amt: 29900, rsn: 'Désistement client', dt: '26/05/2025' },
                  { id: 6, ref: 'V-2025-0042', cli: 'Nabil El Hariri', tp: 'Vente', amt: 18750, rsn: 'Financement refusé', dt: '25/05/2025' },
                  { id: 7, ref: 'V-2025-0040', cli: 'Mehdi Raoui', tp: 'Vente', amt: 22700, rsn: 'Changement d’avis', dt: '24/05/2025' },
                  { id: 8, ref: 'V-2025-0038', cli: 'Leila El Fassi', tp: 'Vente', amt: 15400, rsn: 'Désistement client', dt: '23/05/2025' },
                  { id: 9, ref: 'V-2025-0031', cli: 'Ayoub Hmidat', tp: 'Vente', amt: 29900, rsn: 'Véhicule non dispo', dt: '22/05/2025' },
                  { id: 10, ref: 'V-2025-0027', cli: 'Oumnia El Amrani', tp: 'Vente', amt: 20100, rsn: 'Financement refusé', dt: '21/05/2025' },
                ].map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#18181f]">
                    <td className="py-2.5 px-3 text-zinc-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-white">{s.ref || `V-2025-00${50 - idx}`}</td>
                    <td className="py-2.5 px-3 text-zinc-200 font-semibold">{s.cli}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{s.tp}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-white text-right">
                      {s.amt.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="py-2.5 px-3 text-red-400 font-medium">{s.rsn}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{s.dt}</td>
                    <td className="py-2.5 px-3 text-center">
                      <Link
                        href={`/archives/restore?entity=sale&id=${s.ref || idx}`}
                        className="rounded p-1 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 inline-block"
                        title="Restaurer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Restaurations récentes */}
      {activeTab === 'restorations' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Journal complet des restaurations effectuées
          </h2>
          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Élément</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Restauré par</th>
                  <th className="py-2.5 px-3 font-mono">Date</th>
                  <th className="py-2.5 px-3 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {[
                  { id: 1, name: 'Toyota Land Cruiser 2021', type: 'Véhicule', by: 'Admin Maalal', date: '30/05/2025 18:45', st: 'Réussi' },
                  { id: 2, name: 'Sarah Benali', type: 'Contact', by: 'Admin Maalal', date: '29/05/2025 16:30', st: 'Réussi' },
                  { id: 3, name: 'Vente #V-2025-0045', type: 'Vente', by: 'Admin Maalal', date: '28/05/2025 09:15', st: 'Réussi' },
                ].map((item) => (
                  <tr key={item.id} className="hover:bg-[#18181f]">
                    <td className="py-2.5 px-3 text-zinc-400 font-mono">{item.id}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{item.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 border border-zinc-700">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300 font-semibold">{item.by}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{item.date}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                        {item.st}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ArchivesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement des archives...</div>}>
      <ArchivesContent />
    </Suspense>
  )
}
