'use client'

import React from 'react'
import Link from 'next/link'
import {
  Receipt,
  TrendingUp,
  Wallet,
  Clock,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  Pencil,
  FileText,
} from 'lucide-react'
import { ExpenseEvolutionChart } from './expense-evolution-chart'
import { ExpenseCategoryDonut } from './expense-category-donut'

export interface ExpenseItem {
  id: string
  code: string
  label: string
  categoryName: string
  categoryColor: string
  supplierName: string
  vehicleName: string
  amountTTC: number
  status: 'PAID' | 'PENDING' | 'REJECTED'
  expenseDateFormatted: string
}

interface Props {
  recentExpenses: ExpenseItem[]
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Transport: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  Préparation: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  Atelier: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Marketing: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  Administratif: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  Autres: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
}

export function ExpensesDashboardClient({ recentExpenses }: Props) {
  return (
    <div className="space-y-4 text-xs text-white">
      {/* Top Header matching Reference #12 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Dépenses — Tableau de bord
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">
            Pilotez et maîtrisez toutes vos dépenses en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/expenses/recurring"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span>Récurrentes / Validation</span>
          </Link>

          <Link
            href="/expenses/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Ajouter une dépense</span>
          </Link>
        </div>
      </div>

      {/* 6 Top KPI Summary Cards matching Reference #12 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* KPI 1: Total dépenses */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Total dépenses</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-400">
              <Receipt className="h-3 w-3" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">24 700 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>12,4% ce mois</span>
          </div>
        </div>

        {/* KPI 2: Moyenne mensuelle */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Moyenne mensuelle</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="h-3 w-3" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">20 580 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>8,7% vs mois dernier</span>
          </div>
        </div>

        {/* KPI 3: Budget mensuel */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Budget mensuel</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-400">
              <Wallet className="h-3 w-3" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">30 000 DH</div>
          <div className="space-y-1">
            <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full bg-red-500 w-[83%]" />
            </div>
            <span className="text-[10px] text-red-400 font-bold block">83% utilisé</span>
          </div>
        </div>

        {/* KPI 4: Dépenses à venir */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Dépenses à venir</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-purple-500/30 bg-purple-500/10 text-purple-400">
              <Clock className="h-3 w-3" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">4 250 DH</div>
          <div className="text-[10px] text-zinc-400 font-medium">3 échéances</div>
        </div>

        {/* KPI 5: TVA déductible */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">TVA déductible</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-pink-500/30 bg-pink-500/10 text-pink-400">
              <FileText className="h-3 w-3" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">4 150 DH</div>
          <div className="text-[10px] text-zinc-400 font-medium">16,8% du total</div>
        </div>

        {/* KPI 6: Économies réalisées */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Économies réalisées</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="h-3 w-3" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">2 340 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>18,6% ce mois</span>
          </div>
        </div>
      </div>

      {/* Middle Section (3 Columns) matching Reference #12 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Column 1 (5 cols): Évolution des dépenses */}
        <div className="lg:col-span-5 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2">
            <span className="font-bold text-white text-xs">Évolution des dépenses</span>
            <select className="h-6 rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-zinc-300 focus:outline-none">
              <option>12 derniers mois ⌄</option>
              <option>6 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <ExpenseEvolutionChart />
        </div>

        {/* Column 2 (4 cols): Répartition par catégorie */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2">
            <span className="font-bold text-white text-xs">Répartition par catégorie</span>
            <select className="h-6 rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-zinc-300 focus:outline-none">
              <option>Ce mois ⌄</option>
              <option>Mois dernier</option>
              <option>Cette année</option>
            </select>
          </div>
          <ExpenseCategoryDonut />
        </div>

        {/* Column 3 (3 cols): Stacked Alertes & Résumé budgétaire */}
        <div className="lg:col-span-3 space-y-3">
          {/* Top Widget: Alertes & rappels */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between border-b border-[#222228] pb-1.5">
              <span className="font-bold text-white text-xs">Alertes & rappels</span>
              <select className="h-5 rounded border border-[#282834] bg-[#18181f] px-1.5 text-[9px] text-zinc-300 focus:outline-none">
                <option>Ce mois ⌄</option>
              </select>
            </div>

            <div className="space-y-2 text-[11px]">
              {/* Alert 1 */}
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/5 p-2">
                <Receipt className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">3 factures à payer</div>
                  <div className="text-[10px] text-zinc-400">Échéance dans les 7 prochains jours</div>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">
                <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">2 dépenses récurrentes en attente</div>
                  <div className="text-[10px] text-zinc-400">À valider pour ce mois</div>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/5 p-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Budget Transport dépassé</div>
                  <div className="text-[10px] text-zinc-400">Dépensé : 3 250 DH / Budget : 3 000 DH</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Widget: Résumé budgétaire */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between border-b border-[#222228] pb-1.5">
              <span className="font-bold text-white text-xs">Résumé budgétaire</span>
              <select className="h-5 rounded border border-[#282834] bg-[#18181f] px-1.5 text-[9px] text-zinc-300 focus:outline-none">
                <option>Ce mois ⌄</option>
              </select>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400">Budget : 30 000 DH</span>
                <span className="font-bold text-red-400">83% utilisé</span>
              </div>

              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-500 w-[83%]" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-lg font-black font-mono text-white">24 700 DH</div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-[#1e1e24] pt-1.5">
                <span>Dépensé : 24 700 DH</span>
                <span>Restant : <strong className="text-emerald-400">5 300 DH</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Dépenses récentes matching Reference #12 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-[#222228] pb-2">
          <span className="font-bold text-white text-xs">Dépenses récentes</span>
          <Link
            href="/expenses/list"
            className="text-[11px] font-semibold text-zinc-400 hover:text-white"
          >
            Voir toutes les dépenses →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Libellé</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Fournisseur</th>
                <th className="py-2.5 px-3">Véhicule / Projet</th>
                <th className="py-2.5 px-3 text-right">Montant TTC</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {recentExpenses.slice(0, 5).map((exp, idx) => {
                const catStyle =
                  CATEGORY_COLORS[exp.categoryName] || CATEGORY_COLORS['Autres']
                return (
                  <tr key={exp.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-2.5 px-3 text-zinc-500 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">
                      {exp.expenseDateFormatted}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-white">
                      <Link
                        href={`/expenses/${exp.code}`}
                        className="hover:text-red-400 transition-colors"
                      >
                        {exp.label}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                      >
                        {exp.categoryName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300">{exp.supplierName}</td>
                    <td className="py-2.5 px-3 text-zinc-300 font-medium">{exp.vehicleName}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                      {exp.amountTTC.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                          exp.status === 'PAID'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {exp.status === 'PAID' ? 'Payée' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <Link
                        href={`/expenses/${exp.code}`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Voir / Modifier"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#222228]">
          <Link
            href="/expenses/list"
            className="text-[11px] text-zinc-400 hover:text-white"
          >
            Voir toutes les dépenses
          </Link>

          <Link
            href="/expenses/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Ajouter une dépense</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
