'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Plus,
  Download,
  Eye,
  Camera,
  GitCompare,
  RotateCcw,
} from 'lucide-react'
import { EvaluationsStatusDonut } from './evaluations-status-donut'
import { EvaluationsDailyChart } from './evaluations-daily-chart'
import { EvaluationsScoreBars } from './evaluations-score-bars'

interface EvaluationRow {
  id: number
  code: string
  vehicle: string
  matricule: string
  vin: string
  client: string
  inspector: string
  date: string
  score: number
  status: 'Validée' | 'À revoir' | 'Non conforme' | 'En attente'
  statusColor: string
}

const EVALUATIONS: EvaluationRow[] = [
  {
    id: 1,
    code: 'EVAL-2025-0128',
    vehicle: 'BMW Série 3 (2021 • Berline)',
    matricule: 'AA-123-BB',
    vin: 'WBA5R31070FK12345',
    client: 'Michel Dupont',
    inspector: 'Yacine Benali',
    date: '28/05/2025 14:32',
    score: 86,
    status: 'Validée',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 2,
    code: 'EVAL-2025-0127',
    vehicle: 'Mercedes Classe C (2020 • Berline)',
    matricule: 'AB-456-CD',
    vin: 'W1K2050771F123456',
    client: 'Sara Martin',
    inspector: 'Karim Leblanc',
    date: '28/05/2025 11:08',
    score: 72,
    status: 'À revoir',
    statusColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  {
    id: 3,
    code: 'EVAL-2025-0126',
    vehicle: 'Audi A4 (2019 • Berline)',
    matricule: 'AC-789-EF',
    vin: 'WAUZZZF40KA123789',
    client: 'Sofiane Ait',
    inspector: 'Yacine Benali',
    date: '27/05/2025 16:45',
    score: 48,
    status: 'Non conforme',
    statusColor: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  {
    id: 4,
    code: 'EVAL-2025-0125',
    vehicle: 'Peugeot 3008 (2022 • SUV)',
    matricule: 'AD-012-GH',
    vin: 'VF3MCYHZRNL012345',
    client: 'Nadia Hamdi',
    inspector: 'Lynda Karim',
    date: '27/05/2025 09:21',
    score: 91,
    status: 'Validée',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
]

export function EvaluationsDashboardClient() {
  const [search, setSearch] = useState('')

  const filteredEvaluations = EVALUATIONS.filter(
    (e) =>
      e.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      e.matricule.toLowerCase().includes(search.toLowerCase()) ||
      e.client.toLowerCase().includes(search.toLowerCase()) ||
      e.inspector.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #25 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Évaluations Véhicule — Tableau de bord / Liste
          </h1>
          <p className="text-xs text-zinc-400">
            Aperçu des inspections &amp; contrôles techniques
          </p>
        </div>

        <Link
          href="/evaluations/new"
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nouvelle évaluation</span>
        </Link>
      </div>

      {/* 6 KPI Cards matching Reference #25 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Évaluations totales */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Évaluations totales</span>
            <ClipboardCheck className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            1 248
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            ↑ 18,7% ce mois
          </div>
        </div>

        {/* Évaluations ce mois */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Évaluations ce mois</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono font-black text-emerald-400 text-base sm:text-lg">
            128
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 14,6% vs mois dernier
          </div>
        </div>

        {/* Score moyen global */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Score moyen global</span>
            <span className="font-bold text-amber-400 text-[10px]">★</span>
          </div>
          <div className="mt-2 font-mono font-black text-amber-400 text-base sm:text-lg">
            78 <span className="text-xs text-zinc-400 font-normal">/100</span>
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 6,2 pts vs mois dernier
          </div>
        </div>

        {/* Véhicules conformes */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Véhicules conformes</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            92
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 6,2% ce mois
          </div>
        </div>

        {/* À revoir / Non conformes */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>À revoir / Non conf.</span>
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
          </div>
          <div className="mt-2 font-mono font-black text-red-400 text-base sm:text-lg">
            36
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            ↓ 5,1% ce mois
          </div>
        </div>

        {/* En attente de validation */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>En attente validation</span>
            <Clock className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-2 font-mono font-black text-amber-400 text-base sm:text-lg">
            18
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 2,3% ce mois
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-wide">
            Filtres avancés
          </h3>
          <button className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white">
            <RotateCcw className="h-3 w-3" />
            <span>Réinitialiser</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les statuts</option>
            <option>Validée</option>
            <option>À revoir</option>
            <option>Non conforme</option>
            <option>En attente</option>
          </select>

          <input
            type="text"
            defaultValue="01/05/2025 - 31/05/2025"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Toutes les marques</option>
            <option>BMW</option>
            <option>Mercedes-Benz</option>
            <option>Audi</option>
            <option>Peugeot</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les modèles</option>
            <option>Série 3</option>
            <option>Classe C</option>
            <option>A4</option>
            <option>3008</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les inspecteurs</option>
            <option>Yacine Benali</option>
            <option>Karim Leblanc</option>
            <option>Lynda Karim</option>
          </select>

          <div className="flex items-center gap-1">
            <select className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
              <option>Tous les scores</option>
              <option>&gt; 90 (Excellent)</option>
              <option>75 - 89 (Bon)</option>
              <option>&lt; 50 (Critique)</option>
            </select>
            <button className="h-8 px-3 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-700">
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* 3 Middle Charts matching Reference #25 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <EvaluationsStatusDonut />
        <EvaluationsDailyChart />
        <EvaluationsScoreBars />
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white">
              Liste des évaluations (1 248)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une évaluation..."
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Table matching Reference #25 Screen 1 */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">#</th>
                <th className="py-2.5 px-3">Véhicule</th>
                <th className="py-2.5 px-3">Immatriculation / VIN</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Inspecteur</th>
                <th className="py-2.5 px-3 font-mono">Date d&apos;évaluation</th>
                <th className="py-2.5 px-3 text-center font-mono">Score</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredEvaluations.map((e) => (
                <tr key={e.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-mono text-zinc-500">{e.id}</td>
                  <td className="py-3 px-3 font-semibold text-white">
                    <Link href={`/evaluations/${e.code}`} className="hover:text-red-400">
                      {e.vehicle}
                    </Link>
                  </td>
                  <td className="py-3 px-3 space-y-0.5">
                    <div className="font-mono font-bold text-zinc-200">{e.matricule}</div>
                    <div className="font-mono text-[10px] text-zinc-500">{e.vin}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-white">{e.client}</td>
                  <td className="py-3 px-3 text-zinc-300">{e.inspector}</td>
                  <td className="py-3 px-3 font-mono text-zinc-400 text-[11px]">{e.date}</td>
                  <td className="py-3 px-3 text-center font-mono">
                    <div className="inline-flex items-center gap-1 font-bold">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          e.score >= 80 ? 'bg-emerald-400' : e.score >= 60 ? 'bg-amber-400' : 'bg-red-400'
                        }`}
                      />
                      <span className="text-white text-xs">{e.score}/100</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${e.statusColor}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/evaluations/${e.code}`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Détail du rapport"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/evaluations/${e.code}/photos`}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                        title="Photos & Dommages"
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/evaluations/${e.code}/compare`}
                        className="rounded p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800"
                        title="Comparatif Avant / Après"
                      >
                        <GitCompare className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 4 sur 1 248 évaluations</span>
          <div className="flex items-center gap-1">
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
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              125
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
