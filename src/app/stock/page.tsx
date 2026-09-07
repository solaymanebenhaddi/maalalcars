import React from 'react'
import Link from 'next/link'
import {
  Boxes,
  Clock,
  Car,
  MapPin,
  Calendar,
  Building2,
  Layers,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Currency } from '@/components/shared/currency'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { parkRepository } from '@/repositories/park.repository'

export const dynamic = 'force-dynamic'

export default async function StockPage() {
  const [stockAging, counts, parks] = await Promise.all([
    vehicleRepository.getStockAging(),
    vehicleRepository.countByStatus(),
    parkRepository.getAll(),
  ])

  // Calculate body types breakdown
  const bodyTypes: Record<string, { count: number; value: number }> = {}
  for (const v of stockAging.vehicles) {
    const bt = v.bodyType || 'Autre'
    if (!bodyTypes[bt]) bodyTypes[bt] = { count: 0, value: 0 }
    bodyTypes[bt].count += 1
    bodyTypes[bt].value += v.targetSalePrice
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock & Inventaire Automobile"
        subtitle="Valorisation du capital immobilisé, répartition géographique et analyse du parc"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Stock' }]}
        primaryAction={{
          label: 'Analyse du Vieillissement',
          href: '/stock/aging',
          icon: Clock,
        }}
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Valeur Totale du Stock (Achat + Frais)"
          value={<Currency amount={stockAging.totalStockValue} />}
          trend={{ value: `${stockAging.totalCount} véhicules`, direction: 'neutral', label: 'en inventaire' }}
          icon={Boxes}
          iconColor="purple"
        />

        <StatCard
          title="Véhicules Disponibles Immédiats"
          value={counts.inStock}
          trend={{ value: 'Prêts à la vente', direction: 'up', label: 'en showroom' }}
          icon={Car}
          iconColor="green"
        />

        <StatCard
          title="Véhicules sous Réservation"
          value={counts.reserved}
          trend={{ value: 'Acomptes versés', direction: 'neutral', label: 'en cours de finalisation' }}
          icon={Calendar}
          iconColor="amber"
        />

        <StatCard
          title="Véhicules en Atelier / Prépa"
          value={counts.workshop}
          trend={{ value: 'Contrôle & Esthétique', direction: 'down', label: 'avant exposition' }}
          icon={Layers}
          iconColor="cyan"
        />
      </div>

      {/* Breakdown by Category & Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Table */}
        <div className="lg:col-span-2 rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-3 mb-4">
            Répartition du Stock par Catégorie de Carrosserie
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222228] text-[11px] font-semibold text-zinc-400">
                  <th className="pb-2.5">Catégorie</th>
                  <th className="pb-2.5 text-center">Quantité</th>
                  <th className="pb-2.5 text-right">Valeur Estimée Vente</th>
                  <th className="pb-2.5 text-right">% du Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {Object.entries(bodyTypes).map(([cat, data]) => {
                  const percent = stockAging.totalCount > 0 ? Math.round((data.count / stockAging.totalCount) * 100) : 0
                  return (
                    <tr key={cat} className="hover:bg-[#18181f]">
                      <td className="py-3 font-semibold text-white">{cat}</td>
                      <td className="py-3 text-center font-mono">{data.count}</td>
                      <td className="py-3 text-right font-mono text-cyan-400 font-bold">
                        <Currency amount={data.value} />
                      </td>
                      <td className="py-3 text-right">
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/20">
                          {percent}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Showrooms & Real Parcs */}
        <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#222228] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <span>Réseau des Parcs Automobiles ({parks.length})</span>
            </h3>
            <Link
              href="/parks"
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
            >
              <span>Gérer les Parcs</span>
            </Link>
          </div>

          <div className="space-y-3">
            {parks.map((park) => (
              <div key={park.id} className="rounded-xl border border-[#222228] bg-[#16161c] p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="font-bold text-white">{park.name}</span>
                  </div>
                  <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                    📍 {park.city}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>
                    Occupation : <strong className="text-white">{park.totalVehicles}</strong> / {park.capacity} places ({park.occupancyRate}%)
                  </span>
                  <span className="text-cyan-400 font-mono font-bold">
                    <Currency amount={park.totalStockValue} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
