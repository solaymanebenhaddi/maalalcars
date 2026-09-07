import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Filter,
  Download,
  Link as LinkIcon,
  Car,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface SupplyVehicle {
  id: number
  vehicle: string
  year: number
  mileage: string
  price: string
  status: 'En stock' | 'Réservé' | 'Vendu'
  date: string
}

const SUPPLIES: SupplyVehicle[] = [
  { id: 1, vehicle: 'Toyota Land Cruiser VX-R', year: 2023, mileage: '12 450 km', price: '435 000 DH', status: 'En stock', date: '30/05/2025' },
  { id: 2, vehicle: 'BMW X5 xDrive30d', year: 2021, mileage: '45 230 km', price: '365 000 DH', status: 'Réservé', date: '29/05/2025' },
  { id: 3, vehicle: 'Mercedes-Benz GLC 200', year: 2022, mileage: '28 900 km', price: '295 000 DH', status: 'En stock', date: '28/05/2025' },
  { id: 4, vehicle: 'Audi A6 40 TDI', year: 2020, mileage: '61 300 km', price: '185 000 DH', status: 'Vendu', date: '27/05/2025' },
  { id: 5, vehicle: 'Hyundai Tucson 2.0 CRDi', year: 2021, mileage: '33 100 km', price: '142 000 DH', status: 'En stock', date: '26/05/2025' },
]

export default async function SellerSuppliesPage({ params }: Props) {
  const { id } = await params
  const code = id || 'VEN-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/sellers/${code}`}
          className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au dossier</span>
        </Link>
      </div>

      {/* Main Container matching Reference #15 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-4">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
              Approvisionnements de Youssef El Idrissi
            </h1>
            <p className="text-xs text-zinc-400">
              Liste des véhicules fournis par ce vendeur
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <span>Filtres</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs matching Reference #15 Screen 4 */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Tous (32)</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">
            En stock (18)
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">
            Vendus (12)
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">
            Réservés (2)
          </button>
        </div>

        {/* Vehicle Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Véhicule</th>
                <th className="py-2.5 px-3">Année</th>
                <th className="py-2.5 px-3 font-mono">Kilométrage</th>
                <th className="py-2.5 px-3 text-right">Achat (DH)</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 font-mono">Date d&apos;achat</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {SUPPLIES.map((s) => (
                <tr key={s.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{s.id}</td>
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <Car className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{s.vehicle}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">{s.year}</td>
                  <td className="py-3 px-3 font-mono text-zinc-400">{s.mileage}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {s.price}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        s.status === 'En stock'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : s.status === 'Réservé'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{s.date}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      title="Lien"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>5 résultats</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ‹
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
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              9
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
