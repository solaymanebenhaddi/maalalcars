'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Send,
  History,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const MONTHLY_COMMISSIONS = [
  { month: 'Jan', paid: 6500, pending: 0 },
  { month: 'Fév', paid: 8200, pending: 1500 },
  { month: 'Mar', paid: 11400, pending: 2100 },
  { month: 'Avr', paid: 13900, pending: 3200 },
  { month: 'Mai', paid: 6000, pending: 5650 },
]

export default function CommissionerCommissionsPage() {
  const params = useParams()
  const code = (params?.id as string) || 'COM-00048'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/commissioners/${code}`}
          className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour Yassine Benali</span>
        </Link>
      </div>

      {/* Main Container matching Reference #16 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Commissions — En attente vs Payées
          </h1>
          <p className="text-xs text-zinc-400">
            Suivi financier et bordereaux de commissions pour Yassine Benali
          </p>
        </div>

        {/* 4 Top KPI Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">Commissions totales</div>
            <div className="font-mono font-black text-white text-base">58 450 DH</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">Commissions payées</div>
            <div className="font-mono font-black text-cyan-400 text-base">46 000 DH</div>
            <div className="text-[10px] text-zinc-500 font-mono">78,7% du total</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">En attente de paiement</div>
            <div className="font-mono font-black text-red-400 text-base">12 450 DH</div>
            <div className="text-[10px] text-zinc-500 font-mono">21,3% du total</div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">Prochain paiement</div>
            <div className="font-mono font-black text-white text-base">15/06/2025</div>
          </div>
        </div>

        {/* 2 Columns: Monthly Bar Chart + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          {/* Monthly Bar Chart (2 cols wide) */}
          <div className="lg:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[280px]">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Évolution des commissions (DH)</h3>
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="text-zinc-400">Payées</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-zinc-400">En attente</span>
                </div>
              </div>
            </div>

            <div className="w-full flex-1 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_COMMISSIONS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#202028" vertical={false} />
                  <XAxis dataKey="month" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl">
                            <div className="font-bold text-white">{label} 2025</div>
                            <div className="text-cyan-400 font-mono">Payées : {payload[0]?.value?.toLocaleString('fr-FR')} DH</div>
                            <div className="text-red-400 font-mono">En attente : {payload[1]?.value?.toLocaleString('fr-FR')} DH</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="paid" fill="#06b6d4" radius={[3, 3, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="pending" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Details Panel (1 col wide) */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[280px]">
            <div className="border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Détails des commissions</h3>
            </div>

            <div className="space-y-2.5 text-[11px] py-1">
              <div className="flex justify-between border-b border-[#202028] pb-1.5">
                <span className="text-zinc-400">Taux de commission</span>
                <span className="font-mono font-bold text-emerald-400">4,85%</span>
              </div>
              <div className="flex justify-between border-b border-[#202028] pb-1.5">
                <span className="text-zinc-400">Montant total des ventes</span>
                <span className="font-mono font-bold text-white">5 845 000 DH</span>
              </div>
              <div className="flex justify-between border-b border-[#202028] pb-1.5">
                <span className="text-zinc-400">Nombre de transactions</span>
                <span className="font-mono font-bold text-white">26</span>
              </div>
              <div className="flex justify-between border-b border-[#202028] pb-1.5">
                <span className="text-zinc-400">Panier moyen</span>
                <span className="font-mono font-bold text-white">224 808 DH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Dernier paiement reçu</span>
                <span className="font-mono text-zinc-300">28/05/2025</span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 text-center">
              Virement bancaire automatique le 15 de chaque mois.
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
            <History className="h-3.5 w-3.5 text-zinc-400" />
            <span>Historique des paiements</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <Send className="h-3.5 w-3.5" />
            <span>Demander un paiement</span>
          </button>
        </div>
      </div>
    </div>
  )
}
