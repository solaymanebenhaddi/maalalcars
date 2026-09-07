import React from 'react'
import Link from 'next/link'
import {
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Currency } from '@/components/shared/currency'
import { vehicleRepository } from '@/repositories/vehicle.repository'

export const dynamic = 'force-dynamic'

export default async function StockAgingPage() {
  const stockAging = await vehicleRepository.getStockAging()

  type StockAgingVehicles = Awaited<ReturnType<typeof vehicleRepository.getStockAging>>['buckets']['under30']

  const renderVehicleTable = (vehicles: StockAgingVehicles, colorClass: string, label: string) => {
    return (
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
            <h3 className="text-sm font-bold text-white">
              Tranche : {label} ({vehicles.length} véhicules)
            </h3>
          </div>
          <span className="text-xs font-semibold text-zinc-400">
            Total Valeur : <Currency amount={vehicles.reduce((sum, v) => sum + v.targetSalePrice, 0)} />
          </span>
        </div>

        {vehicles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222228] text-[11px] font-semibold text-zinc-400">
                  <th className="pb-2">Réf.</th>
                  <th className="pb-2">Marque & Modèle</th>
                  <th className="pb-2">Date d’entrée</th>
                  <th className="pb-2 text-center">Âge Stock</th>
                  <th className="pb-2 text-right">Prix Achat</th>
                  <th className="pb-2 text-right">Prix Cible</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-3 font-mono font-semibold text-white">{v.code}</td>
                    <td className="py-3 font-medium text-zinc-200">
                      {v.brand} {v.model} ({v.year})
                    </td>
                    <td className="py-3 text-zinc-400">{new Date(v.entryDate).toLocaleDateString('fr-MA')}</td>
                    <td className="py-3 text-center">
                      <span className="rounded-full bg-black/60 px-2.5 py-0.5 font-mono text-[11px] font-bold border border-zinc-700">
                        {v.ageDays} jours
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-zinc-400">
                      <Currency amount={v.purchasePrice} />
                    </td>
                    <td className="py-3 text-right font-mono text-cyan-400 font-bold">
                      <Currency amount={v.targetSalePrice} />
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/vehicles/${v.id}`}
                        className="rounded-md bg-[#1c1c24] px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Voir Fiche
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-zinc-500">
            Aucun véhicule dans cette tranche d’ancienneté.
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analyse du Vieillissement de Stock (Aging)"
        subtitle="Contrôle précis de la durée d’immobilisation des véhicules pour optimiser la rotation du capital"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Stock', href: '/stock' },
          { label: 'Vieillissement (Aging)' },
        ]}
      />

      {/* Stock Aging Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-emerald-500/30 bg-[#121216] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">0 - 30 Jours</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {stockAging.buckets.under30.length} <span className="text-xs font-normal text-zinc-400">véhicules</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">Rotation excellente</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#121216] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400">31 - 60 Jours</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {stockAging.buckets.between31and60.length} <span className="text-xs font-normal text-zinc-400">véhicules</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">Rotation standard</p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-[#121216] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">61 - 90 Jours</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {stockAging.buckets.between61and90.length} <span className="text-xs font-normal text-zinc-400">véhicules</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">À surveiller</p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-[#121216] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400">+ 90 Jours (Critique)</span>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {stockAging.buckets.over90.length} <span className="text-xs font-normal text-zinc-400">véhicules</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">Alerte déstockage actif</p>
        </div>
      </div>

      {/* Tables for each Aging Bracket */}
      <div className="space-y-6">
        {renderVehicleTable(stockAging.buckets.over90, 'bg-red-500', '+ 90 Jours (Stock Ancien)')}
        {renderVehicleTable(stockAging.buckets.between61and90, 'bg-amber-500', '61 - 90 Jours')}
        {renderVehicleTable(stockAging.buckets.between31and60, 'bg-cyan-500', '31 - 60 Jours')}
        {renderVehicleTable(stockAging.buckets.under30, 'bg-emerald-500', '0 - 30 Jours (Stock Frais)')}
      </div>
    </div>
  )
}
