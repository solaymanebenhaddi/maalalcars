import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Car,
  Plus,
  Filter,
  Eye,
  CalendarDays,
  Wrench,
  BadgePercent,
  CheckCircle2,
  FileText,
  Search,
  MapPin,
  Building2,
  FileSpreadsheet,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Currency } from '@/components/shared/currency'
import { EmptyState } from '@/components/shared/empty-state'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { parkRepository } from '@/repositories/park.repository'
import { vehicleStateMachine } from '@/services/vehicle-state-machine.service'
import { VehicleCardWrapper } from '@/components/vehicles/vehicle-card-wrapper'
import { RestoreVehicleButton } from '@/components/vehicles/restore-vehicle-button'
import { getActiveUserRole } from '@/lib/auth-roles'
import clsx from 'clsx'

import { VehiclesPageActions } from '@/components/vehicles/vehicles-page-actions'
import prisma from '@/lib/db'
import { requireAuth } from '@/lib/session'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    brand?: string
    status?: string
    fuelType?: string
    parkId?: string
    park?: string
    search?: string
  }>
}

export default async function VehiclesPage({ searchParams }: Props) {
  await requireAuth()

  // Preemptively expire reservations
  await vehicleStateMachine.expireDueReservations()

  const activeUser = await getActiveUserRole()
  const params = await searchParams
  const activeStatus = params.status || 'Tous'

  // Fetch parks for multi-park filtering
  const allParks = await parkRepository.getAll()
  let activeParkId = params.parkId
  if (!activeParkId && params.park) {
    const matched = allParks.find(
      (p) =>
        p.city.toLowerCase() === params.park?.toLowerCase() ||
        p.code.toLowerCase() === params.park?.toLowerCase() ||
        p.name.toLowerCase().includes(params.park?.toLowerCase() || '')
    )
    if (matched) activeParkId = matched.id
  }

  const vehicles = await vehicleRepository.getAll({
    brand: params.brand,
    status: activeStatus === 'Tous' ? undefined : activeStatus,
    fuelType: params.fuelType,
    parkId: activeParkId,
    search: params.search,
  })

  const counts = await vehicleRepository.countByStatus()
  const distinctBrands = await prisma.vehicle.findMany({
    where: { archivedAt: null, status: { not: 'ARCHIVED' } },
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' },
  })
  const brands = ['Toutes', ...distinctBrands.map((v) => v.brand)]

  const statusTabs = [
    { label: 'Tous (En stock)', value: 'Tous', count: counts.total, color: 'text-zinc-300' },
    { label: 'En stock', value: 'IN_STOCK', count: counts.inStock, color: 'text-emerald-400' },
    { label: 'Réservés', value: 'RESERVED', count: counts.reserved, color: 'text-amber-400' },
    { label: 'En réparation', value: 'WORKSHOP', count: counts.workshop, color: 'text-purple-400' },
    { label: 'Archivés (Vendus & Retirés)', value: 'ARCHIVED', count: counts.archived, color: 'text-zinc-400' },
  ]

  const buildQueryUrl = (newParams: Record<string, string | undefined>) => {
    const q = new URLSearchParams()
    if (activeStatus !== 'Tous') q.set('status', activeStatus)
    if (params.brand && params.brand !== 'Toutes') q.set('brand', params.brand)
    if (params.fuelType && params.fuelType !== 'Tous') q.set('fuelType', params.fuelType)
    if (activeParkId) q.set('parkId', activeParkId)
    if (params.search) q.set('search', params.search)

    for (const [k, v] of Object.entries(newParams)) {
      if (!v || v === 'Tous' || v === 'Toutes') {
        q.delete(k)
      } else {
        q.set(k, v)
      }
    }

    const str = q.toString()
    return `/vehicles${str ? `?${str}` : ''}`
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parc Automobile — Gestion des Véhicules"
        subtitle="Catalogue complet du parc : disponibilité, réservations, réparations et ventes"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Véhicules' }]}
        actions={
          <Link
            href="/vehicles/import"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Import Groupé (.xsl)</span>
          </Link>
        }
        primaryAction={{
          label: 'Ajouter un véhicule',
          href: '/vehicles/new',
          icon: Plus,
        }}
      />

      {/* Multi-Park Filter Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-[#121216] border border-[#222228] p-2.5 rounded-2xl shadow-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-2 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-red-500" />
          <span>Site / Parc :</span>
        </span>

        <Link
          href={buildQueryUrl({ parkId: undefined, park: undefined })}
          className={clsx(
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
            !activeParkId
              ? 'bg-zinc-200 text-black font-bold shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          )}
        >
          Tous les Parcs ({counts.total})
        </Link>

        {allParks.map((p) => {
          const isSelected = activeParkId === p.id
          return (
            <Link
              key={p.id}
              href={buildQueryUrl({ parkId: p.id, park: undefined })}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                isSelected
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              )}
            >
              <span>📍 {p.city} ({p.name.split('—')[0].trim()})</span>
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-mono',
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#1e1e26] text-zinc-400'
                )}
              >
                {p.totalVehicles}
              </span>
            </Link>
          )
        })}

        <Link
          href="/parks"
          className="ml-auto text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600/10 border border-red-500/20 transition-colors"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Gérer le Réseau des Parcs</span>
        </Link>
      </div>

      {/* Tab-based status filtering + Advanced Filters and Export Modal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => {
            const isActive = activeStatus === tab.value
            const href = buildQueryUrl({ status: tab.value })

            return (
              <Link
                key={tab.value}
                href={href}
                className={clsx(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all',
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
                    : 'bg-[#121216] text-zinc-400 border border-[#222228] hover:bg-[#181820] hover:text-zinc-200'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={clsx(
                    'rounded-full px-2 py-0.5 text-[10px] font-mono font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#1e1e26] text-zinc-400'
                  )}
                >
                  {tab.count}
                </span>
              </Link>
            )
          })}
        </div>

        <VehiclesPageActions
          availableBrands={brands.filter((b) => b !== 'Toutes')}
          currentBrand={params.brand}
          currentStatus={params.status}
          currentFuelType={params.fuelType}
          currentSearch={params.search}
          parks={allParks.map((p) => ({
            id: p.id,
            name: p.name,
            city: p.city,
            code: p.code,
          }))}
        />
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-4 shadow-sm">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <input type="hidden" name="status" value={activeStatus} />

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Recherche</label>
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                name="search"
                defaultValue={params.search || ''}
                placeholder="Marque, modèle, VIN, matricule marocain..."
                className="h-9 w-full rounded-lg border border-[#262630] bg-[#16161c] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Marque</label>
            <select
              name="brand"
              defaultValue={params.brand || 'Toutes'}
              className="h-9 w-full rounded-lg border border-[#262630] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-sm"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filtrer</span>
            </button>
            <Link
              href="/vehicles"
              className="flex h-9 items-center justify-center rounded-lg border border-[#282834] bg-[#181820] px-3 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Effacer
            </Link>
          </div>
        </form>
      </div>

      {/* Vehicles Cards Grid */}
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {vehicles.map((v) => {
            const activeReservation = v.reservations.find(
              (r) => r.status === 'ACTIVE' || r.status === 'EXPIRING'
            )
            const activeRepair = v.repairs?.find((r) => r.status === 'EN_COURS')
            const lastSale = v.sales[0]

            return (
              <VehicleCardWrapper
                key={v.id}
                vehicleId={v.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#222228] bg-[#121216] overflow-hidden shadow-sm hover:border-zinc-700 hover:bg-[#15151a] transition-all cursor-pointer select-none"
              >
                {/* Photo & Top Badges */}
                <div className="relative h-48 w-full bg-gradient-to-t from-black via-zinc-900 to-zinc-950 flex items-center justify-center border-b border-[#222228] overflow-hidden">
                  {v.photos[0]?.url ? (
                    <Image
                      src={v.photos[0].url}
                      alt={`${v.brand} ${v.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600 group-hover:text-red-400 transition-colors">
                      <Car className="h-16 w-16 mb-1" />
                      <span className="text-[11px] font-semibold text-zinc-400">{v.bodyType || 'Véhicule'}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

                  <div className="absolute top-3 left-3 z-10">
                    <StatusBadge status={v.status} />
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-200 border border-zinc-700 backdrop-blur-sm">
                      {v.code}
                    </span>
                  </div>

                  {v.matricule && (
                    <div className="absolute bottom-2.5 left-3 z-10 rounded-md bg-black/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-white border border-zinc-700 backdrop-blur-sm">
                      {v.matricule}
                    </div>
                  )}

                  <div className="absolute bottom-2.5 right-3 z-10 rounded-md bg-black/80 px-2.5 py-1 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 backdrop-blur-sm flex items-center gap-1 shadow">
                    <MapPin className="h-3 w-3" />
                    <span>{v.park?.city || v.location}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/vehicles/${v.id}`}
                        className="text-base font-bold text-white group-hover:text-red-400 transition-colors"
                      >
                        {v.brand} {v.model}
                      </Link>
                      <span className="rounded-lg bg-[#1a1a22] px-2 py-0.5 text-xs font-bold text-zinc-300">
                        {v.year}
                      </span>
                    </div>

                    {v.version && (
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{v.version}</p>
                    )}

                    {/* Specs Bar */}
                    <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#17171e] p-2.5 text-center text-[11px] border border-[#22222a]">
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Boîte</span>
                        <span className="font-semibold text-zinc-200">{v.transmission}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Carburant</span>
                        <span className="font-semibold text-zinc-200">{v.fuelType}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Kilométrage</span>
                        <span className="font-semibold text-zinc-200 font-mono">
                          {v.mileage?.toLocaleString('fr-FR')} km
                        </span>
                      </div>
                    </div>

                    {/* Operational Alert Tags */}
                    {activeReservation && (
                      <div className="mt-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-300 flex items-center justify-between">
                        <span>Réservé par {activeReservation.clientName || 'Client'}</span>
                        <span className="font-mono font-bold text-amber-400">
                          <Currency amount={activeReservation.depositAmount} />
                        </span>
                      </div>
                    )}

                    {activeRepair && (
                      <div className="mt-2.5 rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1.5 text-[11px] text-purple-300 flex items-center justify-between">
                        <span>En atelier : {activeRepair.garageName || activeRepair.repairType}</span>
                        <span className="font-bold text-purple-400">{activeRepair.repairType}</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Status-Dependent Quick Actions */}
                  <div className="pt-3 border-t border-[#1e1e24] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-zinc-500 block uppercase">
                          {v.status === 'SOLD' ? 'Prix Vendu' : 'Prix de Vente'}
                        </span>
                        <div className="font-mono font-bold text-base text-white">
                          <Currency amount={v.actualSalePrice || v.targetSalePrice} />
                        </div>
                      </div>

                      <Link
                        href={`/vehicles/${v.id}`}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#2e2e38] bg-[#1a1a22] px-3 text-xs font-semibold text-zinc-300 hover:bg-[#252530] hover:text-white transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Fiche</span>
                      </Link>
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      {v.status === 'IN_STOCK' && (
                        <>
                          <Link
                            href={`/vehicles/${v.id}?tab=reservations&action=new`}
                            className="flex-1 flex h-8 items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 text-[11px] font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
                          >
                            <CalendarDays className="h-3 w-3" />
                            <span>Réserver</span>
                          </Link>
                          <Link
                            href={`/vehicles/${v.id}?tab=repairs&action=new`}
                            className="flex-1 flex h-8 items-center justify-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 text-[11px] font-bold text-purple-400 hover:bg-purple-500/20 transition-colors"
                          >
                            <Wrench className="h-3 w-3" />
                            <span>Réparation</span>
                          </Link>
                          <Link
                            href={`/sales/new?vehicleId=${v.id}`}
                            className="flex-1 flex h-8 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 text-[11px] font-bold text-white hover:bg-emerald-500 transition-colors"
                          >
                            <BadgePercent className="h-3 w-3" />
                            <span>Vendre</span>
                          </Link>
                        </>
                      )}

                      {v.status === 'RESERVED' && (
                        <>
                          <Link
                            href={`/sales/new?vehicleId=${v.id}${activeReservation ? `&reservationId=${activeReservation.id}` : ''}`}
                            className="flex-1 flex h-8 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                          >
                            <BadgePercent className="h-3.5 w-3.5" />
                            <span>Convertir en vente</span>
                          </Link>
                          <Link
                            href={`/vehicles/${v.id}#reservations`}
                            className="flex h-8 items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
                          >
                            <span>Gérer</span>
                          </Link>
                        </>
                      )}

                      {v.status === 'WORKSHOP' && (
                        <>
                          <Link
                            href={`/vehicles/${v.id}#repairs`}
                            className="flex-1 flex h-8 items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-3 text-xs font-bold text-white hover:bg-purple-500 transition-colors shadow-sm"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Clôturer réparation</span>
                          </Link>
                          <Link
                            href={`/vehicles/${v.id}#repairs`}
                            className="flex h-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 text-xs font-semibold text-purple-300 hover:bg-purple-500/20"
                          >
                            <span>Détails</span>
                          </Link>
                        </>
                      )}

                      {(v.status === 'ARCHIVED' || v.status === 'SOLD') && (
                        <div className="w-full space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400 border border-zinc-700">
                              {lastSale ? 'VENDU & ARCHIVÉ' : 'ARCHIVÉ — HORS STOCK'}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {v.archivedAt ? new Date(v.archivedAt).toLocaleDateString('fr-FR') : 'Archive'}
                            </span>
                          </div>
                          {lastSale && (
                            <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
                              <span className="text-[11px] text-zinc-400 truncate max-w-[150px]">
                                {lastSale.buyerName ? `Client : ${lastSale.buyerName}` : 'Vente clôturée'}
                              </span>
                              <Link
                                href={`/sales/${lastSale.id}`}
                                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
                              >
                                <span>Facture & Reçu</span>
                                <FileText className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          )}
                          <RestoreVehicleButton
                            vehicleId={v.id}
                            vehicleTitle={`${v.brand} ${v.model}`}
                            isSuperAdmin={activeUser.isSuperAdmin}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </VehicleCardWrapper>
            )
          })}
        </div>
      ) : (
        <EmptyState
          type="vehicles"
          title="Aucun véhicule trouvé"
          description="Aucun véhicule ne correspond aux critères de statut ou de filtre sélectionnés."
          actionHref="/vehicles/new"
        />
      )}
    </div>
  )
}
